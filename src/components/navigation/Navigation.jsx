import { Home, Building, PlusSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/flats', icon: Building, label: 'View Flats' },
  { href: '/create', icon: PlusSquare, label: 'Create Flat' },
  { href: '/profile', icon: User, label: 'Profile' },
  {href: '/users', icon: User, label: 'Users'},
];



export const Navigation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/flats', icon: Building, label: 'Ver Pisos' },
    { href: '/create', icon: PlusSquare, label: 'Crear Piso' },
    { href: '/profile', icon: User, label: 'Perfil' },
    { href: '/users', icon: User, label: 'Usuarios' },
  ];
  
  // Crear una copia del array para modificar
  let displayedItems = [...navItems];
  
  // Verificar si user existe y su rol antes de modificar el array
  if (user?.rol === 'USER') {
    displayedItems = displayedItems.filter(item => item.href !== '/users');
  }


  const handleClick = (e, href) => {
    e.preventDefault(); // Evita la recarga de la página
    navigate(href); // Navega a la ruta especificada
  };

  return (
    <nav className="flex-1 ml-8">
      <ul className="flex items-center space-x-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              onClick={(e) => handleClick(e, item.href)} // Previene la recarga
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
