"use client"

import { useEffect, useState } from "react";

interface Props {
  expdate: string | null; // Pass the expiry date as a prop
}

export default function Countdown({expdate}: Props) {

    if (!expdate) {
        return
    }

  const [timeLeft, setTimeLeft] = useState("");
  const [daysLeft, setdaysLeft] = useState("");
  const [hoursLeft, sethoursLeft] = useState("");
  const [minutesLeft, setminutesLeft] = useState("");
  const [secondsLeft, setsecondsLeft] = useState("");

  useEffect(() => { 
    const countDownDate = new Date(expdate).getTime();

    const x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(x);
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d - ${hours}h - ${minutes}m - ${seconds}s`);
      setdaysLeft(`${days}`);
      sethoursLeft(`${hours}`);
      setminutesLeft(`${minutes}`);
      setsecondsLeft(`${seconds}`);

    }, 1000);

    // Clear interval on unmount
    return () => clearInterval(x);
  }, [expdate]);

  return (
    <div className="container" style={{display:'flex', justifyContent:"center", flexDirection:'column', alignItems:'center'}}>

      <div id="countdown" className="flex items-center justify-center p-6">
        <ul className="flex gap-6 rounded-xl p-4 shadow-lg">
          <li className="textineditpage flex flex-col items-center">
            <span className="text-4xl font-bold tracking-wide">{daysLeft}</span>
            <span className="textineditpage uppercase mt-1" style={{fontSize:"28px"}}>Days</span>
          </li>
          <li className="textineditpage flex flex-col items-center">
            <span className="text-4xl font-bold tracking-wide">{hoursLeft}</span>
            <span className="textineditpage uppercase mt-1" style={{fontSize:"28px"}}>Hours</span>
          </li>
          <li className="textineditpage flex flex-col items-center">
            <span className="text-4xl font-bold tracking-wide">{minutesLeft}</span>
            <span className="textineditpage uppercase mt-1" style={{fontSize:"28px"}}>Minutes</span>
          </li>
          <li className="textineditpage flex flex-col items-center">
            <span className="text-4xl font-bold tracking-wide">{secondsLeft}</span>
            <span className="textineditpage uppercase mt-1" style={{fontSize:"28px"}}>Seconds</span>
          </li>
        </ul>
      </div>

      <div id="content" className="emoji">
        <span>🥳</span>
        <span>🎉</span>
        <span>🎂</span>
      </div>

    </div>
    
  );
}
