"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DatePicker>

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("relative", className)}>
      <DatePicker
        calendarClassName="!bg-white !border !rounded-lg !p-2 shadow-md"
        dayClassName={() =>
          cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-8 p-0 text-sm font-normal hover:bg-accent"
          )
        }
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex items-center justify-between mb-2 px-2">
            <button
              onClick={decreaseMonth}
              disabled={prevMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 p-0 flex items-center justify-center"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {date.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={increaseMonth}
              disabled={nextMonthButtonDisabled}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 p-0 flex items-center justify-center"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
