'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

// Styled Components
import GlobalStyles from '../../../../CodePlayground/styles/GlobalStyles';
import GlobalContainer from '../../../../CodePlayground/styles/GlobalContainer';
import MiddleContainer from '../../../../CodePlayground/styles/MiddleContainer';

// Context
import { Context, SetCustomCodeData } from '../../../../CodePlayground/context';

// Components
import Sidebar from '../../../../CodePlayground/components/sidebar';
import Editor from '../../../../CodePlayground/components/editor';
import Output from '../../../../CodePlayground/components/output';
import MobileMessage from '../../../../CodePlayground/components/mobile-message';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { fetchCountdownById } from '@/lib/actions/user.action';

export default function App() {
  const params = useParams();
  const id = params?.id;

  // Validate the ID parameter
  // Ensure it is a string and not empty
  if (!id || typeof id !== 'string') {
    return <div>Invalid ID</div>;
  }

  // Fetch the countdown page by ID
  // This will be used to set the initial state of the code editor
  useEffect(() => {
    // Fetch the countdown page by ID
    if (!id) return;

    const getPage = async () => {
      const result = await fetchCountdownById(id);

      if (!result) {
        console.error('Failed to fetch countdown page data');
        return;
      }
      SetCustomCodeData({
        CustomCodeDatain: result.customCode?.defaultFilesData,
        filesListin: result.customCode?.defaultFilesList
      });
    };

    getPage();

  }, [id]);

  return (
    <>
      <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
        <div className="sticky top-5 z-50" style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'flex-start', marginTop: '-50px', marginLeft: '200px', zIndex: '99' }}>
          <SignedIn>
            <UserButton afterSwitchSessionUrl='/' />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>

        <ToastContainer position='bottom-left' closeOnClick={false} autoClose={false} draggable={false} />

        <Context>
          <GlobalContainer className='split'>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[100%] max-w-md rounded-lg border md:min-w-[100%]"
              style={{ marginTop: '14px' }}
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
}
