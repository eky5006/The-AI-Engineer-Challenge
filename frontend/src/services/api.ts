import axios from 'axios';
import type { ChatRequest, HealthResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async checkHealth(): Promise<HealthResponse> {
    try {
      const response = await axios.get<HealthResponse>(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  async sendChatMessage(request: ChatRequest): Promise<ReadableStream> {
    try {
      console.log('Sending request:', { ...request, api_key: '***' });
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