This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy

* I scaffolded a new Next.js (App Router) app in video-cms with Tailwind and TypeScript, added Prisma/SQLite, NextAuth (credentials + Google), and built a video upload/transcoding flow with HLS output and status updates.

How to run
* Set Google OAuth envs in ``video-cms/.env:`` <GOOGLE_CLIENT_ID> , <GOOGLE_CLIENT_SECRET> .
* From video-cms, run:
```
npm run dev
```

* Visit /register to create a user or /login to sign in (email/username + password or Google).
* Upload at /upload. After upload, the file is transcoded to HLS; progress is visible on the video page and dashboard. Videos are served from ``/public/videos/{id}/index.m3u8``. Delete from the video page.

What’s implemented
* Authentication
    * Credentials login with email or username + password.
    * Google SSO.
    * Middleware protects "/dashboard", "/upload", and "/videos/*".

* Database (Prisma + SQLite)
    * Models: User, Account, Session, VerificationToken, Video with campaignStartDate and campaignEndDate.

* Upload + delete
    * API: POST /api/videos accepts multipart form (title, description, campaign dates, file).
    * API: DELETE /api/videos/[id] removes DB record and public/videos/{id}.

* Transcoding
    - Background POST to /api/videos/[id]/transcode after upload.
    - Uses ffmpeg-static to produce HLS into a temp directory, then publishes to public/videos/{id}.
    - Saves manifest path on the Video and marks status to READY/FAILED.

* Status updates
    - SSE endpoint: GET /api/videos/[id]/status.
    - Client component VideoStatus subscribes and shows status/progress.

* Playback
    - HlsPlayer component with hls.js for non-Safari browsers.
    - Video detail page uses HlsPlayer.

* Campaign metadata
    - Upload form collects start/end dates; dashboard and detail pages display them.

Notes

* Update NEXTAUTH_URL in .env if not http://localhost:3000.
* Default storage folders are created under storage/uploads and storage/transcoded. Final HLS copies to public/videos/{id}.
* Build is green; lint is skipped during build and generated Prisma files are ignored in lint.
* Edits included creating the Next.js app; adding Prisma schema; auth setup; API routes for auth, register, videos (POST/GET/DELETE/transcode/status); UI pages (/login, /register, /dashboard, /upload, /videos/[id]); and helper libs (prisma, transcode, HlsPlayer, VideoStatus).