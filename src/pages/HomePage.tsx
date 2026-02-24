import { useState, useEffect } from 'react';
import { Event } from '@/src/types';
import { EventRepository } from '@/src/repositories/EventRepository';
import { Link } from 'react-router-dom';
import { Bell, Compass, Award, PlusCircle, Loader2, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import EventCard from '@/src/components/EventCard';
import { motion } from 'motion/react';

export default function HomePage() {
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventRepository.listAll()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Olá, {user?.nome.split(' ')[0] || 'Visitante'}</h1>
          <p className="text-gray-500 font-bold mt-1">Confira o que está acontecendo no campus</p>
        </div>
        <Link to="/notificacoes" className="relative p-4 bg-white rounded-[1.5rem] shadow-sm border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white ring-4 ring-gray-50">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Próximos Eventos */}
      <section>
        <div className="flex justify-between items-end mb-6 px-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Próximos eventos</h2>
          <Link to="/explorar" className="text-sm font-black text-indigo-600 hover:underline flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-72 h-56 bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-2 scrollbar-hide">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CalendarIcon className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-gray-500 font-bold">Nenhum evento programado para os próximos dias.</p>
          </div>
        )}
      </section>

      {/* Ações Rápidas */}
      <section>
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 px-2">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/explorar" className="group flex items-center p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Compass className="w-7 h-7 text-indigo-600" />
            </div>
            <span className="font-black text-gray-800 tracking-tight">Explorar</span>
          </Link>
          
          <Link to="/certificados" className="group flex items-center p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:border-green-200 transition-all">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Award className="w-7 h-7 text-green-600" />
            </div>
            <span className="font-black text-gray-800 tracking-tight">Certificados</span>
          </Link>

          {user && ['servidor', 'gestor', 'admin'].includes(user.perfil) && (
             <Link to="/evento/criar" className="group flex items-center p-6 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-7 h-7 text-white" />
                </div>
                <span className="font-black text-white tracking-tight">Criar Evento</span>
            </Link>
          )}
        </div>
      </section>

      {/* Minhas Inscrições */}
      {user && (
        <section>
          <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 px-2">Minhas inscrições</h2>
          <div className="space-y-4">
            {events.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} variant="vertical" />
            ))}
            {events.length === 0 && !loading && (
              <p className="text-sm text-gray-400 font-bold px-4">Você ainda não se inscreveu em nenhum evento.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}