"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, ShieldCheck, FileBarChart, History, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/services/supabase';

const KpiCard = ({ title, value, loading }: { title: string; value: string | number; loading?: boolean }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h3>
    <div className="mt-2 flex items-baseline gap-2">
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
      ) : (
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      )}
    </div>
  </div>
);

export default function PainelPage() {
  const [stats, setStats] = useState({
    events: 0,
    registrations: 0,
    pendingVinculos: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: eventsCount },
          { count: regCount },
          { count: vinculosCount },
          { count: certsCount }
        ] = await Promise.all([
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('event_registrations').select('*', { count: 'exact', head: true }),
          supabase.from('vinculos').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
          supabase.from('certificados').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          events: eventsCount || 0,
          registrations: regCount || 0,
          pendingVinculos: vinculosCount || 0,
          certificates: certsCount || 0
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Painel do Gestor</h1>
        <p className="text-gray-500 font-bold mt-1">Visão geral da sua instituição e atividades.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Eventos" value={stats.events} loading={loading} />
        <KpiCard title="Inscrições" value={stats.registrations} loading={loading} />
        <KpiCard title="Vínculos Pendentes" value={stats.pendingVinculos} loading={loading} />
        <KpiCard title="Certificados" value={stats.certificates} loading={loading} />
      </section>

      <section>
        <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/evento/criar" className="group flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-indigo-200 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="font-black text-gray-700 tracking-tight">Criar Evento</span>
          </Link>
          
          <Link to="/gestor/vinculos" className="group flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-green-200 transition-all">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-black text-gray-700 tracking-tight">Aprovar Vínculos</span>
          </Link>

          <Link to="/gestor/relatorios" className="group flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileBarChart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-black text-gray-700 tracking-tight">Relatórios</span>
          </Link>

          <Link to="/gestor/auditoria" className="group flex items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:border-purple-200 transition-all">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <History className="w-6 h-6 text-purple-600" />
            </div>
            <span className="font-black text-gray-700 tracking-tight">Auditoria</span>
          </Link>
        </div>
      </section>
    </div>
  );
}