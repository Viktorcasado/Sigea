import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Calendar, ShieldCheck, FileBarChart, History, PenTool, Send, FileUp, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/gestor/painel', label: 'Painel', icon: LayoutDashboard },
  { to: '/gestor/eventos', label: 'Eventos', icon: Calendar },
  { to: '/gestor/vinculos', label: 'Vínculos', icon: ShieldCheck },
  { to: '/gestor/relatorios', label: 'Relatórios', icon: FileBarChart },
  { to: '/gestor/auditoria', label: 'Auditoria', icon: History },
  { to: '/gestor/assinador', label: 'Assinador', icon: PenTool },
  { to: '/gestor/disparo', label: 'Disparo em Massa', icon: Send },
  { to: '/gestor/upload-certificado', label: 'Subir Certificado', icon: FileUp },
];

export default function GestorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-4 z-50 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-8 lg:block">
          <h2 className="text-xl font-bold text-gray-800">Painel do Gestor</h2>
          <button onClick={toggleSidebar} className="p-2 lg:hidden">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center lg:hidden">
          <button onClick={toggleSidebar} className="p-2 -ml-2">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <span className="ml-4 font-bold text-gray-800">Painel do Gestor</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
