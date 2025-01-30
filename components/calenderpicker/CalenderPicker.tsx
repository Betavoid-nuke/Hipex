
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { InputWithLabel } from "../InputBtn/InputBtn";
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
 
const FormSchema = z.object({
  time: z.date({
    required_error: "A date and time is required.",
  }),
});
 
export function DateTimePickerForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(`Selected date and time: ${format(data.time, "PPPPpppp")}`);
  }
 
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("time", date);
    }
  }
 
  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues("time") || new Date();
    let newDate = new Date(currentDate);
 
    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }
 
    form.setValue("time", newDate);
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col">

              <FormLabel>Enter date & time (12h) of the Event</FormLabel>

              <div className="flex flex-col">

                {/* date and time selector */}
                <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "MM/dd/yyyy hh:mm aa")
                      ) : (
                        <span>MM/DD/YYYY hh:mm aa</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1)
                            .reverse()
                            .map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  field.value &&
                                  field.value.getHours() % 12 === hour % 12
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i * 5).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  field.value &&
                                  field.value.getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange("minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="">
                        <div className="flex sm:flex-col p-2">
                          {["AM", "PM"].map((ampm) => (
                            <Button
                              key={ampm}
                              size="icon"
                              variant={
                                field.value &&
                                ((ampm === "AM" &&
                                  field.value.getHours() < 12) ||
                                  (ampm === "PM" &&
                                    field.value.getHours() >= 12))
                                  ? "default"
                                  : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => handleTimeChange("ampm", ampm)}
                            >
                              {ampm}
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
                </Popover>

                {/* event information */}
                <InputWithLabel lable="Countdown Name" Placeholder="Enter name of the countdown"/>
                <InputWithLabel lable="Countdown Description" Placeholder="Description"/>
                <InputWithLabel lable="Event Link" Placeholder="Link to virtual event"/>

                {/* socials */}
                <Label className="mt-5" htmlFor="email">Social Hendles</Label>
                <div className="socials flex flex-row mr-4 ml-4 mt-4 mb-5 ">
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>Instagram</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>Facebook</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>Youtube</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>LinkedIn</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>Twitch</Label>
                  </div>
                  <div className="flex items-center space-x-2 mr-4">
                    <Switch id="airplane-mode" />
                    <Label style={{fontWeight:'lighter'}}>Twitter(X)</Label>
                  </div>
                </div>

              </div>

              <FormMessage />

            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}