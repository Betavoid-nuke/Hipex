'use client';

import { FC, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// Styled Components
import GlobalStyles from '../../../../CodePlayground/styles/GlobalStyles';
import GlobalContainer from '../../../../CodePlayground/styles/GlobalContainer';
import MiddleContainer from '../../../../CodePlayground/styles/MiddleContainer';

// Context
import { Context } from '../../../../CodePlayground/context';

// Components
import Sidebar from '../../../../CodePlayground/components/sidebar';
import Editor from '../../../../CodePlayground/components/editor';
import Output from '../../../../CodePlayground/components/output';
import MobileMessage from '../../../../CodePlayground/components/mobile-message';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';


const App: FC = () => {

    return (
        <>

            <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
            
                {/* User bubble at the top right corner */}
                <div className="sticky top-5 z-50" style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start', marginTop:'-50px', marginLeft: '200px', zIndex: '99'}}>
                  <SignedIn>
                    <UserButton afterSwitchSessionUrl='/' />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                </div>


                <ToastContainer
                    position='bottom-left'
                    closeOnClick={false}
                    autoClose={false}
                    draggable={false}
                />
                <Context>
                    <GlobalContainer className='split'>

                        <ResizablePanelGroup
                          direction="horizontal"
                          className="min-h-[100%] max-w-md rounded-lg border md:min-w-[100%]"
                          style={{marginTop:'14px'}}
                        >
                          <ResizablePanel defaultSize={10} maxSize={30} minSize={18}>
                            <div className="flex h-full items-center justify-center">
                                <Sidebar />
                            </div>
                          </ResizablePanel>
                          <ResizableHandle withHandle />
                          <ResizablePanel defaultSize={40} maxSize={60} minSize={20}>
                            <div className="flex h-full items-center justify-center">
                              <MiddleContainer id='code' className='split'>
                                <Editor />
                              </MiddleContainer>
                            </div>
                          </ResizablePanel>
                          <ResizableHandle withHandle />
                          <ResizablePanel defaultSize={50} maxSize={60} minSize={30}>
                            <div className="flex h-full items-center justify-center">
                              <Output />
                            </div>
                          </ResizablePanel>
                        </ResizablePanelGroup>
                        <GlobalStyles />

                    </GlobalContainer>
                    <MobileMessage />
                </Context>
                
            </ClerkProvider>
        </>
    );
};

export default App;
