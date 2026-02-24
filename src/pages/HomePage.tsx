import { useState, useEffect } from 'react';
import { Event } from '@/src/types';
import { getEvents } from '@/src/services/eventService';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { Bell, Compass, Award, PlusCircle } from 'lucide-react';
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
        const data = await getEvents();
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
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Olá, {user?.nome || 'Visitante'}</h1>
          <p className="text-gray-500">Confira os próximos eventos</p>
        </div>
        <Link to="/notificacoes" className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </header>

      {/* Próximos Eventos */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Próximos eventos</h2>
        {loading && <p className="text-gray-500">Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Meus Eventos */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Meus eventos</h2>
        <div>
          {events.slice(0, 3).map(event => (
            <EventCard key={event.id} event={event} variant="vertical" />
          ))}
        </div>
      </section>

      {/* Avisos */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Avisos</h2>
        <div className="bg-white p-4 rounded-xl shadow-sm space-y-3">
            {/* Avisos podem vir de outra fonte no futuro */}
            <div className="text-sm text-gray-700">Nenhum aviso no momento.</div>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ações rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/explorar" className="flex items-center text-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Compass className="w-6 h-6 text-indigo-600 mr-3" />
            <span className="font-semibold text-gray-700">Explorar eventos</span>
          </Link>
          <Link to="/certificados" className="flex items-center text-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <Award className="w-6 h-6 text-indigo-600 mr-3" />
            <span className="font-semibold text-gray-700">Meus certificados</span>
          </Link>
          {user && user.perfil !== 'aluno' && (
             <Link to="/evento/criar" className="flex items-center text-center bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                <PlusCircle className="w-6 h-6 text-indigo-600 mr-3" />
                <span className="font-semibold text-gray-700">Criar evento</span>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
