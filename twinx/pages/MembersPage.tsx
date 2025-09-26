"use client";

import { FC, useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  addDoc,
  setDoc,
  serverTimestamp,
  doc,
  DocumentData,
} from "firebase/firestore";
import { Users, Search, UserPlus, Send } from "lucide-react";
import { AppUser } from "../types/TwinxTypes";
import { db } from "../utils/firebaseUtils";

// Props (if you need to pass in user/friends externally)
interface MembersPageProps {
  userId: string | null;
  userEmail: string | null;
  appId: string;
  friends: AppUser[];
  showNotification: (msg: string) => void;
}

const MembersPagePage: FC<MembersPageProps> = ({
  userId,
  userEmail,
  appId,
  friends,
  showNotification,
}) => {
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchResult, setSearchResult] = useState<AppUser | { error: string } | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<AppUser | null>(null);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- Listen to chat messages ---
  useEffect(() => {
    if (!userId || !selectedFriend) {
      setMessages([]);
      return;
    }
    const chatId = [userId, selectedFriend.id].sort().join("_");
    const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${chatId}/messages`);
    const q = query(messagesRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      },
      (error) => console.error("Error fetching messages:", error)
    );

    return () => unsubscribe();
  }, [userId, selectedFriend, appId]);

  // --- Auto-scroll to bottom on new messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Search for user by email ---
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchEmail || searchEmail.toLowerCase() === userEmail?.toLowerCase()) {
      setSearchResult({ error: "Please enter a valid user email." });
      return;
    }

    const usersRef = collection(db, `/artifacts/${appId}/public/data/users`);
    const q = query(usersRef, where("email", "==", searchEmail.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const foundUser = querySnapshot.docs[0].data() as AppUser;
      setSearchResult(foundUser);
    } else {
      setSearchResult({ error: "User not found." });
    }
  };

  // --- Add friend ---
  const handleAddFriend = async () => {
    if (!userId || !searchResult || "error" in searchResult) return;

    const currentUserFriendsRef = doc(
      db,
      `/artifacts/${appId}/users/${userId}/friends`,
      searchResult.uid
    );
    await setDoc(currentUserFriendsRef, searchResult);

    showNotification(`User ${searchResult.name} added as a friend.`);
    setSearchResult(null);
    setSearchEmail("");
  };

  // --- Send message ---
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !selectedFriend?.id) return;

    const chatId = [userId, selectedFriend.id].sort().join("_");
    const messagesRef = collection(db, `/artifacts/${appId}/public/data/chats/${chatId}/messages`);

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: userId,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-white h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <Users size={28} /> Members & Chat
        </h2>
      </header>

      <div className="flex-grow flex border border-[#3A3A3C] rounded-lg overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 flex flex-col border-r border-[#3A3A3C]">
          <div className="p-4 border-b border-[#3A3A3C]">
            <h3 className="text-lg font-semibold mb-2">Find Users</h3>
            <p className="text-sm text-[#A0A0A5] mb-2">
              Your Email: <span className="font-mono">{userEmail}</span>
            </p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter user's email"
                className="flex-grow bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
              <button
                type="submit"
                className="bg-[#6366F1] p-2 rounded-md hover:bg-opacity-90"
              >
                <Search size={20} />
              </button>
            </form>

            {searchResult && (
              <div className="mt-4 p-3 bg-[#262629] rounded-md">
                {"error" in searchResult ? (
                  <p className="text-red-400">{searchResult.error}</p>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{searchResult.name}</p>
                      <p className="text-sm text-[#A0A0A5]">{searchResult.email}</p>
                    </div>
                    <button
                      onClick={handleAddFriend}
                      className="bg-green-500 p-2 rounded-md hover:bg-green-600"
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-grow p-4 overflow-y-auto hide-scrollbar">
            <h3 className="text-lg font-semibold mb-2">Friends</h3>
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`p-3 rounded-md cursor-pointer ${
                    selectedFriend?.id === friend.id
                      ? "bg-[#3A3A3C]"
                      : "hover:bg-[#262629]"
                  }`}
                >
                  <p className="font-semibold">{friend.name}</p>
                  <p className="text-sm text-[#A0A0A5]">{friend.email}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col h-full">
          {selectedFriend ? (
            <>
              <div className="p-4 border-b border-[#3A3A3C] shrink-0">
                <h3 className="font-semibold">
                  Chat with{" "}
                  <span className="text-[#A0A0A5]">{selectedFriend.name}</span>
                </h3>
              </div>

              <div className="flex-grow p-4 overflow-y-auto hide-scrollbar">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-3 ${
                      msg.senderId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-lg ${
                        msg.senderId === userId
                          ? "bg-[#6366F1] text-white"
                          : "bg-[#3A3A3C] text-white"
                      }`}
                    >
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
                  <button
                    type="submit"
                    className="bg-[#6366F1] p-2 rounded-md hover:bg-opacity-90"
                  >
                    <Send size={20} />
                  </button>
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

export default MembersPagePage;
