import { Home, Building, PlusSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';



export const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  // Define los items de navegación
  const getNavItems = () => {
    const baseItems = [
      { href: '/dashboard', icon: Home, label: 'Home' },
      { href: '/flats', icon: Building, label: 'Ver Pisos' },
      { href: '/create', icon: PlusSquare, label: 'Crear Piso' },
      { href: '/profile', icon: User, label: 'Perfil' },
    ];

    // Solo añade el item Users si el rol NO es USER
    if (user?.rol !== 'USER') {
      baseItems.push({ href: '/users', icon: User, label: 'Usuarios' });
    }

    return baseItems;
  };

  const handleClick = (e, href) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <nav className="flex-1 ml-8">
      <ul className="flex items-center space-x-2">
        {getNavItems().map((item) => (
          <li key={item.href}>
            <a  // <- Faltaba esta etiqueta de apertura
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className={`flex items-center space-x-2 ${
                currentPath === item.href ? 'text-blue-500' : 'text-gray-700'
              }`}
            >
              <item.icon />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};