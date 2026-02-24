import { useState, useEffect } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import { supabaseError } from '@/src/services/supabase';
import { ArrowRight, Wifi, Power } from 'lucide-react';

export default function LoginPage() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithGoogle } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/'); // O onAuthStateChange cuidará do redirecionamento
    } catch (err: any) {
      if (err.message.includes('Invalid login credentials')) {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Sem conexão. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError('Ocorreu um erro ao tentar login com o Google.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center font-sans text-white p-4"
      style={{ backgroundImage: "url('https://picsum.photos/seed/windows/1920/1080')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Lock Screen Time - Hidden on focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center group-focus-within:opacity-0 transition-opacity duration-500">
        <h1 className="text-7xl font-bold">{formatTime(time)}</h1>
        <p className="text-2xl mt-2">{formatDate(time)}</p>
      </div>

      {/* Main Login Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col items-center p-12 bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
          <img 
            src="https://picsum.photos/seed/avatar/128/128" 
            alt="User Avatar" 
            className="w-32 h-32 rounded-full border-4 border-white/20 mb-4"
          />
          <h2 className="text-2xl font-semibold mb-6">Administrador</h2>
          
          {supabaseError && (
            <div className="p-3 mb-4 text-sm text-center font-medium text-red-200 bg-red-500/30 rounded-lg">
              <strong>Erro de Configuração:</strong> {supabaseError}
            </div>
          )}

          <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
            <div className="relative">
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Endereço de e-mail"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none placeholder:text-gray-300"
              />
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Senha"
                className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none placeholder:text-gray-300"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300">
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-300 text-center">{error}</p>}
            <button type="submit" disabled={isLoading || !!supabaseError} className="w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white bg-indigo-600/80 rounded-lg hover:bg-indigo-500 disabled:bg-indigo-400/50 disabled:opacity-70 transition-colors">
              <span>{isLoading ? 'Entrando...' : 'Entrar'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          
          <div className="relative flex items-center justify-center w-full my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative px-2 bg-black/20 text-gray-300 text-sm">OU</div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={isLoading || !!supabaseError} 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-70 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.59L5.84 9.43c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Entrar com Google</span>
          </button>

          <div className="text-center text-sm text-gray-300 mt-6">
            <Link to="/forgot-password" className="hover:underline">Não consegue entrar?</Link>
          </div>
        </div>
      </div>

      {/* Bottom Right Icons */}
      <div className="absolute bottom-6 right-6 flex items-center gap-6 text-white">
        <Wifi className="w-5 h-5" />
        <Power className="w-5 h-5" />
      </div>
    </div>
  );
}
