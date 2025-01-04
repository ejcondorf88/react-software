import { useCallback } from 'react';


export const NavLink = ({ href, icon: Icon, label, isActive = false }) => {
  const handleClick = useCallback((e) => {
    e.preventDefault();
    // Add navigation logic here
    window.history.pushState({}, '', href);
  }, [href]);

  return (
    <li>
      <a 
        href={href}
        onClick={handleClick}
        className={`
          px-4 py-2 rounded-md transition-all duration-200 flex items-center gap-2
          ${isActive 
            ? 'bg-indigo-50 text-indigo-600' 
            : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
          }
        `}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </a>
    </li>
  );
};