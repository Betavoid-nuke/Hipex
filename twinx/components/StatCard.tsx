// /twinx/components/StatCard.tsx
'use client';

import { LucideIcon, TrendingUp } from "lucide-react";

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string;
    color: string;
    trend?: string | null;
}

const StatCard = ({ icon: Icon, title, value, color, trend }: StatCardProps) => (
    <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C] flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <div className={`p-2 rounded-full bg-${color}-500/20 text-${color}-400`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-sm font-semibold flex items-center ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    <TrendingUp size={16} className="mr-1"/>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-3xl font-bold text-white mt-4">{value}</p>
            <p className="text-sm text-[#A0A0A5]">{title}</p>
        </div>
    </div>
);

export default StatCard;