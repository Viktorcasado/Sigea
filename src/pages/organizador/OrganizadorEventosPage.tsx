"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/src/services/supabase';
import { Event } from '@/src/types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Settings, ChevronRight, Loader2 } from 'lucide-react';

export default function OrganizadorEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: false });
        
        if (error) throw error;
        
        setEvents((data || []).map(item => ({
          id: item.id,
          titulo: item.title,
          data_inicio: item.date,
          local: item.location,
          campus: item.campus,
          status: 'publicado'
        } as Event)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Meus Eventos</h1>
        <p className="text-gray-500 font-bold mt-1">Gerencie o cronograma e os participantes dos seus eventos.</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
          <p className="font-black uppercase tracking-widest text-xs">Carregando seus eventos...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {events.map(event => (
            <div key={event.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-grow">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">{event.titulo}</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      {new Date(event.data_inicio).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      {event.campus}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <Link 
                    to={`/evento/${event.id}/cronograma`}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Gerenciar
                  </Link>
                  <Link 
                    to={`/evento/${event.id}`}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-bold">Você ainda não criou nenhum evento.</p>
          <Link to="/evento/criar" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-black hover:underline">
            Criar meu primeiro evento <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}