export interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string | null;
  privacy: 'PUBLIC' | 'PRIVATE';
  originalFilePath: string;
  hlsManifestPath: string | null;
  thumbnailPath: string | null;
  duration: number;
  file_size: number;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
  progressPercent: number;
  errorMessage: string | null;
  campaignStartDate: Date;
  campaignEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  privacy: 'PUBLIC' | 'PRIVATE';
  campaignStartDate: string;
  campaignEndDate: string;
  file: File;
}

export interface VideoStatus {
  id: string;
  status: Video['status'];
  progressPercent: number;
  errorMessage?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
