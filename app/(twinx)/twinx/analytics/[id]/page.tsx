
"use client"

import dataManager from "@/twinx/data/data";
import { BarChart2, Calendar, ChevronDown, Clock, DollarSign, LucideProps, MousePointerClick, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Bar } from 'recharts';

const AnalyticsPagePage = () => {
    const { summary, salesRevenueChart } = dataManager().listingAnalyticData;
    const StatCard = ({ icon: Icon, title, value, color, trend }: { icon: React.ComponentType<LucideProps>, title: string, value: string, color: string, trend?: string | null}) => (
        <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C] flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className={`p-2 rounded-full bg-${color}-500/20 text-${color}-400`}>
                    <Icon size={24} />
                </div>
                {trend && <span className={`text-sm font-semibold flex items-center ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}><TrendingUp size={16} className="mr-1"/>{trend}</span>}
            </div>
            <div>
                <p className="text-3xl font-bold text-white mt-4">{value}</p>
                <p className="text-sm text-[#A0A0A5]">{title}</p>
            </div>
        </div>
    );
    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white">
            <header className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3"><BarChart2 size={28}/> Your TwinX Analytics</h2>
                <div className="flex items-center gap-2 text-sm text-[#A0A0A5]">
                    <Calendar size={16} />
                    <span>Last 30 days</span>
                    <ChevronDown size={16} />
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={DollarSign} title="Total Revenue" value={summary.totalRevenue.value} color="green" trend={summary.totalRevenue.trend} />
                <StatCard icon={TrendingUp} title="Total Sales" value={summary.totalSales.value} color="blue" trend={summary.totalSales.trend} />
                <StatCard icon={MousePointerClick} title="Total Clicks" value={summary.totalClicks.value} color="purple" trend={summary.totalClicks.trend} />
                <StatCard icon={Clock} title="Avg. Time Spent" value={summary.avgTimeSpent.value} color="yellow" trend={summary.avgTimeSpent.trend} />
            </div>
            <div className="mt-8">
                 <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                    <h3 className="text-lg font-semibold mb-4">Sales & Revenue</h3>
                    <ResponsiveContainer width="100%" height={400}>
                         <AreaChart data={salesRevenueChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#8A8A8E" />
                            <YAxis stroke="#8A8A8E" />
                            <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" />
                            <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #3A3A3C' }} />
                            <Legend />
                            <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="sales" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
};

export default AnalyticsPagePage;