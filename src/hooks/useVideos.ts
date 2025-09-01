'use client';

import { useState, useEffect } from 'react';
import { Video, VideoUploadData, VideoStatus } from '@/lib/shared/types';
import { apiClient } from '@/lib/client/api';

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideos();
      if (response.success && response.data) {
        setVideos(response.data);
      } else {
        setError(response.error || 'Failed to fetch videos');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const uploadVideo = async (videoData: VideoUploadData) => {
    try {
      const response = await apiClient.uploadVideo(videoData);
      if (response.success && response.data) {
        // Refresh the videos list
        await fetchVideos();
        return response.data;
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      const response = await apiClient.deleteVideo(id);
      if (response.success) {
        setVideos(videos.filter(video => video.id !== id));
      } else {
        throw new Error(response.error || 'Delete failed');
      }
    } catch (err) {
      throw err;
    }
  };

  const updateVideo = async (id: string, data: Partial<Video>) => {
    try {
      const response = await apiClient.updateVideo(id, data);
      if (response.success && response.data) {
        setVideos(videos.map(video => 
          video.id === id ? response.data! : video
        ));
        return response.data;
      } else {
        throw new Error(response.error || 'Update failed');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    fetchVideos,
    uploadVideo,
    deleteVideo,
    updateVideo,
  };
}

export function useVideoStatus(videoId: string) {
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideoStatus(videoId);
      if (response.success && response.data) {
        setStatus(response.data);
      } else {
        setError(response.error || 'Failed to fetch status');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId) {
      fetchStatus();
      
      // Poll for status updates every 2 seconds
      const interval = setInterval(fetchStatus, 2000);
      return () => clearInterval(interval);
    }
  }, [videoId]);

  return {
    status,
    loading,
    error,
    fetchStatus,
  };
}
