"use client";

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          processed.current = true;
          // Limpa a URL removendo hash/query do OAuth
          window.history.replaceState({}, document.title, window.location.pathname);
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error("[AuthCallback] Erro:", err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Autenticando...</h1>
      </div>
    </div>
  );
}