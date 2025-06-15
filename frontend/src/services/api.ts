import axios from 'axios';
import type { ChatRequest, HealthResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('API Base URL:', API_BASE_URL);

export const api = {
  async checkHealth(): Promise<HealthResponse> {
    try {
      console.log('Checking health at:', `${API_BASE_URL}/health`);
      const response = await axios.get<HealthResponse>(`${API_BASE_URL}/health`);
      console.log('Health check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
      }
      throw error;
    }
  },

  async sendChatMessage(request: ChatRequest): Promise<ReadableStream> {
    try {
      console.log('Sending request to:', `${API_BASE_URL}/chat`);
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          url: response.url,
        });
        throw new Error(errorData?.detail || `Failed to send message: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      return response.body;
    } catch (error) {
      console.error('Chat message error:', error);
      throw error;
    }
  },
}; 