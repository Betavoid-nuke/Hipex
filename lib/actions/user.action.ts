"use server"

import mongoose, { FilterQuery, SortOrder, Types } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/Countdowns.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Countdowns from "../models/Countdowns.model";

import { currentUser } from "@clerk/nextjs/server";
import Countdown from "../models/Countdowns.model";


//finds user
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

//create or update user
interface Params {
  userId: string | undefined;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {

    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }

  } catch (error: any) {
    console.log("failed to send data to mongo");
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}




// Optional: Use an in-memory map or Redis in production
const toggleHistory: Map<string, number[]> = new Map();
export async function publishToggle(CDID: string): Promise<void> {
  try {
    await connectToDB();
    const user = await currentUser();
    if (!user) throw new Error("User not authenticated");
    if (!CDID) throw new Error("CDID is required");

    const existing = await Countdowns.findById(CDID);
    if (!existing) throw new Error("Countdown not found");

    // Ensure the user owns the document
    if (existing.userid.toString() !== user.id.toString()) {
      throw new Error("Unauthorized access to this countdown");
    }

    // === Rate-limiting: Max 5 toggles per 10 minutes per document per user ===
    const userKey = `${user.id}_${CDID}`;
    const now = Date.now();
    const windowSize = 10 * 60 * 1000; // 10 minutes
    const maxToggles = 5;

    const history = toggleHistory.get(userKey) || [];
    const recent = history.filter((timestamp) => now - timestamp < windowSize);

    if (recent.length >= maxToggles) {
      throw new Error("Rate limit exceeded: Too many toggle attempts. Try again later.");
    }

    recent.push(now);
    toggleHistory.set(userKey, recent);

    // === Toggle the published field ===
    const toggledPublished = !existing.published;

    await Countdowns.findByIdAndUpdate(
      CDID,
      { published: toggledPublished },
      { new: false } // important: do not return or upsert
    );

  } catch (error: any) {
    console.error("Failed to toggle published:", error);
    throw new Error(`Failed to toggle published: ${error.message}`);
  }
}





//page style saved by user
interface PageStyle {
  backgroundColor?: string;
  backgroundPattern?: string;
  fontColor?: string;
  headingStyle?: string;
}

interface cdprops {
  CDID: string; // Pass empty string ("") to create a new document
  time: Date;
  CDname: string;
  CDDescription: string;
  CDlink: string;
  Instagram: boolean;
  Facebook: boolean;
  Youtube: boolean;
  LinkedIn: boolean;
  Twitch: boolean;
  Twitter: boolean;
  path: string | null;
  status: boolean;
  Instagramlink: string;
  Facebooklink: string;
  Youtubelink: string;
  LinkedInlink: string;
  Twitchlink: string;
  Twitterlink: string;
  PageStyle?: PageStyle;
  PublishedName: string;
  projectType: boolean;
  published: boolean;
}

export async function createUpdateCountdown({
  time,
  CDname,
  CDDescription,
  CDlink,
  Instagram,
  Facebook,
  Youtube,
  LinkedIn,
  Twitch,
  Twitter,
  path,
  CDID,
  status,
  Instagramlink,
  Facebooklink,
  Youtubelink,
  LinkedInlink,
  Twitchlink,
  Twitterlink,
  PageStyle,
  PublishedName,
  projectType,
  published
  
}: cdprops): Promise<void> {
  try {
    await connectToDB();
    const user = await currentUser();
    
    if (!user) throw new Error("User not authenticated");

    if (!CDID || CDID === "") {
      // Create new countdown
      const newCountdown = new Countdowns({
        time,
        CDname,
        CDDescription,
        CDlink,
        Instagram,
        Facebook,
        Youtube,
        LinkedIn,
        Twitch,
        Twitter,
        userid: user.id,
        status,
        Instagramlink,
        Facebooklink,
        Youtubelink,
        LinkedInlink,
        Twitchlink,
        Twitterlink,
        PageStyle,
        PublishedName,
        projectType,
        published

      });
      await newCountdown.save();
    } else {
      // Update existing countdown
      await Countdowns.findOneAndUpdate(
        { _id: CDID },
        {
          time,
          CDname,
          CDDescription,
          CDlink,
          Instagram,
          Facebook,
          Youtube,
          LinkedIn,
          Twitch,
          Twitter,
          userid: user.id,
          status,Instagramlink,
          Facebooklink,
          Youtubelink,
          LinkedInlink,
          Twitchlink,
          Twitterlink,
          PageStyle,
          PublishedName,
          projectType,
          published
        },
        { upsert: true, new: true }
      );
    }
    
    if (path) {
      revalidatePath('/sign-in');
    }

  } catch (error: any) {
    console.error("Failed to send data to Mongo:", error);
    throw new Error(`Failed to create/update countdown: ${error.message}`);
  }
}


type CountdownType = {
  _id: string;
  time: string | null;
  CDname: string;
  CDDescription: string;
  CDlink: string;
  Instagram: boolean;
  Facebook: boolean;
  Youtube: boolean;
  LinkedIn: boolean;
  Twitch: boolean;
  Twitter: boolean;
  userid: string;
  createdAt: string | null;
  CDID?: string;
  Instagramlink: string;
  Facebooklink: string;
  Youtubelink: string;
  LinkedInlink: string;
  Twitchlink: string;
  Twitterlink: string;
  PublishedName: string;
  PageStyle?: {
    backgroundColor?: string;
    backgroundPattern?: string;
    fontColor?: string;
    headingStyle?: string;
  };
  projectType: boolean;
  published: boolean;
};

//gets all countdowns by the user
export async function fetchUserCountdowns(): Promise<CountdownType[]> {
  try {
    await connectToDB();
    const user = await currentUser();

    if (!user?.id) return [];

    const rawResults = await Countdown.find({ userid: user.id }).lean();

    const results: CountdownType[] = rawResults.map((cd: any) => ({
      _id: cd._id.toString(),
      time: cd.time ? new Date(cd.time).toISOString() : null,
      CDname: cd.CDname,
      CDDescription: cd.CDDescription,
      CDlink: cd.CDlink,
      Instagram: cd.Instagram,
      Facebook: cd.Facebook,
      Youtube: cd.Youtube,
      LinkedIn: cd.LinkedIn,
      Twitch: cd.Twitch,
      Twitter: cd.Twitter,
      userid: cd.userid,
      createdAt: cd.createdAt ? new Date(cd.createdAt).toISOString() : null,
      CDID: cd.CDID || "",
      Instagramlink: cd.Instagramlink,
      Facebooklink: cd.Facebooklink,
      Youtubelink: cd.Youtubelink,
      LinkedInlink: cd.LinkedInlink,
      Twitchlink: cd.Twitchlink,
      Twitterlink: cd.Twitterlink,
      PublishedName:cd.PublishedName,
      PageStyle: cd.PageStyle
      ? {
          backgroundColor: cd.PageStyle.backgroundColor || "#ffffff",
          backgroundPattern: cd.PageStyle.backgroundPattern || "default",
          fontColor: cd.PageStyle.fontColor || "#000000",
          headingStyle : cd.PageStyle.headingStyle || 'default'
        }
      : undefined,
      projectType: cd.projectType,
      published: cd.published
    }));

    return results;
  } catch (error: any) {
    console.error("Error fetching user countdowns:", error);
    throw new Error(`Failed to fetch countdowns: ${error.message}`);
  }
}

export async function fetchCountdownById(id: string): Promise<CountdownType | null> {
  try {
    await connectToDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn('Invalid countdown ID:', id);
      return null;
    }

    const cd = await Countdown.findById(id).lean() as CountdownType | null;
    if (!cd) return null;

    return {
      _id: cd._id.toString(),
      time: cd.time ? new Date(cd.time).toISOString() : null,
      CDname: cd.CDname,
      CDDescription: cd.CDDescription,
      CDlink: cd.CDlink,
      Instagram: cd.Instagram,
      Facebook: cd.Facebook,
      Youtube: cd.Youtube,
      LinkedIn: cd.LinkedIn,
      Twitch: cd.Twitch,
      Twitter: cd.Twitter,
      userid: cd.userid,
      createdAt: cd.createdAt ? new Date(cd.createdAt).toISOString() : null,
      CDID: cd.CDID || '',
      Instagramlink: cd.Instagramlink,
      Facebooklink: cd.Facebooklink,
      Youtubelink: cd.Youtubelink,
      LinkedInlink: cd.LinkedInlink,
      Twitchlink: cd.Twitchlink,
      Twitterlink: cd.Twitterlink,
      PublishedName: cd.PublishedName,
      PageStyle: cd.PageStyle
      ? {
          backgroundColor: cd.PageStyle.backgroundColor || "#ffffff",
          backgroundPattern: cd.PageStyle.backgroundPattern || "default",
          fontColor: cd.PageStyle.fontColor || "#000000",
          headingStyle : cd.PageStyle.headingStyle || 'default'
        }
      : undefined,
      projectType: cd.projectType || true,
      published: cd.published
      };
  } catch (error: any) {
    console.error('Error fetching countdown by ID:', error);
    throw new Error(`Failed to fetch countdown: ${error.message}`);
  }
}

//finds the countdown by the published name for the shareable link to print the countdown on the shared punlished page.
export async function fetchCountdownByPublishedName(PublishedName: string | Promise<any>): Promise<CountdownType | null> {
  try {
    await connectToDB();

    if (!PublishedName) {
      console.warn('No Published Name Specified for fetching the model');
      return null;
    }

    const countdowns = await fetchUserCountdowns(); // Should return an array of countdowns
    if (!countdowns || !Array.isArray(countdowns)) return null;

    const cd = countdowns.find(item => item.PublishedName === PublishedName);
    if (!cd) return null;

    return {
      _id: cd._id.toString(),
      time: cd.time ? new Date(cd.time).toISOString() : null,
      CDname: cd.CDname,
      CDDescription: cd.CDDescription,
      CDlink: cd.CDlink,
      Instagram: cd.Instagram,
      Facebook: cd.Facebook,
      Youtube: cd.Youtube,
      LinkedIn: cd.LinkedIn,
      Twitch: cd.Twitch,
      Twitter: cd.Twitter,
      userid: cd.userid,
      createdAt: cd.createdAt ? new Date(cd.createdAt).toISOString() : null,
      CDID: cd.CDID || '',
      Instagramlink: cd.Instagramlink,
      Facebooklink: cd.Facebooklink,
      Youtubelink: cd.Youtubelink,
      LinkedInlink: cd.LinkedInlink,
      Twitchlink: cd.Twitchlink,
      Twitterlink: cd.Twitterlink,
      PublishedName: cd.PublishedName,
      PageStyle: cd.PageStyle
        ? {
            backgroundColor: cd.PageStyle.backgroundColor || "#ffffff",
            backgroundPattern: cd.PageStyle.backgroundPattern || "default",
            fontColor: cd.PageStyle.fontColor || "#000000",
            headingStyle: cd.PageStyle.headingStyle || 'default',
          }
        : undefined,
        projectType: cd.projectType || true,
        published: cd.published
    };

  } catch (error: any) {
    console.error('Error fetching countdown by PublishedName:', error);
    throw new Error(`Failed to fetch countdown: ${error.message}`);
  }
}






















//OLD
//find user posts
export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all threads authored by the user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", // Select the "name" and "_id" fields from the "User" model
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // Find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}



