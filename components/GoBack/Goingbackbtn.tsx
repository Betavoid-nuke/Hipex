"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect } from "react";

interface Props {
  white: boolean;
}

function Goingbackbtn({white}: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  };

  return (
    <button onClick={handleClick} style={{backgroundColor:'none'}}>
      <Image
        src={`${white ? "/assets/backp.png" : "/assets/backblack.svg"}`}
        alt="back button"
        width={24}
        height={24}
        className="cursor-pointer object-contain mt-3 mr-3 mb-2"
      />
    </button>
  );

};

export default Goingbackbtn;
