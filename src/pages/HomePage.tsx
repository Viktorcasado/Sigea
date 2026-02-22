"use client";

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Compass, Award, Calendar, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { useUser } from '@/src/contexts/UserContext';
import { supabase } from '@/src/integrations/supabase/client';
import { Event } from '@/src/types';
import EventCard from '@/src/components/EventCard';
import { motion } from 'motion/react';

export default function HomePage() {
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error: supabaseError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true })
          .limit(10);

        if (supabaseError) throw supabaseError;

        if (data) {
          setEvents(data.map(e => ({
            id: e.id,
            titulo: e.title,
            descricao: e.description || '',
            dataInicio: new Date(e.date),
            local: e.location || '',
            campus: e.campus || '',
            instituicao: 'IFAL',
            modalidade: 'Presencial',
            status: 'publicado',
            carga_horaria: e.workload || 0
          })));
        }
      } catch (err) {
        setError("Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Olá, {user?.nome.split(' ')[0] || 'Visitante'}!</h1>
          <p className="text-gray-500 font-medium">O que vamos aprender hoje?</p>
        </div>
        <Link to="/notificacoes" className="relative p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white border-2 border-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Hero Section / Featured */}
      <section className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3" />
            Destaque da Semana
          </div>
          <h2 className="text-3xl font-black mb-3 leading-tight">Expanda seus horizontes acadêmicos.</h2>
          <p className="text-indigo-100 font-medium mb-8 text-sm leading-relaxed">
            Descubra palestras, workshops e cursos certificados nos campi do IFAL. Sua jornada profissional começa aqui.
          </p>
          <Link to="/explorar" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-lg">
            Explorar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mb-12 -mr-12 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </section>

      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Próximos Eventos</h2>
            <p className="text-sm text-gray-500 font-medium">Não perca as datas de inscrição.</p>
          </div>
          <Link to="/explorar" className="text-sm font-black text-indigo-600 hover:underline uppercase tracking-widest">
            Ver Todos
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-72 h-48 bg-gray-100 rounded-3xl animate-pulse shrink-0" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Nenhum evento disponível no momento.</p>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/explorar" className="group flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-50">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Compass className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-black text-gray-900">Explorar Eventos</span>
                <span className="text-xs text-gray-500 font-medium">Encontre o que você busca</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-colors" />
          </Link>
          
          <Link to="/certificados" className="group flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-50">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mr-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="block font-black text-gray-900">Meus Certificados</span>
                <span className="text-xs text-gray-500 font-medium">Suas conquistas salvas</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 transition-colors" />
          </Link>
        </div>
      </section>
    </div>
  );
}