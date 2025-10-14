'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Plus, Trash } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { getUserById } from '@/twinx/utils/twinxDBUtils.action';
import LightRays from '@/General/Backgrounds/Lightrays/Lightrays';
import TextType from '@/General/TextAnimations/TextType/TextType';
import { Job } from '@/twinx/types/TwinxTypes';

export default function OnboardingPage() {
  
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [OSI, setOSI] = useState('');
  const [bio, setBio] = useState('');
  const [website, setwebsite] = useState('');
  const [country, setcountry] = useState('');
  const [socials, setSocials] = useState<{ platform: string; handle: string }[]>([]);

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);


  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [userId, setuserId] = useState('');

  const { user } = useUser();
  const router = useRouter();



  //gets the user from mongodb and checks if onboarded or na, and shows the onboaridng cards if not or will send to dashboard
  useEffect(() => {
    if (user) {

      setuserId(user.id);
      const fetchUser = async () => {
        try {

          const fetchedUser = await getUserById(user.id);
          console.log('✅ User fetched:');

          if(!fetchedUser){
            //if no user found then show onboarding cards
            setLoading(false);
          } else {
            //if user onboarded then send to dashboard if not then remove loading and show onboardding cards
            if(fetchedUser.onboarded){
              router.replace(`/twinx/Dashboard/${fetchedUser.id}`);
            } else {
              setLoading(false);
            }
          }

        } catch (error) {
          console.error('❌ Error fetching user:', error);
        }
      };
      fetchUser();

    }
  }, [user]); 

  //sets the redirect link to dashboard
  useEffect(() => {
    (async () => {
      try { 
        const exists = userId;
        if (exists) {
          router.replace(`/twinx/Dashboard/${userId}`);
        } else {
          setLoading(true);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [router]);

  const addSocial = () => {
    if (selectedPlatform && socialHandle) {
      setSocials(prev => [...prev, { platform: selectedPlatform, handle: socialHandle }]);
      setSelectedPlatform('');
      setSocialHandle('');
    }
  };

  const removeSocial = (index: number) => {
    setSocials(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return; // avoid duplicates
    if (tags.length >= 5) return alert("You can only add up to 5 tags.");
    setTags([...tags, trimmed]);
    setNewTag("");
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  //jobs section
  const addJob = () => {
    setJobs([
      ...jobs,
      { title: "", company: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const removeJob = (index: number) => {
    setJobs(jobs.filter((_, i) => i !== index));
  };

  const updateJob = (index: number, key: keyof Job, value: string) => {
    const updatedJobs = [...jobs];
    updatedJobs[index][key] = value;
    setJobs(updatedJobs);
  };

  const moveJobUp = (index: number) => {
    if (index === 0) return;
    const updated = [...jobs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setJobs(updated);
  };

  const moveJobDown = (index: number) => {
    if (index === jobs.length - 1) return;
    const updated = [...jobs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setJobs(updated);
  };
  //jobs section end


  // 👉 Called when user finishes onboarding
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          username,
          name: username,
          email,
          bio,
          OSI, // One Sentence Introduction
          tags, // Array of up to 5 tags

          socialhandles: socials.map((s) => ({
            platform: s.platform,
            url: s.handle.startsWith("http")
              ? s.handle
              : `https://${s.platform}.com/${s.handle.replace("@", "")}`,
          })),

          jobs: jobs.map((job) => ({
            title: job.title?.trim(),
            company: job.company?.trim(),
            startDate: job.startDate ? new Date(job.startDate) : null,
            endDate: job.endDate ? new Date(job.endDate) : null,
            description: job.description?.trim(),
          })),

          country: country || "Earth", // default fallback
        }),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const data = await res.json();
      router.replace(`/twinx/Dashboard/${data.id}`);
    } catch (err) {
      console.error("❌ Onboarding failed:", err);
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  }

  return (
    <>
        <SignedIn>

            {/* background */}
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
              <LightRays
                raysOrigin="top-center"
                raysColor="#00ffff"
                raysSpeed={1.5}
                lightSpread={0.8}
                rayLength={1.2}
                followMouse={true}
                mouseInfluence={0.1}
                noiseAmount={0.1}
                distortion={0.05}
                className="custom-rays"
              />
            </div>

            {/* onboarding cards */}
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4" style={{ backgroundColor: '#1c1c1e' }}>

              {/* animated text intro */}
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center" style={{color:'#9f9fa5ff', fontSize:'42px', marginTop:'-40px', zIndex:'999'}}>
                <TextType 
                  text={["Welcome to TwinX, Let's get your Onboarded!", "Ready to build somthing amazing?", "TwinX got your back, let your imagination run free!", "with Twinx you can digital twin your room, museums, anything."]}
                  typingSpeed={100}
                  pauseDuration={1500}
                  showCursor={true}
                  cursorCharacter="_"
                  loop={true}
                  variableSpeed={{min: 50, max: 100}}
                  deletingSpeed={120}
                />
              </h1>

              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl"
                style={{zIndex:'999'}}
              >
                <Card className="shadow-xl rounded-2xl" style={{ backgroundColor: '#192a3080', border: 'none', backgroundBlendMode:'hue' }}>
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                      {step === 1 && 'Step 1: Personal Details'}
                      {step === 2 && 'Step 2: Jobs'}
                      {step === 3 && 'Step 3: Payment Details'}
                      {step === 4 && 'Step 4: Choose a Plan'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {step === 1 && (
                      <>
                        <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />
                        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type='email' style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />
                        <Input placeholder="One Sentance Introduction" value={OSI} onChange={e => setOSI(e.target.value)} style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />
                        <Input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />
                        <Input placeholder="website" value={website} onChange={e => setwebsite(e.target.value)} type='link' style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />
                        <Input placeholder="country" value={country} onChange={e => setcountry(e.target.value)} style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}} />

                        {/* Tags Section */}
                        <div className="mt-4">
                          <label className="block mb-2 font-medium">Tags (max 5)</label>

                          <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map((tag, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-[#262629] text-white px-3 py-1 rounded-full"
                              >
                                <span>#{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTag(index)}
                                  className="hover:text-red-400"
                                >
                                  <Trash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          {tags.length < 5 && (
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Type a tag and press Enter"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addTag();
                                  }
                                }}
                                className="flex-1"
                                style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                              />
                              <Button type="button" onClick={addTag}>
                                <Plus size={16} />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Social Handles Section */}
                        <div>
                          <label className="block mb-2 font-medium">Social Handles</label>
                          <div className="flex gap-2 mb-2">
                            <select
                              value={selectedPlatform}
                              onChange={e => setSelectedPlatform(e.target.value)}
                              className="border p-2 rounded w-1/3"
                              style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                            >
                              <option value="">Select platform</option>
                              <option value="twitter">Twitter</option>
                              <option value="instagram">Instagram</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="github">GitHub</option>
                            </select>
                            <Input
                              placeholder="@handle or full URL"
                              value={socialHandle}
                              onChange={e => setSocialHandle(e.target.value)}
                              className="flex-1"
                              style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                            />
                            <Button type="button" onClick={addSocial}><Plus size={16} /></Button>
                          </div>
                          <ul className="space-y-1">
                            {socials.map((s, i) => (
                              <li key={i} className="flex justify-between bg-gray-50 p-2 rounded">
                                <span>{s.platform}: {s.handle}</span>
                                <button onClick={() => removeSocial(i)}><Trash size={16} /></button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-white">Job Experience</h3>
                      <p className="text-sm text-gray-400">
                        Add your work experience below. You can reorder, edit, or delete jobs anytime.
                      </p>
                      
                      {/* Job List */}
                      <div className="space-y-4">
                        {jobs.map((job, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-[#3A3A3C] space-y-3 relative"
                            style={{backgroundColor:'rgb(18 28 33 / 75%)'}}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-semibold text-white">
                                {job.title || "Untitled Job"} — {job.company || "Company"}
                              </h4>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => moveJobUp(index)}
                                  disabled={index === 0}
                                  className="text-gray-400 hover:text-white disabled:opacity-30"
                                  title="Move Up"
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveJobDown(index)}
                                  disabled={index === jobs.length - 1}
                                  className="text-gray-400 hover:text-white disabled:opacity-30"
                                  title="Move Down"
                                >
                                  ↓
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeJob(index)}
                                  className="text-red-400 hover:text-red-500"
                                  title="Delete Job"
                                >
                                  <Trash size={16} />
                                </button>
                              </div>
                            </div>
                        
                            <div className="grid sm:grid-cols-2 gap-3">
                              <Input
                                placeholder="Job Title"
                                value={job.title}
                                style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                                onChange={(e) => updateJob(index, "title", e.target.value)}
                              />
                              <Input
                                placeholder="Company"
                                value={job.company}
                                style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                                onChange={(e) => updateJob(index, "company", e.target.value)}
                              />
                            </div>
                        
                            <div className="grid sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                <Input
                                  type="date"
                                  value={job.startDate || ""}
                                  style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                                  onChange={(e) => updateJob(index, "startDate", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-400 mb-1">End Date</label>
                                <Input
                                  type="date"
                                  value={job.endDate || ""}
                                  style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                                  onChange={(e) => updateJob(index, "endDate", e.target.value)}
                                />
                              </div>
                            </div>
                        
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Description</label>
                              <textarea
                                placeholder="Describe your role, key achievements, or technologies used..."
                                value={job.description}
                                style={{backgroundColor:'rgb(18 28 33 / 75%)', borderColor:'#343f3d'}}
                                onChange={(e) => updateJob(index, "description", e.target.value)}
                                className="w-full bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] min-h-[80px]"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Job Button */}
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          onClick={addJob}
                          className="bg-[#6366F1] hover:bg-opacity-90 flex items-center gap-2"
                        >
                          <Plus size={16} /> Add Job
                        </Button>
                      </div>
                    </div>

                    )}

                    {step === 3 && (
                      <div className="text-center space-y-4">
                        <p className="text-gray-600">Payment details (Stripe integration placeholder)</p>
                        <div className="border-dashed border-2 p-8 rounded-xl bg-gray-50" style={{ backgroundColor: '#1c1c1e', borderColor: '#1c1c1e' }}>
                          <p className="text-gray-500">Stripe payment setup goes here.</p>
                        </div>
                        <p className="text-sm text-gray-400">This step is optional for pay-as-you-go users.</p>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[{
                          name: 'Free', price: '$0', features: ['Basic tools', 'Community access']
                        }, {
                          name: 'Pro', price: '$19/mo', features: ['Everything in Free', 'Advanced analytics', 'Priority support']
                        }, {
                          name: 'Enterprise', price: 'Custom', features: ['Dedicated support', 'Custom solutions']
                        }].map((plan, idx) => (
                          <Card key={idx} className="p-4 cursor-pointer hover:shadow-lg transition" style={{ backgroundColor: "#1c1c1e", border: 'none' }}>
                            <CardTitle className="text-lg font-semibold mb-2">{plan.name}</CardTitle>
                            <p className="text-2xl font-bold">{plan.price}</p>
                            <ul className="mt-2 text-sm text-gray-600 list-disc ml-4">
                              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                            </ul>
                          </Card>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      {step > 1 ? (
                        <Button variant="outline" onClick={handleBack}>Back</Button>
                      ) : <div />}
                      {step < 3 ? (
                        <Button onClick={handleNext}>Next</Button>
                      ) : (
                        <Button className="bg-green-600 hover:bg-green-700" style={{ color: '#1c1c1e' }} onClick={handleSubmit}>
                          Finish
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>

            {/* clerk profile button */}
            <div style={{position:'fixed', bottom:'20px', right:'20px', zIndex:'1000'}}>
                <UserButton afterSwitchSessionUrl='/' />
            </div>

        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
    </>
  );

}