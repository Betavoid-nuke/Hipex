import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Import database models and the connection utility
import User from '@/lib/models/user.model';
import Frame from '@/lib/models/Frame.model';

// Import the Client Component and shared types
import AppClient from '../AppClient';
import { clerkClient } from "@clerk/nextjs/server";
import { connectToDB } from '@/lib/mongoose';


/**
 * A helper function to safely convert Mongoose documents into plain objects
 * that can be passed from Server to Client Components. It crucially converts
 * MongoDB's _id: ObjectId to a plain _id: string.
 */
function toPlainObject<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}

/**
 * Fetches all data required by the application from the server-side.
 * This function is robust and handles the case where a user has logged in
 * but their record is not yet in the database (due to webhook delay).
 */
export async function fetchAllData(userId: string) {
  await connectToDB();

  // find by `id` (your schema), not clerkId
  let currentUserDoc: any = await User.findOne({ id: userId }).lean();

  if (!currentUserDoc) {
    const clerk = await clerkClient();                    // ✅
    const clerkUser = await clerk.users.getUser(userId);  // ✅

    await User.create({
      id: clerkUser.id,
      username: clerkUser.username || clerkUser.id,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      image: clerkUser.imageUrl || "",
      bio: "",
      friendsid: [],              // required by your schema
      onboarded: false,
      Countdowns: [],
      communities: [],
    });

    currentUserDoc = await User.findOne({ id: userId }).lean();
  }

  const currentUser = toPlainObject(currentUserDoc!);

  const framesPromise = Frame.find({ "players.id": userId })
    .sort({ date: -1 })
    .lean();

  const friendsPromise = currentUser.friendsid
    ? User.find({ id: currentUser.friendsid }).lean()
    : Promise.resolve([]);

  const allUsersPromise = User.find({ id: { $ne: userId } }).lean();
  const leaderboardPromise = User.find({}).limit(10).lean();

  const [framesDocs, friendsDocs, allUsersDocs, leaderboardDocs] =
    await Promise.all([
      framesPromise,
      friendsPromise,
      allUsersPromise,
      leaderboardPromise,
    ]);

  return {
    currentUser,
    frames: framesDocs.map(toPlainObject),
    friends: friendsDocs.map(toPlainObject),
    allUsers: allUsersDocs.map(toPlainObject),
    leaderboard: leaderboardDocs.map(toPlainObject),
  };
}


export default async function Home() {
    // Await the auth result before destructuring
    const { userId } = await auth();

    // If no user is logged in, redirect them to sign-in
    if (!userId) {
        return redirect('/sign-in');
    }
    
    const initialData = await fetchAllData(userId);
    console.log(initialData);

    // Serialize the data before passing to the client
    return (
        <AppClient initialData={JSON.parse(JSON.stringify(initialData))} />
    );
}