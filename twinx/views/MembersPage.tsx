// /twinx/views/MembersPage.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Users, Search, UserPlus, Send } from 'lucide-react';
import { Friend, Message } from '../lib/types';
import { collection, query, where, getDocs, setDoc, doc, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

interface MembersPageProps {
    userId: string;
    userEmail: string;
    friends: Friend[];
    showNotification: (message: string) => void;
}

const MembersPage = ({ userId, userEmail, friends, showNotification }: MembersPageProps) => {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState<Friend | { error: string } | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch messages for selected friend
    useEffect(() => {
        if (!userId || !selectedFriend) {
            setMessages([]);
            return;
        }
        const chatId = [userId, selectedFriend.id || selectedFriend.uid].sort().join('_');
        const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${chatId}/messages`);
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
            setMessages(fetchedMessages);
        }, (error) => console.error("Error fetching messages:", error));

        return () => unsubscribe();
    }, [userId, selectedFriend]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchEmail || searchEmail.toLowerCase() === userEmail?.toLowerCase()) {
            setSearchResult({ error: "Please enter a valid user email." });
            return;
        }

        const usersRef = collection(db, `/artifacts/${appId}/public/data/users`);
        const q = query(usersRef, where("email", "==", searchEmail.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const foundUser = querySnapshot.docs[0].data() as Friend;
            setSearchResult(foundUser);
        } else {
            setSearchResult({ error: "User not found." });
        }
    };

    const handleAddFriend = async () => {
        if (!userId || !searchResult || 'error' in searchResult) return;

        const friendRef = doc(db, `/artifacts/${appId}/users/${userId}/friends`, searchResult.uid);
        await setDoc(friendRef, searchResult);

        showNotification(`User ${searchResult.name} added as a friend.`);
        setSearchResult(null);
        setSearchEmail('');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !userId || !selectedFriend) return;
        const chatId = [userId, selectedFriend.id || selectedFriend.uid].sort().join('_');
        const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${chatId}/messages`);
        await addDoc(messagesRef, {
            text: newMessage,
            senderId: userId,
            timestamp: serverTimestamp(),
        });
        setNewMessage('');
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white h-full flex flex-col">
             <header className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3"><Users size={28}/> Members & Chat</h2>
            </header>
            <div className="flex-grow flex border border-[#3A3A3C] rounded-lg overflow-hidden">
                {/* Left Column */}
                <div className="w-1/3 flex flex-col border-r border-[#3A3A3C]">
                    <div className="p-4 border-b border-[#3A3A3C]">
                        <h3 className="text-lg font-semibold mb-2">Find Users</h3>
                        <p className="text-sm text-[#A0A0A5] mb-2">Your Email: <span className="font-mono">{userEmail}</span></p>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="email"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="Enter user's email"
                                className="flex-grow bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                            />
                            <button type="submit" className="bg-[#6366F1] p-2 rounded-md hover:bg-opacity-90"><Search size={20} /></button>
                        </form>
                        {searchResult && (
                            <div className="mt-4 p-3 bg-[#262629] rounded-md">
                                {'error' in searchResult ? (
                                    <p className="text-red-400">{searchResult.error}</p>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{searchResult.name}</p>
                                            <p className="text-sm text-[#A0A0A5]">{searchResult.email}</p>
                                        </div>
                                        <button onClick={handleAddFriend} className="bg-green-500 p-2 rounded-md hover:bg-green-600"><UserPlus size={18} /></button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="flex-grow p-4 overflow-y-auto hide-scrollbar">
                        <h3 className="text-lg font-semibold mb-2">Friends</h3>
                        <ul>
                            {friends.map(friend => (
                                <li key={friend.uid} onClick={() => setSelectedFriend(friend)}
                                    className={`p-3 rounded-md cursor-pointer ${selectedFriend?.uid === friend.uid ? 'bg-[#3A3A3C]' : 'hover:bg-[#262629]'}`}>
                                    <p className="font-semibold">{friend.name}</p>
                                    <p className="text-sm text-[#A0A0A5]">{friend.email}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Right Column */}
                <div className="w-2/3 flex flex-col h-full">
                    {selectedFriend ? (
                        <>
                            <div className="p-4 border-b border-[#3A3A3C] shrink-0">
                                <h3 className="font-semibold">Chat with <span className="text-indigo-400">{selectedFriend.name}</span></h3>
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto hide-scrollbar">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex mb-3 ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`p-3 rounded-lg max-w-lg ${msg.senderId === userId ? 'bg-[#6366F1] text-white' : 'bg-[#3A3A3C] text-white'}`}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 border-t border-[#3A3A3C] shrink-0">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-grow bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                                    />
                                    <button type="submit" className="bg-[#6366F1] p-2 rounded-md hover:bg-opacity-90"><Send size={20} /></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-[#A0A0A5]">
                            <p>Select a friend to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembersPage;