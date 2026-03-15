import { Outlet, Link } from 'react-router-dom';
import BottomBar from './BottomBar';
import { Award } from 'lucide-react';

export default function Layout() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24">
      {/* Top Header for Mobile/Desktop */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">SIGEA</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/explorar" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Explorar</Link>
            <Link to="/validar-certificado" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Validar</Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
