import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@/src/contexts/UserContext';
import { User, LogOut, Ticket, Award, Settings } from 'lucide-react';

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
        <img
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.nome}`}
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-indigo-500 transition-colors"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
          <div className="p-4 border-b border-gray-100">
            <p className="font-semibold text-gray-800">{user.nome}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          <nav className="p-2">
            <Link to="/perfil" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
              <User className="w-5 h-5" />
              <span>Meu Perfil</span>
            </Link>
            <Link to="/minhas-inscricoes" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
              <Ticket className="w-5 h-5" />
              <span>Minhas Inscrições</span>
            </Link>
            <Link to="/certificados" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
              <Award className="w-5 h-5" />
              <span>Certificados</span>
            </Link>
          </nav>
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
