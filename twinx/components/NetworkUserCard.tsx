// /twinx/components/NetworkUserCard.tsx
'use client';

import { Friend } from "../lib/types";

interface NetworkUserCardProps {
    user: Friend;
}

const NetworkUserCard = ({ user }: NetworkUserCardProps) => (
    <div className="bg-[#262629] rounded-lg p-4 text-center border border-[#3A3A3C] hover:border-[#4A4A4C] transition-colors">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
        <h3 className="font-bold text-white">{user.name}</h3>
        <p className="text-sm text-[#A0A0A5]">{user.email}</p>
    </div>
);

export default NetworkUserCard;