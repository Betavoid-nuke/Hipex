"use client"

import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

interface propr {
  name: string,
  description: string,
  timeend: string,
  id:string,
  PublishedName: string,
  loopint: number
}

function CDCard({name, description, timeend, id, PublishedName, loopint}: propr) {

  const pathname = usePathname(); // Get current path
  const [fullURL, setFullURL] = useState<string>();

  const dateObj = new Date(timeend);
  const TheURL = "/edit/"+ id;

  // Format to "HH:MM:SS | YYYY-MM-DD"
  const formatted = `${dateObj.toTimeString().slice(0, 8)} | ${dateObj.toISOString().split("T")[0]}`;

  // Construct public share link
  useEffect(() => {
    // This code runs only on client
    const base = window.location.origin;
    const full = `${base}${pathname}/hipexpage/${PublishedName}`;
    setFullURL(full);
  }, [pathname, PublishedName]);

  const loopintforanimation = loopint/30;

  return(
      <motion.div
        initial={{ opacity: 0, y: 120 }}
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: loopintforanimation }}
        className="glow-border p-6 rounded-xl text-white w-64 mb-10"
      >
        <Link href={TheURL}>
          <div className="cardThumbnail" style={{ height: "150px", position: "relative" }}>
           <Image
             src="/assets/cards/1.jpg"
             alt="Thumbnail"
             layout="fill"
             objectFit="cover"
             className="rounded-md"
           />
          </div>
          <h2 className="text-white font-light mt-2" style={{fontSize:'20px'}}>{name}</h2>
          <p className="text-gray-400" style={{display:'flex', overflow:'hidden', height:'40px', fontSize:'14px', marginBottom:"20px"}}>{description}</p>
          <p className="text-fuchsia-500 font-semibold" style={{color:'#56adff'}}>{formatted}</p>
        </Link>
        <Input style={{marginTop:'20px', color:'darkgray', fontSize:'14px'}} readOnly type="text" value={fullURL} />
      </motion.div>
  )

}
export default CDCard;