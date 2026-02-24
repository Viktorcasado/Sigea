"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabaseError } from '@/src/services/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle, user, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Se o usuário já estiver logado, redireciona para a home
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
      // O redirecionamento acontecerá via useEffect quando o estado do usuário mudar
    } catch (err: any) {
      setIsSubmitting(false);
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-mail ou senha inválidos.');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Por favor, confirme seu e-mail antes de entrar.');
      } else {
        setError('Ocorreu um erro ao tentar entrar. Verifique sua conexão.');
        console.error(err);
      }
    }
  };

  const handleGoogleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setIsSubmitting(false);
      setError('Ocorreu um erro ao tentar login com o Google.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <header className="text-center mb-10">
            <Link to="/" className="inline-block mb-6">
              <div className="text-4xl font-black text-gray-900 tracking-tighter">
                SIGEA<span className="text-indigo-600">.</span>
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-gray-500 mt-2">Acesse sua conta para gerenciar seus eventos</p>
          </header>

          {supabaseError && (
            <div className="p-4 mb-6 text-sm font-medium text-red-700 bg-red-50 rounded-2xl border border-red-100">
              <strong>Erro de Configuração:</strong> {supabaseError}
            </div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 mb-6 text-sm font-medium text-red-600 bg-red-50 rounded-2xl border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-700 ml-1">E-mail</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-gray-700">Senha</label>
                <Link to="/forgot-password" tabIndex={-1} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !!supabaseError} 
              className="w-full flex items-center justify-center gap-2 px-4 py-4 font-bold text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 disabled:bg-gray-300 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-4 text-xs font-bold text-gray-400 bg-white uppercase tracking-widest">ou continue com</span>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={isSubmitting || !!supabaseError} 
            className="w-full flex items-center justify-center gap-3 px-4 py-4 font-bold text-gray-700 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.59L5.84 9.43c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-10">
            Não tem uma conta? <Link to="/register" className="font-bold text-indigo-600 hover:underline">Crie uma agora</Link>
          </p>
        </div>

        <footer className="text-center mt-8 space-x-4">
          <Link to="/sistema/termos" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Termos de Uso</Link>
          <Link to="/sistema/politicas" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Privacidade</Link>
        </footer>
      </motion.div>
    </div>
  );
}