import { useCallback } from 'react';
import { Logo } from '../logo/Logo';
import { Navigation } from '../navigation/Navigation';
import { UserMenu } from '../usermenu/UserMenu';

import { useNavigate } from 'react-router-dom';
export const Header = (username) => {

  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    // Add logout logic here
    console.log('Logging out...');
    navigate('/login');
  }, []);

  return (
    <header className="bg-indigo-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <Navigation />
          <UserMenu 
            username={username}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};