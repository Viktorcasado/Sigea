import { NavLink } from 'react-router-dom';
import { Home, Compass, Award, User } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';

export default function BottomBar() {
  const { user } = useUser();
  
  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/explorar', label: 'Explorar', icon: Compass },
    { path: '/certificados', label: 'Certificados', icon: Award },
    { path: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center px-4 z-50 pointer-events-none">
      <nav className="pointer-events-auto bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] px-2 py-2 flex items-center justify-around w-full max-w-md">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-2 rounded-[2rem] transition-all duration-300 ${
                isActive 
                  ? 'text-indigo-600 bg-indigo-50/50' 
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`} />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}