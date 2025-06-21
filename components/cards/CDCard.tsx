"use client"

import Image from "next/image";
import Link from "next/link";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';
import { CardMenu } from "../CardMenu/CardDDMenu";

interface propr {
  name: string,
  description: string,
  timeend: string,
  id:string,
  PublishedName: string,
  loopint: number,
  projectType?: boolean
}

function CDCard({name, description, timeend, id, PublishedName, loopint, projectType}: propr) {

  const pathname = usePathname(); // Get current path
  const [fullURL, setFullURL] = useState<string>(""); // default to empty string
  const dateObj = new Date(timeend);
  let TheURL = ""; // Initialize TheURL variable
  

  // Determine the URL based on projectType
  // If projectType is true, use "/edit/{id}", otherwise use "/customhipex/{id}"
  if(projectType) {
    TheURL = "/edit/"+ id;
  }
  else {
    TheURL = "/customhipex/"+ id;
  }
  

  // Format to "HH:MM:SS | YYYY-MM-DD"
  const formatted = `${dateObj.toTimeString().slice(0, 8)} | ${dateObj.toISOString().split("T")[0]}`;

  // Construct public share link
  useEffect(() => {
    // This code runs only on client
    const base = window.location.origin;
    const full = `${base}${pathname}hipexpage/${PublishedName}`;
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
           <Chip size="small" color="primary" icon={<FaceIcon />} style={{zIndex:'99', position:'absolute', margin:'10px'}} label="Draft" />
           <CardMenu />
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


//todo:

//need to add the published and unpublished badge and the 3 dot drop down to publish and unpublish the project
//also need a badge for custom or template project indicator
//add a preview button that opens the project in a new tab
//add a delete button that deletes the project
//add a edit button that opens the project in edit mode

//when publishing ask if user wanna share their page on discovery page for other users to see
//make a discovery page that shows all the published projects with a search bar and filter options
//allow users to like and comment on the projects
//add a feature to follow users and see their projects in a feed
//add search bar on discovert page

//maek marketplace page and add bunch of templates by hipex and allow users to but them
//show all bought templates from marketplace in the owned tab of the project type picker so users can customize them, when selected a template, send information of it to populate the page instead of populating the information filled by user in the form

//integrate secured buying system with stripe or something to allow users to buy templates and pay for them
//make a page for users to see their purchased templates and allow them to download them or use them in their projects