// /twinx/components/PipelineStepCard.tsx
'use client';

import { Check, LucideIcon } from "lucide-react";

interface PipelineStepCardProps {
    step: {
        id: number;
        name: string;
        description: string;
        icon: LucideIcon;
    };
    status: 'completed' | 'in-progress' | 'pending';
}

const PipelineStepCard = ({ step, status }: PipelineStepCardProps) => {
    const Icon = step.icon;
    return (
        <div className={`p-4 rounded-lg border transition-all duration-300
            ${status === 'completed' ? 'bg-green-500/10 border-green-500/30' : ''}
            ${status === 'in-progress' ? 'bg-blue-500/10 border-blue-500/50 animate-pulse' : ''}
            ${status === 'pending' ? 'bg-[#262629] border-[#3A3A3C]' : ''}
        `}>
            <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-full ${status === 'completed' ? 'bg-green-500/20 text-green-400' : ''} ${status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' : ''} ${status === 'pending' ? 'bg-[#3A3A3C] text-[#A0A0A5]' : ''}`}>
                    {status === 'completed' ? <Check size={20} /> : <Icon size={20} />}
                </div>
                <span className="font-mono text-xs text-[#A0A0A5]">Step {step.id}</span>
            </div>
            <h4 className="font-semibold mb-1 text-white">{step.name}</h4>
            <p className="text-xs text-[#A0A0A5]">{step.description}</p>
        </div>
    );
};

export default PipelineStepCard;

