# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Database Operations
```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Push schema changes to database
npx prisma db push

# Reset database (destructive)
npx prisma db reset

# View database in browser
npx prisma studio
```

### Environment Setup
- Copy `.env` and configure required environment variables:
  - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for Google OAuth
  - `NEXTAUTH_URL` (defaults to http://localhost:3000)
  - `NEXTAUTH_SECRET` for session encryption
  - `DATABASE_URL` for SQLite database (defaults to `file:./prisma/dev.db`)

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router and TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js (credentials + Google OAuth)
- **Styling**: Tailwind CSS 4
- **Video Processing**: FFmpeg via ffmpeg-static for HLS transcoding
- **Video Playback**: HLS.js for client-side video streaming

### Core Architecture Patterns

#### Authentication Flow
- Uses NextAuth.js with dual providers: credentials (username/email + password) and Google OAuth
- JWT session strategy with Prisma adapter for persistence
- Middleware protects routes: `/dashboard`, `/upload`, `/videos/*`
- Session data includes user ID for database operations

#### Video Processing Pipeline
1. **Upload** (`POST /api/videos`): Accepts multipart form with video file + metadata
2. **Storage**: Files saved to `storage/uploads/` with timestamp prefix
3. **Database**: Video record created with PENDING status
4. **Transcoding**: Background process via `POST /api/videos/[id]/transcode`
5. **Processing**: FFmpeg converts to HLS format in temp directory
6. **Publishing**: HLS files copied to `public/videos/[id]/` for serving
7. **Status Updates**: Real-time via Server-Sent Events endpoint

#### Real-time Status Updates
- SSE endpoint at `GET /api/videos/[id]/status` streams processing updates
- Client-side `VideoStatus` component subscribes to updates
- Progress tracking through database `progressPercent` field

### Key Directories

#### `/src/app` - Next.js App Router Structure
- `/(auth)/` - Authentication pages (login, register)
- `/api/` - API routes for videos, auth, registration
- `/dashboard/` - User video dashboard
- `/upload/` - Video upload interface
- `/videos/[id]/` - Individual video pages

#### `/src/lib` - Core Utilities
- `auth.ts` - NextAuth configuration and providers
- `prisma.ts` - Database client singleton
- `transcode.ts` - FFmpeg HLS transcoding logic

#### `/src/components` - Reusable Components
- `HlsPlayer.tsx` - Video player with HLS.js integration
- `VideoStatus.tsx` - Real-time transcoding status display

#### Database Schema (`/prisma/schema.prisma`)
- **User**: Authentication and profile data
- **Video**: Core video metadata with campaign date fields
- **VideoStatus**: Enum for PENDING/PROCESSING/READY/FAILED states
- NextAuth tables: Account, Session, VerificationToken

### Development Patterns

#### API Route Structure
- Authentication required for video operations via session check
- Form data parsing with Zod validation
- Background job initiation without blocking responses
- Consistent error response format

#### File Organization
- Generated Prisma client output to `src/generated/prisma/`
- TypeScript path alias `@/*` maps to `src/*`
- Static video assets served from `public/videos/[id]/`

#### Error Handling
- Database operations wrapped in try/catch
- Video processing failures update database with error state
- Client-side error boundaries for graceful degradation

### Campaign Metadata System
Videos include campaign start/end dates for temporal organization. This suggests the system may be used for marketing campaign management or time-based content delivery.

### Storage Architecture
- **Upload**: `storage/uploads/` - Original uploaded files
- **Transcode**: `storage/transcoded/` - Temporary HLS processing output  
- **Public**: `public/videos/[id]/` - Final HLS files for web serving

## Development Notes

### Database Considerations
- SQLite database suitable for development; consider PostgreSQL for production
- Prisma schema generates to custom output path to avoid conflicts
- User model supports both username and email login identifiers

### Video Processing Constraints
- Single bitrate HLS output for simplicity (configurable in transcode.ts)
- Progress reporting is basic heuristic - consider ffprobe for accurate duration
- Background processing via fetch() to transcode endpoint (consider job queue for production)

### Build Configuration
- ESLint disabled during builds (`eslint.ignoreDuringBuilds: true`)
- Generated Prisma files ignored in ESLint config
- TypeScript strict mode enabled
