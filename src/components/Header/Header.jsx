import { useCallback, useEffect } from 'react';
import { Logo } from '../logo/Logo';
import { Navigation } from '../navigation/Navigation';
import { UserMenu } from '../usermenu/UserMenu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export const Header = (username) => {

  const { user, logout } = useAuth();


  const navigate = useNavigate();
  const handleLogout = useCallback(() => {
    // Add logout logic here
    logout();
    localStorage.clear(); // Limpia el almacenamiento local
    sessionStorage.clear(); // Limpia el almacenamiento de sesión

    // Navega a la página de inicio de sesión y resetea el estado
    navigate('/login', { replace: true, state: null });
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