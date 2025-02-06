
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
import { usePathname, useRouter } from "next/navigation";
import { createUpdateCountdown } from "@/lib/actions/user.action";

 
// form definition
const FormSchema = z.object({
  time: z.date({
    required_error: "A date and time is required.",
  }),
  CDname: z.string().min(3, { message: 'Minimun 3 characters required' }).max(500),
  CDDescription: z.string().min(5, { message: 'Minimun 5 characters required' }).max(50000),
  CDlink: z.string().min(5, { message: 'Minimun 5 characters required' }).max(50000),
  Instagram: z.boolean(),
  Facebook: z.boolean(),
  Youtube: z.boolean(),
  LinkedIn: z.boolean(),
  Twitch: z.boolean(),
  Twitter: z.boolean()
});

export function DateTimePickerForm() {

  const router = useRouter();
  const pathname = usePathname();

  // default values
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      CDname: "",
      CDDescription: "",
      CDlink: "",
      Instagram: false,
      Facebook: false,
      Youtube: false,
      LinkedIn: false,
      Twitch: false,
      Twitter: false
    },
  });
 
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {

    //when i will create the edit popup inside the edit countdown page, the CDID will be set to the _id of the countdown document as the createUpdateCountdown will use CDID to find the mongo document of the countdown user is editing and will update it
    await createUpdateCountdown({
      time: values.time,
      CDname: values.CDname,
      CDDescription: values.CDDescription,
      CDlink: values.CDlink,
      Instagram: values.Instagram,
      Facebook: values.Facebook,
      Youtube: values.Youtube,
      LinkedIn: values.LinkedIn,
      Twitch: values.Twitter,
      Twitter: values.Twitch,
      path: pathname,
      CDID: ''
    });

    if (pathname === "/") {
      router.back();
    } else {
      router.push("/");
    }

  };
 
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="">

        {/* date and time */}
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

              </div>

              <FormMessage />

            </FormItem>
          )}
        />

        {/* event information */}
        <FormField
          control={form.control}
          name='CDname'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <InputWithLabel lable="Countdown Name" Placeholder="Enter name of the countdown" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='CDDescription'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <InputWithLabel lable="Countdown Description" Placeholder="Description" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='CDlink'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <InputWithLabel lable="Event Link" Placeholder="Link to virtual event" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5"></div>
        
        {/* socials */}
        <Label className="mt-20" htmlFor="email">Social Hendles</Label>
        <div className="socials flex flex-row mr-4 ml-4 mt-4 mb-8 ">

          <FormField
            control={form.control}
            name='Instagram'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                <div className="flex items-center space-x-2 mr-4">
                <Switch 
                  id="airplane-mode"
                  checked={field.value} // Bind to form state
                  onCheckedChange={field.onChange} // Ensure it updates state
                />
                  <Label style={{fontWeight:'lighter'}}>Instagram</Label>
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='Facebook'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                <div className="flex items-center space-x-2 mr-4">
                  <Switch 
                    id="airplane-mode"
                    checked={field.value} // Bind to form state
                    onCheckedChange={field.onChange} // Ensure it updates state
                  />
                  <Label style={{fontWeight:'lighter'}}>Facebook</Label>
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='Youtube'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                  <div className="flex items-center space-x-2 mr-4">
                  <Switch 
                    id="airplane-mode"
                    checked={field.value} // Bind to form state
                    onCheckedChange={field.onChange} // Ensure it updates state
                  />
                  <Label style={{fontWeight:'lighter'}}>Youtube</Label>
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='LinkedIn'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                <div className="flex items-center space-x-2 mr-4">
                  <Switch 
                    id="airplane-mode"
                    checked={field.value} // Bind to form state
                    onCheckedChange={field.onChange} // Ensure it updates state
                  />
                  <Label style={{fontWeight:'lighter'}}>LinkedIn</Label>
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='Twitch'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                <div className="flex items-center space-x-2 mr-4">
                  <Switch 
                    id="airplane-mode"
                    checked={field.value} // Bind to form state
                    onCheckedChange={field.onChange} // Ensure it updates state
                  />
                  <Label style={{fontWeight:'lighter'}}>Twitch</Label>
                </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='Twitter'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1'>
                <FormControl>
                <div className="flex items-center space-x-2 mr-4">
                  <Switch 
                    id="airplane-mode"
                    checked={field.value} // Bind to form state
                    onCheckedChange={field.onChange} // Ensure it updates state
                  />
                  <Label style={{fontWeight:'lighter'}}>Twitter(X)</Label>
                </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        {/* Submit button */}
        <Button type="submit">Submit</Button>

      </form>
    </Form>
  );
}