'use client'

import { createUpdateCountdown } from "@/lib/actions/user.action";
import { getBackgroundColor, getTextolor } from "../ColorPicker/ColorPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form
} from "@/components/ui/form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getBackgroundPattern } from "../PagePattern/EditPagePattern";
import { getHeadingStyle } from "../HeadingStyle/HeadingStyleSelector";



const PageStyleSchema = z.object({
  backgroundColor: z.string().optional(),
  backgroundPattern: z.string().optional(),
  fontColor: z.string().optional(),
  headingStyle: z.string().optional()
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



type CountdownType = {
  _id: string;
  time: string | null;
  CDname: string;
  CDDescription: string;
  CDlink: string;
  Instagram: boolean;
  Facebook: boolean;
  Youtube: boolean;
  LinkedIn: boolean;
  Twitch: boolean;
  Twitter: boolean;
  userid: string;
  createdAt: string | null;
  CDID?: string;
  Instagramlink: string;
  Facebooklink: string;
  Youtubelink: string;
  LinkedInlink: string;
  Twitchlink: string;
  Twitterlink: string;
  PageStyle?: {
    backgroundColor?: string;
    backgroundPattern?: string;
    fontColor?: string;
    headingStyle?: string;
  };
  PublishedName: string;
};

interface props {
    countdown: CountdownType;
    CDID: string;
}


export default function SaveButton({countdown, CDID} : props){


    //------------saving the page
    // default values for saving project
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        time: countdown.time ? new Date(countdown.time) : new Date(),
        CDname: countdown.CDname,
        CDDescription: countdown.CDDescription,
        CDlink: countdown.CDlink,
        Instagram: countdown.Instagram,
        Facebook: countdown.Facebook,
        Youtube: countdown.Youtube,
        LinkedIn: countdown.LinkedIn,
        Twitch: countdown.Twitch,
        Twitter: countdown.Twitter,
        status: false,
        Instagramlink: countdown.Instagramlink,
        Facebooklink: countdown.Facebooklink,
        Youtubelink: countdown.Youtubelink,
        LinkedInlink: countdown.LinkedInlink,
        Twitchlink: countdown.Twitchlink,
        Twitterlink: countdown.Twitterlink,
        PageStyle: {
          backgroundColor: getBackgroundColor(),
          fontColor: getTextolor(),
          backgroundPattern: getBackgroundPattern(),
          headingStyle: getHeadingStyle()
        },
        PublishedName: countdown.PublishedName
      }

    });

    //saves the project
    const onSubmit = async (values: z.infer<typeof FormSchema>) => {

      const loader = document.getElementsByClassName('loader')[0] as HTMLElement;
      const saveText = document.getElementsByClassName('saveText')[0] as HTMLElement;
      
      if (loader) loader.style.display = 'block';
      if (saveText) saveText.style.display = 'none';
      
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
        Twitch: values.Twitch,
        Twitter: values.Twitter,
        path: '/',
        CDID: CDID, //passing CDID so it updates
        status: false,
        Instagramlink: values.Instagramlink,
        Facebooklink: values.Facebooklink,
        Youtubelink: values.Youtubelink,
        LinkedInlink: values.LinkedInlink,
        Twitchlink: values.Twitchlink,
        Twitterlink: values.Twitterlink,
        PageStyle: {
          backgroundColor: getBackgroundColor(), //gets the color from the colorpicker
          fontColor: getTextolor(), //get new text color
          backgroundPattern: getBackgroundPattern(), //get new background pattern
          headingStyle: getHeadingStyle()
        },
        PublishedName: values.PublishedName
      });

      if (loader) loader.style.display = 'none';
      if (saveText) saveText.style.display = 'block';

      toast("Changes Saved", {
        description: "Saved your changes!",
        className: "bg-green-600 text-white border-none shadow-md mb-10",
      });

    };
    //------------saving the page


    return (
        <>
        {/* button to save all changes */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <Button type="submit" className="fixed bottom-4 right-4 bg-green-600 text-white px-14 py-2 rounded-lg shadow-lg z-50 hover:bg-green-700">
              <div className="loader" style={{display:'none'}}>
                <div></div>

                <div></div>
              </div>
              <div className="saveText">Save</div>
            </Button>
          </form>
        </Form>
        </>
    )
}