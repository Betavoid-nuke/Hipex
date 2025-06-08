"use client"

import React, { useState, useEffect } from "react"
import { Minus, Plus, SquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {DateTimePickerForm} from "../calenderpicker/CalenderPicker"
import MordernButton from "../Buttons/MordernButton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";



export function MakeNewProject() {

  return (
    <Drawer>

      {/* trigger/ button to open the drawer */}
      <DrawerTrigger asChild>
        <div
          style={{
            width: '-webkit-fill-available',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            marginBottom: '20px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color:"black" }}>
            Create
            <SquarePlus />
          </Button> */}

          <MordernButton name='CREATE' />

        </div>
      </DrawerTrigger>

      {/* drawer logic */}
      <DrawerContent className="glass">
        <div className="flex flex=row">
          <div className="mx-auto w-full">

            {/* Header of the drawer */}
            <DrawerHeader style={{justifyContent:"center", color:"darkgray"}}>
              <DrawerTitle style={{fontSize:'28px'}}>Create New Countdown</DrawerTitle>
            </DrawerHeader>

            <div className="p-4 pb-0" style={{marginBottom:'30px'}}>
              <div className="flex flex-col items-center justify-center space-x-2">
                <ScrollArea className="" style={{overflow:'hidden', overflowWrap:'normal', height:'600px'}}>
                  {/* custom form for creating new timer */}
                  <DateTimePickerForm />
                </ScrollArea>
              </div>
            </div>

          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}






