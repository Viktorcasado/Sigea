import { useState, useEffect } from 'react';
import { Event } from '@/src/types';
import { EventRepository } from '@/src/repositories/EventRepository';
import { Link } from 'react-router-dom';
import { Bell, Compass, Award, PlusCircle, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useUser } from '@/src/contexts/UserContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import EventCard from '@/src/components/EventCard';

export default function HomePage() {
  const { user } = useUser();
  const { unreadCount } = useNotifications();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await EventRepository.listAll();
        setEvents(data);
      } catch (err) {
        setError('Não foi possível carregar os eventos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Olá, {user?.nome.split(' ')[0] || 'Visitante'}</h1>
          <p className="text-gray-500 font-medium">Confira o que está acontecendo no campus</p>
        </div>
        <Link to="/notificacoes" className="relative p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white ring-4 ring-gray-50">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Próximos Eventos */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-black text-gray-900">Próximos eventos</h2>
          <Link to="/explorar" className="text-sm font-bold text-indigo-600 hover:underline">Ver todos</Link>
        </div>
        
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-64 h-48 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-2 scrollbar-hide">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[2.5rem] text-center border border-gray-100">
            <CalendarIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Nenhum evento programado para os próximos dias.</p>
          </div>
        )}
      </section>

      {/* Ações Rápidas */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-6">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/explorar" className="group flex items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-bold text-gray-800">Explorar</span>
          </Link>
          
          <Link to="/certificados" className="group flex items-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-green-200 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-bold text-gray-800">Certificados</span>
          </Link>

          {user && ['servidor', 'gestor', 'admin'].includes(user.perfil) && (
             <Link to="/evento/criar" className="group flex items-center p-6 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-white">Criar Evento</span>
            </Link>
          )}
        </div>
      </section>

      {/* Meus Eventos (Inscrições Recentes) */}
      {user && (
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-6">Minhas inscrições</h2>
          <div className="space-y-3">
            {events.slice(0, 2).map(event => (
              <EventCard key={event.id} event={event} variant="vertical" />
            ))}
            {events.length === 0 && !loading && (
              <p className="text-sm text-gray-400 font-medium px-2">Você ainda não se inscreveu em nenhum evento.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}