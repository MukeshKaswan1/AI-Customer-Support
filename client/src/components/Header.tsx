import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, MessageCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <MessageCircle size={24} className="text-blue-600 mr-2" />
          <h1 className="text-xl font-bold text-gray-800">AI Support Chat</h1>
        </div>
        {user && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4">{user.email}</span>
            <button
              onClick={logout}
              className="flex items-center text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} className="mr-1" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;