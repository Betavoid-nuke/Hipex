"use client";

import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { sendBackgroundColor, sendTextColor, setBackgroundColor, setTextColor } from "../EditPage/EditPage";

interface props {
  btnname: string
}

let defaultClr:any
let backgroundColor:any;
let textColor:any;

export function getBackgroundColor(){
  if(!backgroundColor){
    return defaultClr
  }else {
    return backgroundColor;
  }
}

export function getTextolor(){
  if(!textColor){
    return defaultClr
  }else {
    return textColor;
  }
}

export default function ColorPicker({btnname}: props) {                             //bagclr - for background color, textclr - for text color

  // const [color, setColor] = useState(sendBackgroundColor() || defaultBackgroundColor);
  // useEffect(() => {
  //   setBackgroundColor(color);
  //   backgroundColor = color;
  // }, [color]);

  const defaultBackgroundColor = "#ffffff";
  const defaultTextColor = "#000000";

  //sets the default color globally
  if (btnname === 'bagclr'){
    defaultClr = defaultBackgroundColor;
  } else if (btnname === 'textclr'){
    defaultClr = defaultTextColor;
  }

  const [color, setColor] = useState(() => {
    if (btnname === 'bagclr') return sendBackgroundColor() || defaultBackgroundColor;
    if (btnname === 'textclr') return sendTextColor() || defaultTextColor;
  });

  useEffect(() => {
    if (btnname === 'bagclr') {
      setBackgroundColor(color);
      backgroundColor = color;
    } else if (btnname === 'textclr') {
      setTextColor(color);
      textColor = color;
    }
  }, [color, btnname]);

  return (
    <div>
      <HexColorPicker color={color} onChange={setColor} />
      <div className="value" style={{ color: "darkgray" }}>
        {color}
      </div>
    </div>
  );
}
