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

      {/* Glass effect */}
      <div className="relative flex flex-col items-center justify-center h-full bg-white/10 backdrop-blur-lg rounded-lg p-8 space-y-4">
        {/* Conditionally render the logo */}
        {showLogo && (
          <Image src="/logo.png" width={64} height={64} alt="Logo" style={{marginTop: "-20px", marginBottom: "-10px"}} />
        )}
        <span className="font-semibold text-white" style={{ fontSize: "28px", marginBottom: "20px" }}>
          {projectInfo.name}
        </span>
        <SignIn />
      </div>
    </div>
  );
}
