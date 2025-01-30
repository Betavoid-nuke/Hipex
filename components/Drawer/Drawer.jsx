"use client"

import React, { useState } from "react"
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

export function MakeNewProject() {
  const [goal, setGoal] = useState(350)

  function onClick(adjustment) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

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
            backgroundColor: 'lightgreen',
            borderRadius: '8px',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Create
            <SquarePlus />
          </Button>
        </div>
      </DrawerTrigger>

      {/* drawer logic */}
      <DrawerContent>
        <div className="mx-auto w-520">

          {/* Header of the drawer */}
          <DrawerHeader>
            <DrawerTitle style={{fontSize:'28px'}}>Create New Countdown</DrawerTitle>
          </DrawerHeader>

          <div className="p-4 pb-0" style={{marginBottom:'30px'}}>
            <div className="flex flex-col items-center justify-center space-x-2">
              <DateTimePickerForm />
            </div>
            <div className="mt-3 h-[120px]">
            </div>
          </div>

        </div>
      </DrawerContent>
    </Drawer>
  )
}



