'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/client/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.register(userData);
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
}
