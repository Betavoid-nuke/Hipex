import { FC } from "react";
import { NavHeaderProps } from "../types/TwinxTypes";

const NavHeader: FC<NavHeaderProps> = ({ text, isSidebarExpanded }) => (
  <h3
    className={`text-xs uppercase text-[#8A8A8E] font-semibold tracking-wider px-3 mt-4 mb-2 transition-opacity duration-200 ease-in-out ${
      !isSidebarExpanded ? "opacity-0" : "opacity-100"
    }`}
  >
    {text}
  </h3>
);

export default NavHeader;