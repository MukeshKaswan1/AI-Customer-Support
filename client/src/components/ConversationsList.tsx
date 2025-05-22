import React from 'react';
import { Conversation } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (id: string) => void;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
}) => {
  return (
    <div className="h-full bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500">
            <MessageSquare size={40} className="mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-sm mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation._id}>
                <button
                  onClick={() => onSelectConversation(conversation._id)}
                  className={`w-full p-4 text-left transition-colors duration-200 hover:bg-gray-50 ${
                    activeConversation === conversation._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium text-gray-800 truncate">{conversation.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(
                      new Date(conversation.updatedAt),
                      { addSuffix: true }
                    )}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;