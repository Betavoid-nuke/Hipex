"use client";

import React, { FC, useState, useEffect } from "react";
import { UserPlus, UserMinus } from "lucide-react";
import { AppUser } from "../types/TwinxTypes";
import { getUserById } from "../utils/twinxDBUtils.action";
import { Button } from "@/components/ui/button";

interface UserCardProps {
  user: AppUser;
  currentUserId: string | null; // 👈 Pass the current logged-in user's ID
  onConnectionChange?: () => void; // optional callback to refresh UI/list
}

const UserCard: FC<UserCardProps> = ({ user, currentUserId, onConnectionChange }) => {

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserMongoID, setcurrentUserMongoID] = useState('');
  const [currentUser, setcurrentUser] = useState<AppUser>({} as AppUser);

  const currentJob = user.jobs?.[0] || null;
  const connectionsCount = user.friendsId?.length || 0;
  const listedCount = (user.listedAssets?.length || 0) + (user.listedTwins?.length || 0);
  const companyName = currentJob ? currentJob.company : "Self-Employed";

  // --- Check if current user already follows this user ---
  useEffect(() => {
    const checkFollowing = async () => {
      try {
        if(currentUser){
          if (currentUser?.friendsId?.some(id => id.toString() === user._id.toString())) {
            setIsFollowing(true); 
          }
        }
      } catch (err) {
        console.error("Failed to check following:", err);
      }
    };

    checkFollowing();
  }, [currentUser, user.id]);

  //gets the mongo _id of the current user
  useEffect(() => {
    const curuser = async () => {
      if (currentUserId) {
        const fetchedUser = await getUserById(currentUserId);
        if (fetchedUser) {
          setcurrentUserMongoID(fetchedUser._id);
          setcurrentUser(fetchedUser);
        }
      }
    }
    curuser();
  }, [currentUserId]);

  // --- Follow or Unfollow ---
  const handleFollowToggle = async () => {
    if (!currentUserId || !user.id) return;
    setLoading(true);

    try {
      const endpoint = isFollowing
        ? "/api/users/remove-friend"
        : "/api/users/add-friend";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserMongoID, friendId: user._id }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      console.log("✅ Friend update result:", data);

      // Toggle local follow state
      setIsFollowing(!isFollowing);

      // Notify parent if provided
      onConnectionChange?.();
    } catch (err) {
      console.error("❌ Error updating follow status:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      key={user.id}
      className="bg-[#262629] border-b border-[#3A3A3C] p-4 flex flex-col sm:flex-row gap-4 transition duration-200 hover:bg-[#3A3A3C] last:border-b-0"
      style={{display:'flex', alignItems:'center'}}
    >
      <img
        src={
          user.image ||
          `https://placehold.co/100x100/A0A0A5/1C1C1E?text=${user.name?.[0] || "U"}`
        }
        alt={user.name}
        onError={(e) => {
          (e.target as HTMLImageElement).onerror = null;
          (e.target as HTMLImageElement).src = `https://placehold.co/100x100/A0A0A5/1C1C1E?text=${
            user.name?.[0] || "U"
          }`;
        }}
        className="w-16 h-16 rounded-full object-cover border border-[#6366F1] flex-shrink-0"
      />

      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-white text-lg truncate">
          {user.name} <span className="text-[#A0A0A5]">({user.username})</span>
        </h4>
        {user.oneSentanceIntro && (
          <p className="text-sm text-[#A0A0A5] mb-1 truncate">{user.oneSentanceIntro}</p>
        )}

        <p className="text-sm text-[#A0A0A5] mb-1 truncate font-semibold">
          {companyName}
        </p>

        <p className="text-xs text-[#A0A0A5] flex gap-3">
          <span>Listed: {listedCount}</span>
          <span className="text-[#6366F1]">|</span>
          <span>Following: {connectionsCount}</span>
        </p>
      </div>

      <button
        onClick={handleFollowToggle}
        disabled={loading}
        className={`self-start sm:self-center h-fit px-4 py-1.5 text-sm font-semibold rounded-none flex items-center gap-1 whitespace-nowrap transition duration-200
          ${
            isFollowing
              ? "bg-transparent text-white border-[#6366F1] hover:bg-transparent hover:text-red-500"
              : "bg-transparent text-[#6366F1] border-[#6366F1] hover:bg-[#6366F1] hover:text-white"
          }
        `}
        style={{outline:'none'}}
      >
        {loading ? (
          <span className="text-xs opacity-70">...</span>
        ) : isFollowing ? (
          <>
            <UserMinus size={16} /> Unfollow
          </>
        ) : (
          <>
            <UserPlus size={16} /> Follow
          </>
        )}
      </button>
      
    </div>
    
  );

};

export default UserCard;
