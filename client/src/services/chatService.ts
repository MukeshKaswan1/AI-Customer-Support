import axios from 'axios';
import { Message } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const chatService = {
  async sendMessage(message: string) {
    const response = await axios.post(`${API_URL}/chat/send`, { message });
    return response.data;
  },

  async getChatHistory() {
    const response = await axios.get(`${API_URL}/chat/history`);
    return response.data;
  },

  async getConversations() {
    const response = await axios.get(`${API_URL}/chat/conversations`);
    return response.data;
  },

  async getConversationMessages(conversationId: string) {
    const response = await axios.get(`${API_URL}/chat/conversations/${conversationId}`);
    return response.data;
  }
};