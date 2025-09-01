export const VIDEO_CATEGORIES = [
  'tutorial',
  'presentation',
  'marketing',
  'entertainment',
  'education',
  'other'
] as const;

export const VIDEO_PRIVACY_OPTIONS = [
  'PUBLIC',
  'PRIVATE'
] as const;

export const VIDEO_STATUSES = [
  'PENDING',
  'PROCESSING',
  'READY',
  'FAILED'
] as const;

export const CATEGORY_COLORS = {
  tutorial: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  presentation: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  marketing: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  entertainment: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  education: "bg-green-500/20 text-green-300 border-green-500/30",
  other: "bg-gray-500/20 text-gray-300 border-gray-500/30"
} as const;

export const PRIVACY_ICONS = {
  PUBLIC: 'Globe',
  PRIVATE: 'Lock'
} as const;

export const API_ENDPOINTS = {
  VIDEOS: '/api/videos',
  VIDEO_STATUS: (id: string) => `/api/videos/${id}/status`,
  VIDEO_TRANSCODE: (id: string) => `/api/videos/${id}/transcode`,
  AUTH: {
    LOGIN: '/api/auth/signin',
    REGISTER: '/api/register',
    LOGOUT: '/api/auth/signout'
  }
} as const;
