"use server"

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/Countdowns.model";
import User from "../models/user.model";

import { connectToDB } from "../mongoose";
import Countdowns from "../models/Countdowns.model";

import { currentUser } from "@clerk/nextjs/server";
import { FormSchema } from "@/Shraded/types.ts/FormSchema";
import { genModel } from "@/Shraded/ModelGenrator/genModel";


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



//create or update countdown
interface cdprops {
  CDID: string, // Pass empty string ("") to create a new document
  time: Date,
  CDname: string,
  CDDescription: string,
  CDlink: string,
  Instagram: boolean,
  Facebook: boolean,
  Youtube: boolean,
  LinkedIn: boolean,
  Twitch: boolean,
  Twitter: boolean,
  path: string;
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
  CDID
}: cdprops): Promise<void> {
  try {
    await connectToDB();

    const user = await currentUser();

    //mongo model genrator +++++++++++++++++++++
    const formSchema: FormSchema = {
      fields: [
        { name: "time", type: "date", label: "Time", required: true },
        { name: "CDname", type: "text", label: "Countdown Name", required: true },
        { name: "CDDescription", type: "text", label: "Countdown Description", required: true },
        { name: "CDlink", type: "text", label: "Countdown Link", required: true },
        { name: "Instagram", type: "text", label: "Instagram", required: false },
        { name: "Facebook", type: "text", label: "Facebook", required: false },
        { name: "Youtube", type: "text", label: "Youtube", required: false },
        { name: "LinkedIn", type: "text", label: "LinkedIn", required: false },
        { name: "Twitch", type: "text", label: "Twitch", required: false },
        { name: "Twitter", type: "text", label: "Twitter", required: false },
        { name: "CDID", type: "text", label: "CDID", required: false },
        { name: "userid", type: "text", label: "userid", required: true }
      ],
    };
    const model = genModel(formSchema, "Countdown2");
    //this genrates the mongo model and saved it in the lib/models and returs that model to the const model
    //we can use const model for all the mongo operations like findoneandupdate()
    //mongo model genrator +++++++++++++++++++++




    // Check if CDID is provided, if not create a new countdown
    if (!CDID || CDID === "") {
      // Create new countdown if CDID is empty
      const newCountdown = new model({
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
        userid: user?.id
      });
      await newCountdown.save(); // Save the new countdown
    } else {
      // Update existing countdown with the provided CDID
      await model.findOneAndUpdate(
        { _id: CDID }, // Find by _id (provided CDID)
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
          userid: user?.id
        },
        { upsert: true, new: true } // If document not found, it will create a new one
      );
    }

    if (path === "/") {
      revalidatePath(path);
    }

  } catch (error: any) {
    console.log("failed to send data to mongo");
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}



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



