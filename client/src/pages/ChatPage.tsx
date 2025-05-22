import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import ConversationsList from '../components/ConversationsList';
import { chatService } from '../services/chatService';
import { Message, Conversation } from '../types';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await chatService.getConversations();
        setConversations(data);
        
        // If there's at least one conversation, select the most recent one
        if (data.length > 0) {
          setActiveConversation(data[0]._id);
          loadConversationMessages(data[0]._id);
        }
      } catch (error) {
        toast.error('Failed to load conversations');
      }
    };

    loadConversations();
  }, []);

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const data = await chatService.getConversationMessages(conversationId);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (content: string) => {
    // Add user message to the UI immediately
    const userMessage: Message = {
      content,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to API and get AI response
      const response = await chatService.sendMessage(content);
      
      // Update conversations if needed
      if (response.conversationId !== activeConversation) {
        setActiveConversation(response.conversationId);
        
        // If this is a new conversation, update the conversations list
        if (!conversations.some(c => c._id === response.conversationId)) {
          const updatedConversations = await chatService.getConversations();
          setConversations(updatedConversations);
        }
      }
      
      // Add AI response to messages
      setMessages((prev) => [...prev, response.message]);
    } catch (error) {
      toast.error('Failed to send message');
      // Remove the user message if it failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    if (conversationId === activeConversation) return;
    setActiveConversation(conversationId);
    loadConversationMessages(conversationId);
  };

  const startNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row p-4 lg:p-6 gap-4 overflow-hidden">
        {/* Sidebar with conversations */}
        <div className="lg:w-1/4 h-64 lg:h-auto">
          <div className="h-full flex flex-col">
            <div className="mb-3">
              <button 
                onClick={startNewConversation}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                <PlusCircle size={18} />
                <span>New Conversation</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <ConversationsList 
                conversations={conversations}
                activeConversation={activeConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">How can I help you today?</h3>
                <p className="max-w-md text-gray-500">
                  Start a conversation by typing your question below. I'm here to assist with any information or tasks you need help with.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage key={message._id || index} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
};

export default ChatPage;