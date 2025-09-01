# Video CMS Architecture - Client-Server Separation

This document outlines the restructured architecture that properly separates client and server-side code.

## Directory Structure

```
src/
├── lib/
│   ├── server/           # Server-side only code
│   │   ├── database.ts   # Database operations
│   │   ├── auth.ts       # Authentication configuration
│   │   └── transcode.ts  # Video transcoding operations
│   ├── client/           # Client-side only code
│   │   ├── api.ts        # API client for frontend
│   │   └── utils.ts      # Client-side utilities
│   ├── shared/           # Shared between client and server
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── constants.ts  # Shared constants
│   │   └── password.ts   # Password utilities
│   └── auth.ts           # NextAuth configuration
├── hooks/                # React hooks
│   ├── useVideos.ts      # Video management hooks
│   └── useAuth.ts        # Authentication hooks
├── components/           # React components
└── app/                  # Next.js app router
    ├── api/              # API routes (server-side)
    └── (portal)/         # Client-side pages
```

## Server-Side Code (`src/lib/server/`)

### Database Operations (`database.ts`)
- Centralized database access through Prisma
- Abstracted database operations for users, videos, accounts, and sessions
- Prevents direct Prisma client usage in components

### Authentication (`auth.ts`)
- NextAuth configuration
- Credential provider setup
- Session and JWT callbacks
- Server-side authentication logic

### Video Transcoding (`transcode.ts`)
- FFmpeg-based video processing
- HLS manifest generation
- Thumbnail creation
- Progress tracking

## Client-Side Code (`src/lib/client/`)

### API Client (`api.ts`)
- Centralized API communication
- Type-safe request/response handling
- Error handling and retry logic
- FormData handling for file uploads

### Client Utilities (`utils.ts`)
- File validation
- Formatting functions (duration, file size, dates)
- Video status helpers
- URL generation for media files

## Shared Code (`src/lib/shared/`)

### Types (`types.ts`)
- TypeScript interfaces for User, Video, etc.
- API response types
- Upload data structures

### Constants (`constants.ts`)
- Video categories and privacy options
- API endpoints
- Category colors and icons

### Password Utilities (`password.ts`)
- Password hashing and comparison
- Used on both client and server

## React Hooks (`src/hooks/`)

### useVideos
- Video CRUD operations
- Status polling
- Error handling
- Loading states

### useAuth
- Registration functionality
- Loading and error states

## Key Benefits

1. **Clear Separation**: Server and client code are clearly separated
2. **Type Safety**: Shared types ensure consistency across the stack
3. **Maintainability**: Centralized logic reduces duplication
4. **Security**: Server-side operations are properly isolated
5. **Performance**: Client-side code is optimized for the browser
6. **Scalability**: Modular structure allows for easy expansion

## Usage Examples

### Server-Side (API Routes)
```typescript
import { db } from "@/lib/server/database";
import { transcodeVideo } from "@/lib/server/transcode";

// Database operations
const user = await db.user.findByEmail(email);
const videos = await db.video.findByUserId(userId);

// Video processing
const result = await transcodeVideo({ inputPath, outputDir, videoId });
```

### Client-Side (Components)
```typescript
import { apiClient } from "@/lib/client/api";
import { useVideos } from "@/hooks/useVideos";
import { validateVideoFile } from "@/lib/client/utils";

// API calls
const response = await apiClient.uploadVideo(videoData);

// Hooks
const { videos, uploadVideo, loading } = useVideos();

// Utilities
const validation = validateVideoFile(file);
```

### Shared (Both Client and Server)
```typescript
import { Video, VIDEO_CATEGORIES } from "@/lib/shared/types";
import { saltAndHashPassword } from "@/lib/shared/password";

// Types
const video: Video = { /* ... */ };

// Constants
const categories = VIDEO_CATEGORIES;

// Utilities
const hash = await saltAndHashPassword(password);
```

## Migration Notes

- Removed direct Prisma client usage from components
- Centralized all database operations in `database.ts`
- Moved authentication logic to server-side
- Created type-safe API client for frontend
- Separated utility functions by usage context
- Added proper error handling and loading states

This architecture ensures that server-side code never reaches the client bundle and provides a clean, maintainable structure for the application.
