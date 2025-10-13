'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Plus, Trash } from 'lucide-react';
import { getUserById } from '@/twinx/utils/twinxDBUtils.action';
import LightRays from '@/General/Backgrounds/Lightrays/Lightrays';
import { Job } from '@/twinx/types/TwinxTypes';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';

export default function ProfileSettingsPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'profile' | 'jobs' | 'socials' | 'account'>('profile');

  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [OSI, setOSI] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [socials, setSocials] = useState<{ platform: string; handle: string }[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialHandle, setSocialHandle] = useState('');

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const fetchedUser = await getUserById(user.id);
        if (fetchedUser) {
          setUserId(fetchedUser.id);
          setUsername(fetchedUser.username || '');
          setEmail(fetchedUser.email || '');
          setBio(fetchedUser.bio || '');
          setOSI(fetchedUser.OSI || '');
          setCountry(fetchedUser.country || '');
          setTags(fetchedUser.tags || []);
          setSocials(fetchedUser.socialhandles || []);
          setJobs(fetchedUser.jobs || []);
        }
      } catch (err) {
        console.error('❌ Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Update user in DB
  const handleSave = async () => {
    try {
      const res = await fetch('/api/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          username,
          email,
          bio,
          OSI,
          country,
          tags,
          socialhandles: socials.map((s) => ({
            platform: s.platform,
            url: s.handle.startsWith('http')
              ? s.handle
              : `https://${s.platform}.com/${s.handle.replace('@', '')}`,
          })),
          jobs,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  // UI helpers
  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= 5) return;
    setTags([...tags, trimmed]);
    setNewTag('');
  };
  const removeTag = (i: number) => setTags(tags.filter((_, idx) => idx !== i));
  const addSocial = () => {
    if (selectedPlatform && socialHandle) {
      setSocials([...socials, { platform: selectedPlatform, handle: socialHandle }]);
      setSelectedPlatform('');
      setSocialHandle('');
    }
  };
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));
  const addJob = () => setJobs([...jobs, { title: '', company: '', startDate: '', endDate: '', description: '' }]);
  const updateJob = (i: number, key: keyof Job, val: string) => {
    const updated = [...jobs];
    updated[i][key] = val;
    setJobs(updated);
  };
  const removeJob = (i: number) => setJobs(jobs.filter((_, idx) => idx !== i));

  if (loading) return <div className="flex justify-center items-center h-screen text-xl text-white">Loading...</div>;

  return (
    <>
    <SignedIn>

      <div className="flex min-h-screen bg-[#1c1c1e] text-white relative z-10">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 p-6 space-y-4" style={{borderColor:'#1b1b1d', backgroundColor:'#171717'}}>
          <h2 className="text-xl font-bold mb-6">Settings</h2>
          {['profile', 'jobs', 'socials', 'account'].map((section) => (
            <SidebarMenuButton asChild>
              <Button
                onClick={() => setActiveSection(section as any)}
                className="flex items-center gap-2 p-2 rounded w-full justify-start 
                           text-gray-400 font-normal transition-all duration-200 
                           hover:scale-[1.03] hover:font-semibold hover:text-white 
                           hover:bg-gray-800"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  {section}
                </span>
              </Button>
            </SidebarMenuButton>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card style={{border:'none'}}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold capitalize">
                  {activeSection === 'profile' && 'Edit Profile'}
                  {activeSection === 'jobs' && 'Work Experience'}
                  {activeSection === 'socials' && 'Social Handles'}
                  {activeSection === 'account' && 'Account Settings'}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {activeSection === 'profile' && (
                  <>
                    <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                    <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                    <Input placeholder="One Sentence Intro (OSI)" value={OSI} onChange={(e) => setOSI(e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                    <Input placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                    <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />

                    <div>
                      <label className="block mb-2">Tags (max 5)</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag, i) => (
                          <span key={i} className="bg-[#2e2e2e] px-3 py-1 rounded-full flex items-center gap-2">
                            #{tag}
                            <Trash size={14} onClick={() => removeTag(i)} className="cursor-pointer" />
                          </span>
                        ))}
                      </div>
                      {tags.length < 5 && (
                        <div className="flex gap-2">
                          <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                          <Button onClick={addTag}>Add</Button>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {activeSection === 'jobs' && (
                  <div className="space-y-4">
                    {jobs.map((job, i) => (
                      <div key={i} className="p-4 rounded-lg border border-[#3A3A3C] bg-[#121c21] space-y-2" style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}>
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{job.title || 'Untitled Job'}</h4>
                          <Trash size={16} className="cursor-pointer text-red-400" onClick={() => removeJob(i)} />
                        </div>
                        <Input placeholder="Title" value={job.title} onChange={(e) => updateJob(i, 'title', e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}} />
                        <Input placeholder="Company" value={job.company} onChange={(e) => updateJob(i, 'company', e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}/>
                        <div className="flex gap-2">
                          <Input type="date" value={job.startDate || ''} onChange={(e) => updateJob(i, 'startDate', e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}/>
                          <Input type="date" value={job.endDate || ''} onChange={(e) => updateJob(i, 'endDate', e.target.value)} style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}/>
                        </div>
                        <textarea
                          placeholder="Description"
                          className="w-full p-2 bg-[#2a2a2a] rounded-lg"
                          value={job.description}
                          style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}
                          onChange={(e) => updateJob(i, 'description', e.target.value)}
                        />
                      </div>
                    ))}
                    <Button onClick={addJob} className="flex gap-2 items-center"><Plus size={16} /> Add Job</Button>
                  </div>
                )}

                {activeSection === 'socials' && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        value={selectedPlatform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="p-2 rounded bg-[#121c21] border border-[#343f3d]"
                        style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}
                      >
                        <option value="">Platform</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="github">GitHub</option>
                      </select>
                      <Input
                        placeholder="@handle or full URL"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}
                      />
                      <Button onClick={addSocial}><Plus size={16} /></Button>
                    </div>
                    {socials.map((s, i) => (
                      <div key={i} className="flex justify-between p-2 bg-[#2a2a2a] rounded" style={{backgroundColor:'rgb(23 23 24)', borderColor:'rgb(79 79 79)'}}>
                        <span>{s.platform}: {s.handle}</span>
                        <Trash size={16} className="cursor-pointer text-red-400" onClick={() => removeSocial(i)} />
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'account' && (
                  <div className="space-y-4">
                    <p className="text-gray-400">Manage your account and sign out securely.</p>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                )}

                <div className="flex justify-end pt-6">
                  <Button onClick={handleSave} className="bg-[#00ffff33] hover:bg-[#00ffff55]">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

      </div>
    </SignedIn>

    <SignedOut>
      <SignInButton />
    </SignedOut>
    </>
  );
}
