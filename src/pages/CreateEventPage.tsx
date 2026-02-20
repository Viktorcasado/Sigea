"use client";

import { useState } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, AlignLeft, Users, Save } from 'lucide-react';
import { supabase } from '@/src/integrations/supabase/client';

export default function CreateEventPage() {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [campus, setCampus] = useState(user?.campus || '');
  const [data, setData] = useState('');
  const [local, setLocal] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!titulo || !data || !campus) {
      alert('Por favor, preencha os campos obrigatórios (Título, Data e Campus).');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert({
          title: titulo,
          description: descricao,
          date: new Date(data).toISOString(),
          location: local,
          campus: campus,
          workload: cargaHoraria,
          organizer_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      addNotification({
        titulo: 'Evento Criado',
        mensagem: `O evento "${titulo}" foi publicado com sucesso!`,
        tipo: 'evento',
        referenciaId: newEvent.id,
      });

      alert('Evento criado com sucesso!');
      navigate(`/evento/${newEvent.id}`);
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Link to="/perfil" className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Novo Evento</h1>
            <p className="text-gray-500 text-sm">Preencha os detalhes para publicar seu evento.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Título do Evento *</label>
            <input 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              placeholder="Ex: I Semana de Tecnologia"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
            <div className="relative">
              <textarea 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder="Conte mais sobre o evento..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
              />
              <AlignLeft className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data do Evento *</label>
              <input 
                type="datetime-local" 
                value={data} 
                onChange={(e) => setData(e.target.value)} 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carga Horária (Horas)</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={cargaHoraria} 
                  onChange={(e) => setCargaHoraria(Number(e.target.value))} 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
                <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Campus *</label>
              <input 
                type="text" 
                value={campus} 
                onChange={(e) => setCampus(e.target.value)} 
                placeholder="Ex: Maceió"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Local / Link</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={local} 
                  onChange={(e) => setLocal(e.target.value)} 
                  placeholder="Auditório ou Link do Meet"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
                <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/perfil')}
              className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-indigo-300"
            >
              {isLoading ? 'Publicando...' : (
                <>
                  <Save className="w-5 h-5" />
                  Publicar Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}