"use client"

import * as React from "react"
import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../command/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Command } from "../command/command"
import { setProjectType } from "../calenderpicker/CalenderPicker";

type Status = {
  value: string
  label: string
}

type ProjectTypedropdownProps = {
  setProjectType: (type: Status | null) => void
}


const statuses: Status[] = [
  {
    value: "Template",
    label: "Template Project",
  },
  {
    value: "Custom",
    label: "Custom Project",
  }
]

export function ProjectTypedropdown({ setProjectType }: ProjectTypedropdownProps) {

  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null
  )

  // Call setProjectType whenever selectedStatus changes
  React.useEffect(() => {
    setProjectType(selectedStatus)
  }, [selectedStatus])

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="w-[170px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set Project Type</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" className="w-[150px] justify-start">
              {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set Project Type</>}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
            </div>
          </DrawerContent>
        </Drawer>
    </>
  )
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void
  setSelectedStatus: (status: Status | null) => void
}) {
  return (
    <Command className="w-full">
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
