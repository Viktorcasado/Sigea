import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Award, User } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

import { useUser } from '@/src/contexts/UserContext';

const navItems = [
  { path: '/', label: 'Início', icon: Home },
  { path: '/explorar', label: 'Explorar', icon: Compass },
  { path: '/certificados', label: 'Certificados', icon: Award },
];

export default function BottomBar() {
  const { user } = useUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 shadow-t-md">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full pt-3 pb-2 text-sm font-medium transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="relative flex flex-col items-center justify-center w-full pt-3 pb-2">
          {/* O ProfileMenu agora gerencia seu próprio estado */}
          <ProfileMenu />
        </div>
      </div>
    </nav>
  );
}
