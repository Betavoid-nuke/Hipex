// /twinx/components/Toggle.tsx
'use client';

interface ToggleProps {
    enabled: boolean;
    onChange: () => void;
}

const Toggle = ({ enabled, onChange }: ToggleProps) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-500' : 'bg-[#4A4A4C]'}`}
    >
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

export default Toggle;