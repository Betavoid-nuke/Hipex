
import { fetchCountdownByPublishedName } from '@/lib/actions/user.action';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitch, FaTwitter } from 'react-icons/fa';
import Editpage from '@/components/EditPage/EditPage';


const ViewPage = async ({ params }: { params: { id: string } }) => {

  const { id } = await params;
  const countdown = await fetchCountdownByPublishedName(id);

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

  // console.log(countdown);

  return (
    <div className="containergrid min-h-screen bg-black text-white flex flex-col justify-between w-full" style={{ background: 'transparent', position:'fixed', width:'-webkit-fill-available' }  as React.CSSProperties}>

      {/* the edit page in use client wrapper */}
      <Editpage CDDescription={countdown.CDDescription} CDname={countdown.CDname} CDlink={countdown.CDlink} time={countdown.time} socialLinks={socialLinks} PageStyle={countdown.PageStyle} />

    </div>
  );

};

export default ViewPage;
