export interface Message {
  _id?: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date | string;
  conversationId?: string;
}

export interface Conversation {
  _id: string;
  title: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ApiError {
  message: string;
  status?: number;
}