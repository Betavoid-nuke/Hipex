"use client"

import * as React from "react"
import { ReactNode, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../selectTextColor/select"
import { sendBackgroundPattern, sendtHeadingstyle, setBackgroundPattern, setHeadingstyle } from "../EditPage/EditPage";

let defaultHeadingStyle;
let headingStyle:any;

export function getHeadingStyle() {
  return headingStyle;
}

export function HeadingStyleSelector() {

  const [style, setstyle] = useState(sendtHeadingstyle() || defaultHeadingStyle);
  
  useEffect(() => {
    setHeadingstyle(style);
    headingStyle = style;
  }, [style]);

  return (
    <Select
      value={style}
      onValueChange={(value) => setstyle(value)}
    >
      <SelectTrigger className="w-[160px]" style={{fontSize:'12px'}}>
        <SelectValue placeholder="Heading Style" style={{color:'darkgray'}} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Heading Style</SelectLabel>
          <SelectItem value="Retro">Retro</SelectItem>
          <SelectItem value="CityNight">City Night</SelectItem>
          <SelectItem value="Neon">Neon</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
