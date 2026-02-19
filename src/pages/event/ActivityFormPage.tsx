"use client";

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Activity } from '@/src/types';
import { ActivityRepository } from '@/src/repositories/ActivityRepository';
import { ArrowLeft, Save, Clock, MapPin, Type, AlignLeft } from 'lucide-react';

export default function ActivityFormPage() {
  const { id: eventId, activityId } = useParams<{ id: string; activityId?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(activityId);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'palestra',
    date: '',
    start_time: '',
    end_time: '',
    location: '',
    hours: 0,
    generates_certificate: true
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing && activityId) {
      setIsLoading(true);
      ActivityRepository.listByEvent(eventId!).then(activities => {
        const activity = activities.find(a => a.id === activityId);
        if (activity) {
          setFormData({
            title: activity.title,
            description: activity.description || '',
            type: activity.type,
            date: activity.date.split('T')[0],
            start_time: activity.start_time.split('T')[1]?.substring(0, 5) || '',
            end_time: activity.end_time.split('T')[1]?.substring(0, 5) || '',
            location: activity.location || '',
            hours: activity.hours,
            generates_certificate: true
          });
        }
        setIsLoading(false);
      });
    }
  }, [isEditing, activityId, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) return;
    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        event_id: eventId,
        date: new Date(formData.date).toISOString(),
        start_time: new Date(`${formData.date}T${formData.start_time}`).toISOString(),
        end_time: new Date(`${formData.date}T${formData.end_time}`).toISOString(),
      };

      if (isEditing && activityId) {
        await ActivityRepository.updateActivity(activityId, payload);
      } else {
        await ActivityRepository.createActivity(payload);
      }

      alert('Atividade salva com sucesso!');
      navigate(`/evento/${eventId}/cronograma`);
    } catch (error: any) {
      alert('Erro ao salvar atividade: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to={`/evento/${eventId}/cronograma`} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar ao Cronograma
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Editar Atividade' : 'Nova Atividade'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Título da Atividade</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
              <Type className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descrição</label>
            <div className="relative">
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                rows={3}
              />
              <AlignLeft className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Data</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Carga Horária (h)</label>
              <input 
                type="number" 
                value={formData.hours}
                onChange={e => setFormData({...formData, hours: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Início</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={formData.start_time}
                  onChange={e => setFormData({...formData, start_time: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fim</label>
              <div className="relative">
                <input 
                  type="time" 
                  value={formData.end_time}
                  onChange={e => setFormData({...formData, end_time: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
                <Clock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Local / Link</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Auditório ou Link"
              />
              <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-indigo-300"
            >
              {isLoading ? 'Salvando...' : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Atividade
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}