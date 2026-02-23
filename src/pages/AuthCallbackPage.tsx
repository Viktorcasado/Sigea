"use client";

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const processed = useRef(false);

  useEffect(() => {
    // Evita processamento duplo em ambientes de desenvolvimento (Strict Mode)
    if (processed.current) return;
    
    const handleCallback = async () => {
      try {
        // O Supabase recupera automaticamente a sessão do fragmento da URL (#access_token=...)
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session) {
          processed.current = true;
          console.log("[AuthCallback] Sessão recuperada com sucesso");
          
          // Redireciona para a home de forma limpa
          // Usamos replace: true para que o usuário não consiga voltar para a página de callback
          navigate('/', { replace: true });
        } else {
          // Se não houver sessão, aguarda um pouco (pode ser delay de rede) ou volta para o login
          const timeout = setTimeout(() => {
            if (!processed.current) {
              console.warn("[AuthCallback] Nenhuma sessão encontrada após timeout");
              navigate('/login', { replace: true });
            }
          }, 2000);
          return () => clearTimeout(timeout);
        }
      } catch (err) {
        console.error("[AuthCallback] Erro no processamento do OAuth:", err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Finalizando autenticação...</h1>
        <p className="text-sm text-gray-500">Isso levará apenas um instante.</p>
      </div>
    </div>
  );
}