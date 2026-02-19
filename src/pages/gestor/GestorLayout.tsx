"use client";

import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShieldCheck, FileBarChart, History, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

const navLinks = [
  { to: '/gestor/painel', label: 'Painel', icon: LayoutDashboard },
  { to: '/gestor/eventos', label: 'Eventos', icon: Calendar },
  { to: '/gestor/vinculos', label: 'Vínculos', icon: ShieldCheck },
  { to: '/gestor/relatorios', label: 'Relatórios', icon: FileBarChart },
  { to: '/gestor/auditoria', label: 'Auditoria', icon: History },
];

export default function GestorLayout() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 font-sans">
      {/* Sidebar para Desktop / Header para Mobile */}
      <aside className="lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 sticky top-0 z-30">
        <div className="p-4 lg:p-6 flex items-center justify-between lg:block">
          <div className="flex items-center gap-2">
            <NavLink to="/perfil" className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-indigo-600">
              <ChevronLeft className="w-6 h-6" />
            </NavLink>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              SIGEA <span className="text-indigo-600">GESTOR</span>
            </h2>
          </div>
        </div>

        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar px-4 pb-4 lg:p-4 gap-1 lg:space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 lg:p-10 pb-24 lg:pb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}