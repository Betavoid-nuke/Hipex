
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm, useWatch } from "react-hook-form";
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
import { revalidatePath } from "next/cache";

const PageStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  backgroundPattern: z.string().optional(),
  fontColor: z.string().optional()
});
 
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
  Twitter: z.boolean(),
  status: z.boolean(),
  Instagramlink: z.string(),
  Facebooklink: z.string(),
  Youtubelink: z.string(),
  LinkedInlink: z.string(),
  Twitchlink: z.string(),
  Twitterlink: z.string(),
  PageStyle: PageStyleSchema.optional(),
  PublishedName: z.string()
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
      Twitter: false,
      status: false,
      Instagramlink: 'www.intagram.com',
      Facebooklink: 'www.facebook.com',
      Youtubelink: 'www.youtube.com',
      LinkedInlink: 'www.linkedin.com',
      Twitchlink: 'www.twitch.com',
      Twitterlink: 'www.x.com',
      PageStyle: {
        backgroundColor: "#07070a",
        fontColor: "white",
        backgroundPattern: "default"
      },
      PublishedName: ""
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
      CDID: '',
      status: false,
      Instagramlink: values.Instagramlink,
      Facebooklink: values.Facebooklink,
      Youtubelink: values.Youtubelink,
      LinkedInlink: values.LinkedInlink,
      Twitchlink: values.Twitchlink,
      Twitterlink: values.Twitterlink,
      PageStyle: {
        backgroundColor: "#07070a",
        fontColor: "white",
        backgroundPattern: "default"
      },
      PublishedName: values.PublishedName
    });

    router.push("/sign-in");

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


  //used for hidding and unhidding social media form fields when the toggle is switched
  const instagramEnabled = useWatch({
    control: form.control,
    name: 'Instagram',
  });
  const FacebookEnabled = useWatch({
    control: form.control,
    name: 'Facebook',
  });
  const YoutubeEnabled = useWatch({
    control: form.control,
    name: 'Youtube',
  });
  const LinkedInEnabled = useWatch({
    control: form.control,
    name: 'LinkedIn',
  });
  const TwitchEnabled = useWatch({
    control: form.control,
    name: 'Twitch',
  });
  const TwitterEnabled = useWatch({
    control: form.control,
    name: 'Twitter',
  });


 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">

        {/* event information */}
        <FormField
          control={form.control}
          name='CDname'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
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
            <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
              <FormControl>
                <InputWithLabel lable="Countdown Description" Placeholder="Description" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='PublishedName'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
              <FormControl>
                <InputWithLabel lable="Countdown Name for Share Link" Placeholder="Share Link Name" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='CDlink'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
              <FormControl>
                <InputWithLabel lable="Event Link" Placeholder="Link to virtual event" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* date and time */}
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-6" style={{color:'darkgray'}}>

              <FormLabel>Choose date & time (12h) of the Event</FormLabel>

              <div className="flex flex-col">

                {/* date and time selector */}
                  {/* trigger for date time picker popover */}
                    <FormControl>
                      <Button
                        variant={"link"}
                        style={{color:'darkgray', marginBottom:'20px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', width:'fit-content'}}
                      >
                        {field.value ? (
                          format(field.value, "MM/dd/yyyy hh:mm aa")
                        ) : (
                          <span>MM/DD/YYYY hh:mm aa</span>
                        )}
                      </Button>
                    </FormControl>
                  
                  {/* date time picker popover */}
                  <div className="sm:flex" style={{display:'flex', justifyContent:'center', marginBottom:'20px'}}>
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
                                  type="button"
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
                                  type="button"
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
                                type="button"
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
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-5"></div>
        
        {/* socials toggles*/}
        <Label style={{color:'darkgray'}} className="mt-20" htmlFor="email">Enable social Media buttons</Label>
        <div className="socials flex flex-row mr-4 ml-4 mt-4 mb-2 " style={{color:'darkgray'}}>

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




        {/* Social media links when enabled fields */}
        {instagramEnabled && (
          <FormField
            control={form.control}
            name='Instagramlink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="Instagram Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {FacebookEnabled && (
          <FormField
            control={form.control}
            name='Facebooklink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="Facebook Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {YoutubeEnabled && (
          <FormField
            control={form.control}
            name='Youtubelink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="Youtube Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {LinkedInEnabled && (
          <FormField
            control={form.control}
            name='LinkedInlink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="Linkedin Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {TwitchEnabled && (
          <FormField
            control={form.control}
            name='Twitchlink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="Twitch Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {TwitterEnabled && (
          <FormField
            control={form.control}
            name='Twitterlink'
            render={({ field }) => (
              <FormItem className='flex w-full flex-col gap-1' style={{color:'darkgray'}}>
                <FormControl>
                  <InputWithLabel lable="X Link" Placeholder="Link to virtual event" {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}


        {/* Submit button */}
        <Button type="submit" variant='secondary' style={{marginTop:'30px', marginBottom:'50px'}}>Submit</Button>
        
      </form>
    </Form>
  );
}