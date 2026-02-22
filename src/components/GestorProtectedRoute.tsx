import { useUser } from '@/src/contexts/UserContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GestorProtectedRoute = () => {
  const { user, session, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Se não houver nem sessão, manda para o login
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se houver sessão mas o perfil ainda não carregou (raro com o novo UserContext), espera
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Acesso liberado para todos os usuários autenticados na área de gestão
  // (A lógica de permissão específica pode ser adicionada aqui se necessário)
  return <Outlet />;
};

export default GestorProtectedRoute;