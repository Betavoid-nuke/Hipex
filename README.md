This is the repo for the platform builder npm package, that web developers can use to quickly setup a production-ready platform with build in clerk authentication, mongoose database, and uploadthing package with mordern ui design build with shadcn. users will get a base and after initializing the platform, developers can start to design their pages

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.




_______________________________________________________


## HIPEX APIs:
Hipex APIs are within this project file, the root/backend folder has the code for python backend.
main.py is the main python file where the initial apis are defined.

_______________________________________________________

## Point Cloud Backend:
Hipex Point Cloud Backend are within this project file, the root/PointClouldBackend folder has the code for python backend.
main.py is the main python file where the initial apis are defined.

to test api - 
1. go to - http://pointcloud.hipexapp.com/docs

2. copy this json in POST - 
    {
      "job_id": "live_test_003",
      "video_url": "https://example.com/test-video.mp4"
    }

3. click Execute

to check status of a job - 
1. go to - http://pointcloud.hipexapp.com/job/*job_id*

_______________________________________________________

## CUETRACK:
root/cuetrack has the code for the cuetrack app for snooker.