"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/src/services/supabase';
import { Event } from '@/src/types';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye, Calendar, MapPin, Loader2 } from 'lucide-react';

const StatusBadge = ({ status }: { status: Event['status'] }) => {
  const styles = {
    rascunho: 'bg-yellow-100 text-yellow-800',
    publicado: 'bg-green-100 text-green-800',
    encerrado: 'bg-gray-100 text-gray-800',
  };
  const labels = {
    rascunho: 'Rascunho',
    publicado: 'Publicado',
    encerrado: 'Encerrado',
  };
  return (
    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${styles[status] || styles.rascunho}`}>
      {labels[status] || 'Desconhecido'}
    </span>
  );
};

export default function GestorEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      setEvents((data || []).map(item => ({
        id: item.id,
        titulo: item.title,
        descricao: item.description,
        data_inicio: item.date,
        data_fim: item.date,
        local: item.location,
        status: 'publicado', // Mapeamento temporário
        campus: item.campus,
        modalidade: 'Presencial'
      } as Event)));
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
      alert('Evento excluído com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir evento:', error);
      alert('Não foi possível excluir o evento. Verifique se há inscrições vinculadas.');
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Gerenciamento de Eventos</h1>
            <p className="text-gray-500 font-bold mt-1">Visualize e controle todos os eventos da instituição.</p>
        </div>
        <Link to="/evento/criar" className="bg-indigo-600 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
            Novo Evento
        </Link>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold">Carregando eventos...</p>
            </div>
        ) : events.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Evento</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Data e Local</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <div className="font-black text-gray-900 tracking-tight">{event.titulo}</div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{event.campus}</div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center text-sm font-bold text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                        {new Date(event.data_inicio).toLocaleDateString('pt-BR')}
                                    </div>
                                    <div className="flex items-center text-xs font-medium text-gray-400 mt-1">
                                        <MapPin className="w-3.5 h-3.5 mr-2" />
                                        {event.local}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <StatusBadge status={event.status} />
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link 
                                            to={`/evento/${event.id}`} 
                                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                            title="Visualizar"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-red-600 hover:bg-red-50 transition-all"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold">Nenhum evento cadastrado.</p>
            </div>
        )}
      </div>
    </div>
  );
}