import React, { FC } from "react";


interface AppUser {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    id?: string; // id is sometimes used interchangeably with uid
}
interface NetworkUserCardProps {
  user: AppUser;
}

const NetworkUserCard: FC<NetworkUserCardProps> = ({ user }) => {
  return (
    <div className="bg-[#262629] rounded-lg p-4 text-center border border-[#3A3A3C] hover:border-[#4A4A4C] transition-colors">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-20 h-20 rounded-full mx-auto mb-4"
      />
      <h3 className="font-bold text-white">{user.name}</h3>
      <p className="text-sm text-[#A0A0A5]">{user.email}</p>
    </div>
  );
};

export default NetworkUserCard;
