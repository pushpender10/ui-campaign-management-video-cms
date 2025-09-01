import { VideoUploadData, VideoStatus, ApiResponse, Video } from '@/lib/shared/types';
import { API_ENDPOINTS } from '@/lib/shared/constants';

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Video API methods
  async uploadVideo(videoData: VideoUploadData): Promise<ApiResponse<{ id: string }>> {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('category', videoData.category);
    formData.append('privacy', videoData.privacy);
    formData.append('campaignStartDate', videoData.campaignStartDate);
    formData.append('campaignEndDate', videoData.campaignEndDate);
    formData.append('file', videoData.file);

    return this.request<{ id: string }>(API_ENDPOINTS.VIDEOS, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getVideos(): Promise<ApiResponse<Video[]>> {
    return this.request<Video[]>(API_ENDPOINTS.VIDEOS);
  }

  async getVideo(id: string): Promise<ApiResponse<Video>> {
    return this.request<Video>(`${API_ENDPOINTS.VIDEOS}/${id}`);
  }

  async getVideoStatus(id: string): Promise<ApiResponse<VideoStatus>> {
    return this.request<VideoStatus>(API_ENDPOINTS.VIDEO_STATUS(id));
  }

  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: 'DELETE',
    });
  }

  async updateVideo(id: string, data: Partial<Video>): Promise<ApiResponse<Video>> {
    return this.request<Video>(`${API_ENDPOINTS.VIDEOS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Auth API methods
  async register(userData: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export const apiClient = new ApiClient();
