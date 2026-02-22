"use client";

import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/src/integrations/supabase/client';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const { session, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Redireciona se já estiver logado
  useEffect(() => {
    if (!loading && session) {
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [session, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            SIGEA<span className="text-indigo-600">.</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Acesse sua conta para gerenciar eventos e certificados.</p>
        </div>

        <Auth
          supabaseClient={supabase}
          providers={['google']}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4f46e5',
                  brandAccent: '#4338ca',
                  inputBackground: '#f9fafb',
                  inputText: '#111827',
                  inputBorder: '#e5e7eb',
                  inputLabelText: '#374151',
                },
                radii: {
                  borderRadiusButton: '12px',
                  buttonPadding: '12px',
                  inputPadding: '12px',
                },
                fontSizes: {
                  baseBodySize: '14px',
                  baseInputSize: '14px',
                  baseLabelSize: '14px',
                  baseButtonSize: '14px',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'font-bold shadow-sm transition-all active:scale-[0.98]',
              input: 'focus:ring-2 focus:ring-indigo-500 outline-none transition-all',
              label: 'font-semibold mb-1 block',
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre agora',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Crie uma senha',
                button_label: 'Criar conta',
                loading_button_label: 'Criando conta...',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'Endereço de e-mail',
                button_label: 'Enviar instruções',
                loading_button_label: 'Enviando...',
                link_text: 'Esqueceu sua senha?',
              },
            }
          }}
          theme="light"
        />

        <div className="text-center pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">
            Ao entrar, você concorda com nossos <Link to="/sistema/termos" className="text-indigo-600 hover:underline">Termos de Uso</Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}