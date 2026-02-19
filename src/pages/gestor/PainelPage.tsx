"use client";

import { useState, useEffect } from 'react';
import { PlusCircle, ShieldCheck, FileBarChart, History, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '@/src/integrations/supabase/client';
import { useUser } from '@/src/contexts/UserContext';

const KpiCard = ({ title, value, change, delay = 0, loading = false }: { title: string; value: string | number; change?: string; delay?: number; loading?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
  >
    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">{title}</h3>
    <div className="flex items-baseline gap-2 mt-2">
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
      ) : (
        <p className="text-3xl font-black text-gray-900">{value}</p>
      )}
      {change && !loading && (
        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3 mr-1" />
          {change}
        </span>
      )}
    </div>
  </motion.div>
);

export default function PainelPage() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    events: 0,
    registrations: 0,
    pendingLinks: 0,
    certificates: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      // 1. Contagem de Eventos
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });

      // 2. Contagem de Inscrições Totais
      const { count: regCount } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true });

      // 3. Contagem de Certificados Emitidos
      const { count: certCount } = await supabase
        .from('certificados')
        .select('*', { count: 'exact', head: true });

      // 4. Contagem de Vínculos Pendentes (Servidores que ainda não são organizadores)
      const { count: pendingCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('user_type', 'servidor')
        .eq('is_organizer', false);

      setStats({
        events: eventsCount || 0,
        registrations: regCount || 0,
        certificates: certCount || 0,
        pendingLinks: pendingCount || 0
      });
      
      setLoading(false);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Painel do Gestor</h1>
        <p className="text-gray-500 mt-1">Visão geral da sua instituição e eventos.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Eventos Publicados" value={stats.events} delay={0.1} loading={loading} />
        <KpiCard title="Inscrições Totais" value={stats.registrations} delay={0.2} loading={loading} />
        <KpiCard title="Vínculos Pendentes" value={stats.pendingLinks} delay={0.3} loading={loading} />
        <KpiCard title="Certificados" value={stats.certificates} delay={0.4} loading={loading} />
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Ações Rápidas</h2>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/evento/criar" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all group">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Criar Evento</span>
          </Link>
          
          <Link to="/gestor/vinculos" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all group">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Aprovar Vínculos</span>
          </Link>
          
          <Link to="/gestor/relatorios" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all group">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileBarChart className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Relatórios</span>
          </Link>
          
          <Link to="/gestor/auditoria" className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 transition-all group">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <History className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-700">Auditoria</span>
          </Link>
        </div>
      </section>

      <section className="bg-indigo-600 rounded-3xl p-8 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-black mb-2">Precisa de ajuda?</h3>
          <p className="text-indigo-100 max-w-md mb-6">Confira nossa central de ajuda para gestores ou entre em contato com o suporte técnico.</p>
          <button className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
            Acessar Suporte
          </button>
        </div>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
}