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

export default function OnboardingPage() {
  
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [socials, setSocials] = useState<{ platform: string; handle: string }[]>([]);

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
          socialhandles: socials.map((s) => ({
            platform: s.platform,
            url: s.handle.startsWith("http") ? s.handle : `https://${s.platform}.com/${s.handle.replace("@", "")}`,
          })),
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

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center" style={{color:'#9f9fa5ff', fontSize:'42px', marginTop:'-40px'}}>
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
                      {step === 2 && 'Step 2: Payment Details'}
                      {step === 3 && 'Step 3: Choose a Plan'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {step === 1 && (
                      <>
                        <Input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Input placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
                    
                        <div>
                          <label className="block mb-2 font-medium">Social Handles</label>
                          <div className="flex gap-2 mb-2">
                            <select
                              value={selectedPlatform}
                              onChange={e => setSelectedPlatform(e.target.value)}
                              className="border p-2 rounded w-1/3"
                              style={{ backgroundColor: '#222224ff' }}
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
                      <div className="text-center space-y-4">
                        <p className="text-gray-600">Payment details (Stripe integration placeholder)</p>
                        <div className="border-dashed border-2 p-8 rounded-xl bg-gray-50" style={{ backgroundColor: '#1c1c1e', borderColor: '#1c1c1e' }}>
                          <p className="text-gray-500">Stripe payment setup goes here.</p>
                        </div>
                        <p className="text-sm text-gray-400">This step is optional for pay-as-you-go users.</p>
                      </div>
                    )}

                    {step === 3 && (
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

