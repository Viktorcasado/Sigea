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
      // O Supabase processa o hash da URL automaticamente ao chamar getSession ou onAuthStateChange
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Erro no callback:", error);
        navigate('/login?erro=oauth', { replace: true });
        return;
      }

      if (session) {
        processed.current = true;
        // Limpa a URL para remover tokens e hashes
        window.history.replaceState({}, document.title, "/");
        navigate('/', { replace: true });
      } else {
        // Se não encontrou sessão de imediato, pode ser delay do hash. 
        // Vamos esperar o evento do onAuthStateChange no UserContext resolver.
        const timeout = setTimeout(() => {
          if (!processed.current) {
            navigate('/login?erro=oauth', { replace: true });
          }
        }, 5000);
        return () => clearTimeout(timeout);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Finalizando login...</h1>
        <p className="text-gray-500">Aguarde enquanto preparamos seu acesso.</p>
      </div>
    </div>
  );
}