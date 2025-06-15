"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../selectTextColor/select"
import { sendtHeadingstyle, setHeadingstyle } from "../EditPage/EditPage";

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
          <SelectItem value="Neon">Seven</SelectItem>
          <SelectItem value="retro2">Retro with Hover Animation</SelectItem>
          <SelectItem value="Melting">Melting Text</SelectItem>
          <SelectItem value="Matrix">Matrix</SelectItem>
          <SelectItem value="Noeffect">No Effect</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
