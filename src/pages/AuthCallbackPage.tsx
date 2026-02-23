"use client";

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/src/contexts/UserContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const { session, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o UserContext já carregou a sessão, podemos sair daqui
    if (!loading && session) {
      navigate('/', { replace: true });
    } else if (!loading && !session) {
      // Se terminou de carregar e não tem sessão, algo deu errado
      navigate('/login', { replace: true });
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Autenticando...</h1>
        <p className="text-sm text-gray-500">Validando suas credenciais com o Google.</p>
      </div>
    </div>
  );
}