import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AppClient from '../AppClient';
import { fetchAllData } from '@/cuetrack/Utils/fecthdata';

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