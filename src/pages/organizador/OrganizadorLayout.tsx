"use client";

import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Award, ArrowLeft, Settings } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';

const navLinks = [
  { to: '/organizador/painel', label: 'Início', icon: LayoutDashboard },
  { to: '/organizador/meus-eventos', label: 'Meus Eventos', icon: Calendar },
  { to: '/organizador/certificados', label: 'Certificados', icon: Award },
];

export default function OrganizadorLayout() {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 h-screen sticky top-0 p-8">
        <div className="mb-12 px-2">
          <Link to="/" className="text-3xl font-black text-gray-900 tracking-tighter">
            SIGEA<span className="text-indigo-600">.</span>
          </Link>
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Painel Organizador</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <Link 
            to="/perfil"
            className="flex items-center gap-4 px-5 py-3.5 w-full rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Perfil
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}