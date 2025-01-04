import { Home, Building, PlusSquare, User } from 'lucide-react';
import { NavLink } from '../navlink/NavLink';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/flats', icon: Building, label: 'View Flats' },
  { href: '/flats/create', icon: PlusSquare, label: 'Create Flat' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export const Navigation = () => {
  const currentPath = window.location.pathname;

  return (
    <nav className="flex-1 ml-8">
      <ul className="flex items-center space-x-2">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={currentPath === item.href}
          />
        ))}
      </ul>
    </nav>
  );
};