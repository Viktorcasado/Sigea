import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUser } from '@/src/contexts/UserContext';
import { Activity, Event } from '@/src/types';
import { ActivityRepository } from '@/src/repositories/ActivityRepository';
import { EventRepository } from '@/src/repositories/EventRepository';
import { ArrowLeft, PlusCircle, Settings, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function SchedulePage() {
  const { id: eventId } = useParams<{ id: string }>();
  const { user } = useUser();
  const [event, setEvent] = useState<Event | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<Record<string, Activity[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    
    const fetchData = async () => {
        try {
            const eventData = await EventRepository.findById(eventId);
            setEvent(eventData);
            
            const data = await ActivityRepository.listByEvent(eventId);
            const sorted = [...data].sort((a, b) => 
                new Date(a.data + 'T' + a.hora_inicio).getTime() - new Date(b.data + 'T' + b.hora_inicio).getTime()
            );
            setActivities(sorted);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [eventId]);

  useEffect(() => {
    const groups = activities.reduce((acc, activity) => {
      const date = new Date(activity.data).toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric',
        weekday: 'long'
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(activity);
      return acc;
    }, {} as Record<string, Activity[]>);
    setGroupedActivities(groups);
  }, [activities]);

  const canManage = user && ['servidor', 'gestor', 'admin'].includes(user.perfil);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-bold">Carregando cronograma...</p>
    </div>
  );

  if (!event) return <div className="text-center py-20 font-bold text-gray-500">Evento não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <header className="mb-10">
        <Link to={`/evento/${eventId}`} className="flex items-center text-gray-600 hover:text-gray-900 font-bold group mb-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mr-3 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Voltar ao Evento
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{event.titulo}</h1>
        <p className="text-gray-500 font-bold mt-1">Cronograma Completo de Atividades</p>
      </header>

      {canManage && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <Link to={`/evento/${eventId}/atividades/criar`} className="flex items-center justify-center gap-3 p-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Adicionar Atividade
          </Link>
          <Link to={`/evento/${eventId}/atividades`} className="flex items-center justify-center gap-3 p-5 bg-white text-gray-700 font-black rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
            <Settings className="w-5 h-5" />
            Gerenciar Atividades
          </Link>
        </div>
      )}

      {Object.keys(groupedActivities).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-200" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Nenhuma atividade cadastrada</h2>
            <p className="mt-2 text-gray-500 font-bold">O cronograma deste evento ainda está sendo preparado.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedActivities).map(([date, acts]) => (
            <div key={date}>
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 ml-2 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                {date}
              </h3>
              <div className="space-y-4">
                {acts.map(act => (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center justify-center px-4 py-2 bg-indigo-50 rounded-2xl min-w-[80px]">
                                <span className="text-xs font-black text-indigo-600">{act.hora_inicio}</span>
                                <div className="w-full h-px bg-indigo-200 my-1"></div>
                                <span className="text-[10px] font-bold text-indigo-400">{act.hora_fim}</span>
                            </div>
                            <div>
                                <h4 className="font-black text-gray-900 tracking-tight text-lg">{act.titulo}</h4>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
                                        {act.local}
                                    </div>
                                    <div className="flex items-center text-xs font-bold text-indigo-500 uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                                        {act.carga_horaria_minutos ? `${Math.floor(act.carga_horaria_minutos / 60)}h ${act.carga_horaria_minutos % 60}min` : 'Duração N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="px-4 py-1.5 bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-gray-100">
                                {act.tipo}
                            </span>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}