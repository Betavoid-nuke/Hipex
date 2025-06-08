"use client"

import * as React from "react"
import { ReactNode, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../selectTextColor/select"
import { sendBackgroundPattern, setBackgroundPattern } from "../EditPage/EditPage";

let defaultBackgroundPattern;
let backgroundPattern:any;

export function getBackgroundPattern() {
  return backgroundPattern;
}

export function EditPagePattern() {

  const [Pattern, setPattern] = useState(sendBackgroundPattern() || defaultBackgroundPattern);  
  
  useEffect(() => {
    setBackgroundPattern(Pattern);  
    backgroundPattern = Pattern;
  }, [Pattern]);

  return (
    <Select
      value={Pattern}
      onValueChange={(value) => setPattern(value)}
    >
      <SelectTrigger className="w-[160px] text-xs" style={{fontSize:'12px'}}>
        <SelectValue style={{color:'darkgray'}} placeholder='Background Style'></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Patterns</SelectLabel>
          <SelectItem value="pattern1">LED Screen</SelectItem>
          <SelectItem value="Checks">Checks Pattern</SelectItem>
          <SelectItem value="pattern2">Star Rain</SelectItem>
          <SelectItem value="pattern3">Check Pattern</SelectItem>
          <SelectItem value="pattern4">Strong Grid Gradient</SelectItem>
          <SelectItem value="pattern5">Falling Stars</SelectItem>
          <SelectItem value="pattern6">Gradient Check Sci-Fi</SelectItem>
          <SelectItem value="pattern7">Brown Check Pattern</SelectItem>
          <SelectItem value="pattern8">Glitchy Old Broken Screen</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
