// app/(public)/hipexpage/[id]/page.tsx
import { fetchCountdownByPublishedName } from '@/lib/actions/user.action';
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaTwitch, FaTwitter } from 'react-icons/fa';
import Editpage from '@/components/EditPage/EditPage';

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params;
  const countdown = await fetchCountdownByPublishedName(id);
  const PublishedStatus = countdown?.published;

  if (!countdown) {
    return (
      <div className="text-white p-6">
        <h1 className="text-2xl font-light text-gray-500">Hipex Page Not Found.</h1>
      </div>
    );
  }

  const socialLinks: { active: boolean; icon: React.ReactNode; link: string }[] = [
    { active: !!countdown.Instagram, icon: <FaInstagram />, link: countdown.Instagramlink },
    { active: !!countdown.Facebook, icon: <FaFacebook />, link: countdown.Facebooklink },
    { active: !!countdown.Youtube, icon: <FaYoutube />, link: countdown.Youtubelink },
    { active: !!countdown.LinkedIn, icon: <FaLinkedin />, link: countdown.LinkedInlink },
    { active: !!countdown.Twitch, icon: <FaTwitch />, link: countdown.Twitchlink },
    { active: !!countdown.Twitter, icon: <FaTwitter />, link: countdown.Twitterlink },
  ];

  return (
    <>
      {PublishedStatus ? (
        <div
          className="containergrid min-h-screen bg-black text-white flex flex-col justify-between w-full"
          style={{ background: 'transparent', position: 'fixed', width: '-webkit-fill-available' } as React.CSSProperties}
        >
          <Editpage
            CDDescription={countdown.CDDescription}
            CDname={countdown.CDname}
            CDlink={countdown.CDlink}
            time={countdown.time}
            socialLinks={socialLinks}
            PageStyle={countdown.PageStyle}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center text-gray-400" style={{ height:'100%', marginTop:'300px' }}>
          <h1 className="text-2xl font-semibold">This Hipex Page is not published yet.</h1>
          <p className="mt-2 text-sm text-gray-500">Please check back later or contact the page owner.</p>
        </div>
      )}
    </>
  );
}
