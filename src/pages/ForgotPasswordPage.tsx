"use client";

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/services/supabase';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/perfil/seguranca`,
      });

      if (error) throw error;

      setMessage({ 
        type: 'success', 
        text: 'Um link de recuperação foi enviado para o seu e-mail.' 
      });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.message || 'Ocorreu um erro ao tentar enviar o e-mail.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-600 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Recuperar Senha</h1>
          <p className="text-gray-500 mt-2">Enviaremos um link para você redefinir sua senha</p>
        </header>

        {message && (
          <div className={`p-3 mb-4 text-sm text-center font-medium rounded-lg ${
            message.type === 'success' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Seu e-mail cadastrado"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full px-4 py-3 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}