"use client";

import Countdown from "../Countdown/Countdown";
import { ReactNode, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions
interface SocialLink {
  active: boolean;
  icon: ReactNode;
  link: string;
}

//page style saved by user
interface PageStyle {
  backgroundColor?: string;
  backgroundPattern?: string;
  fontColor?: string;
  headingStyle?: string;
}

interface Props {
  CDDescription: string;
  CDname: string;
  CDlink: string;
  time: string | null;
  socialLinks: SocialLink[];
  PageStyle?: PageStyle;
}


// Global setter function placeholder
let externalSetTxColor: (txcolor: string) => void = () => {}; //for text
let externalSetBgColor: (color: string) => void = () => {}; //for background
let externalSetBgPattern: (pattern: string) => void = () => {}; //for patterns
let externalSetHeadingStyle: (hstyle: string) => void = () => {}; //for patterns

let TextColorforsend:any;
let backgroundColorforsend:any;
let backgroundPatternforsend:any;
let headingstyleforsend:any;

let textColorChanged = false;
let backgroundColorChanged = false;
let backgroundPatternChanged = false;
let headingstyleChanged = false;



//-------------------------------------------------------------------------text color
// Exposed function to be called from outside for background colors
export function setTextColor(colortx: string) {
  if (externalSetTxColor) {
    externalSetTxColor(colortx);
    TextColorforsend = colortx;
    console.log("TextColor Picked - " + colortx);
  }
}

//gets bacground color from the btn
export function sendTextColor() {
  if(TextColorforsend){return(TextColorforsend);}
}



//-------------------------------------------------------------------------background color
// Exposed function to be called from outside for background colors
export function setBackgroundColor(colorbg: string) {
  if (externalSetBgColor) {
    externalSetBgColor(colorbg);
    backgroundColorforsend = colorbg;
    console.log("backgroundColor Picked - " + colorbg);
  }
}

//gets bacground color from the btn
export function sendBackgroundColor() {
  if(backgroundColorforsend){return(backgroundColorforsend);}
}




//-------------------------------------------------------------------------background Pattern
// Exposed function to be called from outside for background pattern
export function setBackgroundPattern(colorPt: string) {
  if (externalSetBgPattern) {
    externalSetBgPattern(colorPt);
    backgroundPatternforsend = colorPt;
    console.log("backgroundPattern Picked - " + colorPt);
  }
}

//gets background pattern from the btn
export function sendBackgroundPattern() {
  if(backgroundPatternforsend){return(backgroundPatternforsend);}
}



//-------------------------------------------------------------------------Heading style
// Exposed function to be called from outside for Heading style
export function setHeadingstyle(headingsty: string) {
  if (externalSetHeadingStyle) {
    externalSetHeadingStyle(headingsty);
    headingstyleforsend = headingsty;
    console.log("heading style Picked - " + headingsty);
  }
}

//gets background pattern from the btn
export function sendtHeadingstyle() {
  if(headingstyleforsend){return(headingstyleforsend);}
}




// Main Component
export default function EditPage({
  CDDescription,
  CDname,
  CDlink,
  time,
  socialLinks,
  PageStyle
}: Props) {

  console.log(PageStyle);

  const [isLoading, setIsLoading] = useState(true);
  const [bgColor, setBgColor] = useState(PageStyle?.backgroundColor || 'black'); // passing the background color from the database
  const [bgPattern, setBgPattern] = useState(PageStyle?.backgroundPattern || 'default'); // passing the background pattern from the database

  const [headingStyle, setheadingStyle] = useState(PageStyle?.headingStyle || 'default'); // passing the background pattern from the database
  const [txColor, setTxPattern] = useState(PageStyle?.fontColor || '#ffffff'); // passing the text color from the database

  if(PageStyle){ //setting page style globally in this page, to be used
    if(!backgroundColorChanged){ //so that the background color is sent to color picker for first time and when user changes it, this wont keep setting color back to the default
      backgroundColorforsend = PageStyle.backgroundColor;
    } else if (!backgroundPatternChanged){
      backgroundPatternforsend = PageStyle.backgroundPattern;
      getContainerClassName(backgroundPatternforsend);
    } else if (!textColorChanged){
      TextColorforsend = PageStyle.fontColor;
    }
  }

  // COLLORS - Provide the setter to global scope for external control and change detection
  useEffect(() => {

    //send the default color to the color picker
    backgroundColorChanged = true;

    //when coloer changed, we use that new color in the div using this
    externalSetBgColor = setBgColor;

    return () => {
      externalSetBgColor = () => {};
    };
  }, []);

  // TEXT COLLORS - Provide the setter to global scope for external control and change detection
  useEffect(() => {

    //send the default color to the color picker
    textColorChanged = true;

    //when coloer changed, we use that new color in the div using this
    externalSetTxColor = setTxPattern;

    return () => {
      externalSetTxColor = () => {};
    };
  }, []);

  // PATTERN - Provide the setter to global scope for external control and change detection
  useEffect(() => {

    //send the default color to the color picker
    backgroundPatternChanged = true;

    //when coloer changed, we use that new color in the div using this
    externalSetBgPattern = setBgPattern;

    return () => {
      externalSetBgPattern = () => {};
    };
  }, []);
  
  // PATTERN - selects the pattern for background
  function getContainerClassName(pattern: string): string {
    switch (pattern) {
      case "default":
        return "containergrid_checks";
      case "pattern1":
        return "containergrid_checks1";
      case "pattern2":
        return "containergrid_checks2";
      case "pattern3":
        return "containergrid_checks3";
      case "pattern4":
        return "containergrid_checks4";
      case "pattern5":
        return "containergrid_checks5";
      case "pattern6":
        return "containergrid_checks6";
      case "pattern7":
        return "containergrid_checks7";
      case "pattern8":
        return "containergrid_checks8";
      default:
        return "containergrid_checks"; // fallback to default
    }
  }

  // HEADING STYLE - Provide the setter to global scope for external control and change detection
  useEffect(() => {

    //send the default color to the color picker
    headingstyleChanged = true;

    //when coloer changed, we use that new color in the div using this
    externalSetHeadingStyle = setheadingStyle;

    return () => {
      externalSetHeadingStyle = () => {};
    };
  }, []);

  // HEADING STYLE - selects the pattern for background
  function getHeadingClassName(style: string): string {
    switch (style) {
      case "Retro":
        return "headingStyle1";
      case "CityNight":
        return "headingStyle1";
      case "Neon":
        return "default";
      default:
        return ""; // fallback to default
    }
  }

  //Simulate prop readiness check
  useEffect(() => {
    const allPropsPresent =
      CDDescription && CDname && CDlink && time !== null && Array.isArray(socialLinks);

    if (allPropsPresent) {
      setIsLoading(false);
    }
  }, [CDDescription, CDname, CDlink, time, socialLinks]);

  if (isLoading) {
    return (
      <div
        className="containergrid min-h-screen text-white flex flex-col justify-between w-full"
        style={{ backgroundColor: "#1f1f1f" }} // optional dark placeholder bg
      >
        <div className="p-8 max-w-4xl mx-auto w-full flex-grow">
          {/* Title */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-[60px] w-[300px] rounded-lg" />
          </div>

          {/* Description */}
          <div className="flex justify-center mb-12">
            <Skeleton className="h-[20px] w-[400px] rounded" />
          </div>

          {/* Countdown Placeholder */}
          <div className="flex justify-center mb-20">
            <Skeleton className="h-[50px] w-[200px] rounded-md" />
          </div>

          {/* Register Button Wrapper Placeholder */}
          <div className="flex justify-center mb-20">
            <Skeleton className="h-[80px] w-[160px] rounded-xl" />
          </div>
        </div>

        {/* Social Media Icons Skeleton */}
        <div className="glassgen fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-full px-6 py-3 shadow-lg flex gap-4 z-50 border border-gray-700">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[24px] w-[24px] rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${getContainerClassName(bgPattern)} min-h-screen text-white flex flex-col justify-between w-full`}
      style={{ backgroundColor: bgColor, ['--editpagetextcolor' as any]: txColor, display:'flex', flexWrap:'wrap', alignItems:'center' }}
    >

      <div className="p-8 max-w-4xl mx-auto w-full flex-grow" style={{zIndex:"99"}}>
        <h1 className={`${getHeadingClassName(headingStyle)} textineditpage fontMain font-light mb-2 text-center`} style={{ fontSize: "54px" }}>
          {CDname}
        </h1>
        <p className={`${getHeadingClassName(headingStyle)}SH textineditpage fontMain text-gray-400 text-center max-w-xl mx-auto mb-12 text-lg font-light`}>
          {CDDescription}
        </p>

        <div className="flex justify-center mb-20">
          <Countdown expdate={time} />
        </div>

        

      </div>


      <div className="fixed bottom-4" style={{display:'flex', flexDirection:'row', alignItems:'center', zIndex:'110'}}>

        <div className="glassgen transform bg-gray-800 rounded-full px-6 py-3 shadow-lg flex gap-4 z-50 border border-gray-700" style={{zIndex:'99'}}>
          {socialLinks.map((link, index) =>
          link.active ? (
            <a
              key={index}
              href={
                link.link.startsWith("http") ? link.link : `https://${link.link}`
              }
              className="text-white hover:text-fuchsia-400 transition text-xl cursor-default"
              aria-label="Social media icon"
            >
              {link.icon}
            </a>
          ) : null
          )}
        </div>

        <div className="flex justify-center ml-10 mr-10">
          <div className="wrapper">
          <div className="display">Register</div>
          <span></span>
          <span></span>
          </div>
        </div>

        <div className="flex justify-center">
          <div
            className="glassgen hover:scale-x-105 transition-all duration-300 *:transition-all *:duration-300 flex justify-start text-2xl items-center shadow-xl z-10 gap-2 p-2 rounded-full"
          >
            <button
              className="glassgen before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Like'] dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 rounded-full p-2 px-3"
            >
              👍
            </button>
            <button
              className="glassgen before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Cheer']  dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 rounded-full p-2 px-3"
            >
              👏🏻
            </button>
            <button
              className="glassgen before:hidden hover:before:flex before:justify-center before:items-center before:h-4 before:text-[.6rem] before:px-1 before:content-['Celebrate']  dark:before:bg-white dark:before:text-black before:text-white before:bg-opacity-50 before:absolute before:-top-7 before:rounded-lg hover:-translate-y-5 cursor-pointer hover:scale-125 rounded-full p-2 px-3"
            >
              🎉
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}











//do somthing nice for when the countdown has ended
//add a marker on card which shows if the countdown has ended or not
//remove the time for the countdown from the card, just the date is fine.
//figureout the stickers, allow users to put stickers.
//make a new layout and page for the preview page which will use name in the [id] or make another field in the form for the name user want in the link.
  //whatever name user puts in, that name, we will get in the card and assemble a sareable link. and in the preview page, we will use that name to filter the countdowns and find the one needed
//make a edit button for changing color of the text too