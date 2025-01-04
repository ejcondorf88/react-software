import { useCallback } from 'react';
import { Logo } from '../logo/Logo';
import { Navigation } from '../navigation/Navigation';
import { UserMenu } from '../usermenu/UserMenu';

export const Header = () => {
  const handleLogout = useCallback(() => {
    // Add logout logic here
    console.log('Logging out...');
  }, []);

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <Navigation />
          <UserMenu 
            username="John Doe"
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};