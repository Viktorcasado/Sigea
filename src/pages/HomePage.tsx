import { useState, useEffect } from 'react';
import { Event } from '@/src/types';
import { getEvents } from '@/src/services/eventService';
import { Link } from 'react-router-dom';
import { Bell, Award, CheckCircle, PenTool, Search, ShieldCheck, AlertCircle } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { supabaseError } from '@/src/services/supabase';

export default function HomePage() {
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabaseError) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const isGestor = user && ['servidor', 'gestor', 'admin'].includes(user.perfil);

  if (supabaseError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erro de Configuração</h2>
          <p className="text-gray-600 mb-6">{supabaseError}</p>
          <div className="text-sm text-gray-500 bg-white p-4 rounded-2xl border border-red-50">
            Configure as variáveis <strong>VITE_SUPABASE_URL</strong> e <strong>VITE_SUPABASE_ANON_KEY</strong> no menu de Configurações (Settings) do AI Studio.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.nome || 'Visitante'}</h1>
          <p className="text-gray-500">Bem-vindo ao portal de Assinatura e Validação</p>
        </div>
        <Link to="/notificacoes" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Main Actions - Signing and Validating */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/validar-certificado" 
          className="group relative overflow-hidden rounded-[32px] bg-indigo-600 p-8 text-white shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
        >
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Validar Certificado</h2>
            <p className="mt-2 text-indigo-100">Verifique a autenticidade de certificados emitidos pelo sistema usando o código de validação.</p>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 transition-transform group-hover:scale-150" />
        </Link>

        {isGestor ? (
          <Link 
            to="/gestor/assinador" 
            className="group relative overflow-hidden rounded-[32px] bg-white p-8 text-gray-900 shadow-xl shadow-gray-200 ring-1 ring-black/5 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="relative z-10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <PenTool className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Assinar Documentos</h2>
              <p className="mt-2 text-gray-500">Gere assinaturas digitais institucionais para certificados e documentos oficiais.</p>
            </div>
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-50/50 transition-transform group-hover:scale-150" />
          </Link>
        ) : (
          <Link 
            to="/certificados" 
            className="group relative overflow-hidden rounded-[32px] bg-white p-8 text-gray-900 shadow-xl shadow-gray-200 ring-1 ring-black/5 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          >
            <div className="relative z-10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Meus Certificados</h2>
              <p className="mt-2 text-gray-500">Acesse e baixe todos os certificados de eventos que você participou.</p>
            </div>
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-50/50 transition-transform group-hover:scale-150" />
          </Link>
        )}
      </section>

      {/* Secondary Actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/explorar" className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition-all hover:bg-gray-50">
          <Search className="mb-3 h-6 w-6 text-indigo-600" />
          <span className="text-sm font-bold text-gray-700">Explorar</span>
        </Link>
        <Link to="/certificados" className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition-all hover:bg-gray-50">
          <Award className="mb-3 h-6 w-6 text-indigo-600" />
          <span className="text-sm font-bold text-gray-700">Certificados</span>
        </Link>
        <Link to="/perfil" className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition-all hover:bg-gray-50">
          <CheckCircle className="mb-3 h-6 w-6 text-indigo-600" />
          <span className="text-sm font-bold text-gray-700">Perfil</span>
        </Link>
        {isGestor && (
          <Link to="/gestor/painel" className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-black/5 transition-all hover:bg-gray-50">
            <PenTool className="mb-3 h-6 w-6 text-indigo-600" />
            <span className="text-sm font-bold text-gray-700">Gestão</span>
          </Link>
        )}
      </section>

      {/* Info Section */}
      <section className="rounded-[32px] bg-gray-900 p-8 text-white">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight">Segurança e Autenticidade</h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Todos os documentos assinados e certificados emitidos por esta plataforma possuem um código de validação único. 
            Isso garante que a informação seja íntegra e possa ser verificada por qualquer pessoa ou instituição a qualquer momento.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/sistema/sobre" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Saiba mais sobre a tecnologia &rarr;</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
