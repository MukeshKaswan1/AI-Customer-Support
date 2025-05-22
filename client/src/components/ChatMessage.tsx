import React from 'react';
import { Message } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';
  const timestamp = typeof message.timestamp === 'string' 
    ? new Date(message.timestamp) 
    : message.timestamp;
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div 
        className={`max-w-[75%] px-4 py-3 rounded-lg ${
          isAI 
            ? 'bg-white text-gray-800 rounded-tl-none shadow-sm' 
            : 'bg-blue-600 text-white rounded-tr-none shadow-md'
        }`}
      >
        <p className="text-sm sm:text-base">{message.content}</p>
        <p className={`text-xs mt-1 ${isAI ? 'text-gray-500' : 'text-blue-200'}`}>
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;