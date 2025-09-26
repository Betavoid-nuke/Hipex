import { FC } from "react";
import { LucideProps } from "lucide-react";

interface PlaceholderViewProps {
  title: string;
  icon: React.ComponentType<LucideProps>;
}

const PlaceholderViewPage: FC<PlaceholderViewProps> = ({ title, icon: Icon }) => {
  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
        {Icon && <Icon size={32} />}
        {title}
      </h2>
      <div className="bg-[#262629] border border-[#3A3A3C] rounded-lg p-16 text-center text-[#A0A0A5]">
        <p>This is a placeholder page for the "{title}" section.</p>
        <p>Functionality for this area can be built out here.</p>
      </div>
    </div>
  );
};

export default PlaceholderViewPage;
