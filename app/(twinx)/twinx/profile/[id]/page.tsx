'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Share2, Twitter, Linkedin, Globe, Link as LinkIcon, Building, Mail, MapPin } from 'lucide-react';
import { showNotification } from '@/twinx/components/AppNotification';
import ShareProfileModal from '@/twinx/components/ShareProfileModel';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { IconFolderCode } from '@tabler/icons-react';
import Button from '@mui/material/Button';
import NewProjectModal from '@/twinx/components/NewProjectModel';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getUserById } from '@/twinx/utils/twinxDBUtils.action';
import { AppUser, Job } from '@/twinx/types/TwinxTypes';

export default function ProfilePage() {

  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch user data ___________________________________
  const { user } = useUser();
  const [fetchedUser, setfetchedUser] = useState<AppUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const fetchedUser = await getUserById(user.id);
        setfetchedUser(fetchedUser)
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);
  // Fetch user data __________________________________________

  const params = useParams();
  const id = params?.id as string | null;
  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);

  const projects: any[] = [];

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    showNotification(message, 'notification');
  };

  const handleNavigate = (route: string) => {
    window.location.href = `/settings/${route}`;
  };

  return (
    <div className="text-white min-h-screen bg-[#1C1C1E]">

      {/* Header Background */}
      <div className="h-48 bg-gradient-to-r from-[#2a2a2e] to-[#3a3a3e] relative">
        <div
          className="absolute inset-0 bg-repeat opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A3A3C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Profile Header */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-24 relative z-10">
          <img
            src={
              fetchedUser?.image ||
              `https://placehold.co/100x100/A0A0A5/1C1C1E?text=${fetchedUser?.name?.[0] || "U"}`
            }
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-[#1C1C1E]"
          />

          <div className="ml-6 mt-4 sm:mt-0 text-center sm:text-left">
            <h2 className="text-3xl font-bold">{fetchedUser?.name}</h2>
            <p className="text-[#A0A0A5]">{fetchedUser?.oneSentanceIntro}</p>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:ml-auto">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C] transition-colors"
            >
              <Share2 size={20} />
            </button>
            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]">
              <Linkedin size={20} />
            </a>
            {fetchedUser?.website && fetchedUser.website.trim() !== "" && (
              <a
                href={fetchedUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"
              >
                <Globe size={20} />
              </a>
            )}
            <button
              onClick={() => copyToClipboard('https://twinx.app/u/simonprusin', 'Public profile link copied!')}
              className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"
            >
              <LinkIcon size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b border-[#3A3A3C]">
          <div className="flex items-center gap-6 overflow-x-auto">
            {['Profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-white font-semibold border-b-2 border-white'
                    : 'text-[#A0A0A5] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-[#171718] p-6 rounded-lg border border-[#3A3A3C]" style={{border:'none'}}>
              <h3 className="text-xl font-semibold mb-4">Details</h3>
              <p className="text-[#A0A0A5] text-sm mb-6">
                {fetchedUser?.bio || 'No bio available.'}
              </p>

              <div className="space-y-4 text-sm">
                {fetchedUser?.email && fetchedUser?.email.trim() !== "" && (
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-[#A0A0A5]" />
                      <span>{fetchedUser?.email}</span>
                    </div>
                )}
                {fetchedUser?.country && fetchedUser?.country.trim() !== "" && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-[#A0A0A5]" />
                      <span>{fetchedUser?.country}</span>
                    </div>
                )}
                {fetchedUser?.website && fetchedUser.website.trim() !== "" && (
                    <div className="flex items-center gap-3">
                      <LinkIcon size={16} className="text-[#A0A0A5]" />
                      <span>{fetchedUser?.website}</span>
                    </div>
                )}
                <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginTop:'20px'}}>
                    {fetchedUser?.tags?.map((tag, i) => (
                      <span key={i} className="bg-[#2e2e2e] px-3 py-1 rounded-full flex items-center gap-2">
                        #{tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            {projects.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <IconFolderCode />
                    </EmptyMedia>
                    <EmptyTitle>No Projects Yet</EmptyTitle>
                    <EmptyDescription>
                      You haven&apos;t created any projects yet. Get started by creating
                      your first project.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <div className="flex gap-2">
                      <Button onClick={() => setIsModalOpen(true)} style={{backgroundColor:'#6366f1', borderRadius:'5px', color:"white", fontWeight:'bold'}}>Create Project</Button>
                    </div>
                  </EmptyContent>
                </Empty>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Render projects here */}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Share Modal */}
      <ShareProfileModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
      />
        
    </div>
  );
}










//get get projects by the userID and show it in the right column

//make public user profile page that others can access

//make the username unique, on the onboarding form, get all users 
// and then their usernames, put them all in a array and check if the username user typed is in the array or na so it is unique