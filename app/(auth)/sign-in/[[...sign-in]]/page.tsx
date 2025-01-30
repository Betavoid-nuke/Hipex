import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import projectInfo from "../../../../CustomizingPlatform/information.json";

export default function Page() {
  // Extracting values from JSON
  const gradientColors = projectInfo.colors.join(", ");
  const showLogo = projectInfo.showLogoOnSigninPage;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Moving gradient background */}
      <div
        className="absolute inset-0 opacity-75 animate-gradient"
        style={{
          background: `linear-gradient(-45deg, ${gradientColors})`,
          backgroundSize: "300% 300%",
        }}
      ></div>

      {/* Centered glass effect container */}
      <div className="flex items-center justify-center h-full">
        {/* Glass effect block */}
        <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Conditionally render the logo */}
            {showLogo && (
              <Image
                src="/logo.png"
                width={64}
                height={64}
                alt="Logo"
                className="mb-2"
              />
            )}
            <span className="font-semibold text-white text-center text-2xl">
              {projectInfo.name}
            </span>
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
