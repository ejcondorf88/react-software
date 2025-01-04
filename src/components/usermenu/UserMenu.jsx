import { useState, useCallback } from 'react';
import { User, LogOut, Settings, Bell } from 'lucide-react';


export const UserMenu = ({ username, avatarUrl, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications] = useState(true);

  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative">
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {/* User Profile Button */}
        <button 
          onClick={toggleMenu}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-6 h-6 rounded-full" />
          ) : (
            <User className="w-5 h-5 text-gray-600" />
          )}
          <span className="font-medium text-gray-700">{username}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
          <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};