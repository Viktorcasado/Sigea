"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, Calendar, Users, Award, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/services/supabase';
import { useUser } from '@/src/contexts/UserContext';

const StatCard = ({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h3>
    <p className="text-3xl font-black text-gray-900 tracking-tight mt-1">{value}</p>
  </div>
);

export default function OrganizadorPainelPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({ events: 0, registrations: 0, certificates: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Em uma app real, filtraríamos pelo organizer_id
        const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true });
        const { count: regCount } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true });
        
        setStats({
          events: eventsCount || 0,
          registrations: regCount || 0,
          certificates: 0 // Placeholder
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Olá, Organizador</h1>
          <p className="text-gray-500 font-bold mt-1">Gerencie seus eventos e acompanhe o engajamento.</p>
        </div>
        <Link 
          to="/evento/criar" 
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Criar Novo Evento
        </Link>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Meus Eventos" value={stats.events} icon={Calendar} color="bg-indigo-50 text-indigo-600" />
        <StatCard title="Total Inscritos" value={stats.registrations} icon={Users} color="bg-blue-50 text-blue-600" />
        <StatCard title="Certificados" value={stats.certificates} icon={Award} color="bg-green-50 text-green-600" />
      </section>

      <section className="bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-black tracking-tight mb-4">Pronto para o próximo evento?</h2>
          <p className="text-indigo-200 font-bold mb-8">Configure o cronograma, adicione atividades e prepare os certificados para seus participantes.</p>
          <Link 
            to="/organizador/meus-eventos" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-900 font-black rounded-2xl hover:bg-indigo-50 transition-all"
          >
            Gerenciar Eventos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full -mr-32 -mb-32 blur-3xl"></div>
      </section>
    </div>
  );
}