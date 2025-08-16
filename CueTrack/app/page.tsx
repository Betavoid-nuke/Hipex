import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

// Import database models and the connection utility
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/user';
import Frame from '@/lib/models/frame';
import Venue from '@/lib/models/venue';

// Import the Client Component and shared types
import AppClient from './AppClient';
import { IUser } from '@/lib/types';

import { currentUser } from "@clerk/nextjs/server"; // to fetch user info from Clerk
import { currentUser as getClerkUser } from "@clerk/nextjs/server"; // server-side Clerk helper

/**
 * A helper function to safely convert Mongoose documents into plain objects
 * that can be passed from Server to Client Components. It crucially converts
 * MongoDB's _id: ObjectId to a plain _id: string.
 */
const toPlainObject = <T extends { _id: any }>(doc: T): Omit<T, '_id'> & { _id: string } => {
  return JSON.parse(JSON.stringify(doc));
};

/**
 * Fetches all data required by the application from the server-side.
 * This function is robust and handles the case where a user has logged in
 * but their record is not yet in the database (due to webhook delay).
 */
async function fetchAllData(userId: string) {
    await dbConnect();

    let currentUserDoc = await User.findOne({ clerkId: userId }).lean();
    const client = await clerkClient(); // now it's the actual ClerkClient object
    

    // If the user isn't in our DB yet, create them from Clerk
    if (!currentUserDoc) {
        const clerkUser = await client.users.getUser(userId);

        // Create user in DB
        await User.create({
            clerkId: clerkUser.id,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            image: clerkUser.imageUrl || "",
            avatar: clerkUser.imageUrl,
            friends: []
        });

        // Fetch newly created user as plain object
        currentUserDoc = await User.findOne({ clerkId: userId }).lean();
    }

    const currentUser = toPlainObject(currentUserDoc!);

    // Fetch other data concurrently
    const framesPromise = Frame.find({ 'players.clerkId': userId }).sort({ date: -1 }).lean();
    const friendsPromise = currentUser.friends?.length > 0
        ? User.find({ clerkId: { $in: currentUser.friends } }).lean()
        : Promise.resolve([]);
    const allUsersPromise = User.find({ clerkId: { $ne: userId } }).lean();
    const venuesPromise = Venue.find({}).lean();
    const leaderboardPromise = User.find({}).limit(10).lean();

    const [framesDocs, friendsDocs, allUsersDocs, venuesDocs, leaderboardDocs] = await Promise.all([
        framesPromise, friendsPromise, allUsersPromise, venuesPromise, leaderboardPromise
    ]);

    return {
        currentUser,
        frames: framesDocs.map(toPlainObject),
        friends: friendsDocs.map(toPlainObject),
        allUsers: allUsersDocs.map(toPlainObject),
        venues: venuesDocs.map(toPlainObject),
        leaderboard: leaderboardDocs.map(toPlainObject)
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