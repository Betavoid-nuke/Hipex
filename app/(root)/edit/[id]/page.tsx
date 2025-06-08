
import { createUpdateCountdown, fetchCountdownById } from '@/lib/actions/user.action';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitch, FaTwitter } from 'react-icons/fa';
import Editpage from '@/components/EditPage/EditPage';
import { EditButton } from '@/components/EditMenuButton.tsx/EditBtn';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form
} from "@/components/ui/form";
import SaveButton from '@/components/SaveButton/SaveButton';
import { TextColorSelector } from '@/components/selectTextColor/TextColorSelector';
import { EditPagePattern } from '@/components/PagePattern/EditPagePattern';
import { HeadingStyleSelector } from '@/components/HeadingStyle/HeadingStyleSelector';


const Page = async ({ params }: { params: { id: string } }) => {

  const { id } = params;
  const countdown = await fetchCountdownById(id);

  if (!countdown) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-light text-gray-500">Hipex Page Not Found.</h1>
      </div>
    );
  }

  // Create an array of social links based on boolean flags:
  const socialLinks: { active: boolean; icon: React.ReactNode, link: string }[] = [
    { active: !!countdown.Instagram, icon: <FaInstagram />, link: countdown.Instagramlink  },
    { active: !!countdown.Facebook, icon: <FaFacebook />, link: countdown.Facebooklink  },
    { active: !!countdown.Youtube, icon: <FaYoutube />, link: countdown.Youtubelink  },
    { active: !!countdown.LinkedIn, icon: <FaLinkedin />, link: countdown.LinkedInlink  },
    { active: !!countdown.Twitch, icon: <FaTwitch />, link: countdown.Twitchlink  },
    { active: !!countdown.Twitter, icon: <FaTwitter />, link: countdown.Twitterlink  },
  ];

  return (
    <div className="containergrid min-h-screen bg-black text-white flex flex-col justify-between w-full" style={{ background: 'transparent', position:'fixed', width:'-webkit-fill-available' }  as React.CSSProperties}>
      
      {/* tool bar */}
      <div className='glass' style={{display:'flex', justifyContent:'left', padding:'5px', flexDirection:'row', alignItems:'center', marginLeft:'0px', marginRight:'10px', gap:'20px', zIndex:'99', alignContent:'stretch', flexWrap:'wrap'}}>
        <EditButton />
        <TextColorSelector />
        <EditPagePattern />
        <HeadingStyleSelector />
      </div>

      {/* the edit page in use client wrapper */}
      <Editpage CDDescription={countdown.CDDescription} CDname={countdown.CDname} CDlink={countdown.CDlink} time={countdown.time} socialLinks={socialLinks} PageStyle={countdown.PageStyle} />

      {/* button to save all changes */}
      <SaveButton countdown={countdown} CDID={countdown._id} />

    </div>
  );

};

export default Page;
