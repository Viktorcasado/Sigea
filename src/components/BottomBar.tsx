import { NavLink } from 'react-router-dom';
import { Home, Compass, Award, User } from 'lucide-react';
import { usePlatform } from '@/src/hooks/usePlatform';

export default function BottomBar() {
  const { isIos } = usePlatform();
  
  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/explorar', label: 'Explorar', icon: Compass },
    { path: '/certificados', label: 'Certificados', icon: Award },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 flex items-center justify-around z-50 ${isIos ? 'pb-6 h-22' : 'h-16'}`}>
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
              isActive 
                ? 'text-indigo-600 scale-110' 
                : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <Icon className={`w-6 h-6 ${isIos ? 'mb-0.5' : ''}`} />
          <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}