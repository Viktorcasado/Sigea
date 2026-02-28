import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InscricaoRepository } from '@/src/repositories/InscricaoRepository';
import { EventRepository } from '@/src/repositories/EventRepository';
import { Event } from '@/src/types';
import { ArrowLeft, Search, Users, Download, Mail, User, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function ManageParticipantsPage() {
  const { id: eventId } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!eventId) return;
    
    const fetchData = async () => {
        try {
            const [eventData, participantsData] = await Promise.all([
                EventRepository.findById(eventId),
                InscricaoRepository.listByEvent(eventId)
            ]);
            setEvent(eventData);
            setParticipants(participantsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    fetchData();
  }, [eventId]);

  const filteredParticipants = participants.filter(p => 
    p.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profiles?.registration_number?.includes(searchTerm)
  );

  const handleExport = () => {
    alert('A exportação para CSV/Excel está sendo processada e será enviada para seu e-mail em breve.');
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-gray-500 font-bold">Carregando participantes...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <header className="mb-10">
        <Link to={`/evento/${eventId}/cronograma`} className="flex items-center text-gray-600 hover:text-gray-900 font-bold group mb-6">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mr-3 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Voltar ao Cronograma
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Participantes</h1>
                <p className="text-gray-500 font-bold mt-1">{event?.titulo}</p>
            </div>
            <button 
                onClick={handleExport}
                className="flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-black rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
            >
                <Download className="w-5 h-5 text-indigo-600" />
                Exportar Lista
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total de Inscritos</p>
            <p className="text-3xl font-black text-gray-900">{participants.length}</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Alunos / Servidores</p>
            <p className="text-3xl font-black text-indigo-600">
                {participants.filter(p => ['aluno', 'servidor'].includes(p.profiles?.user_type)).length}
            </p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Comunidade Externa</p>
            <p className="text-3xl font-black text-green-600">
                {participants.filter(p => p.profiles?.user_type === 'comunidade_externa').length}
            </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por nome ou matrícula..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participante</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vínculo / Campus</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Matrícula</th>
                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {filteredParticipants.map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                        {p.profiles?.full_name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="font-black text-gray-900 tracking-tight">{p.profiles?.full_name}</div>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center text-sm font-bold text-gray-600">
                                    <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" />
                                    <span className="capitalize">{p.profiles?.user_type?.replace('_', ' ')}</span>
                                </div>
                                <div className="text-xs font-medium text-gray-400 mt-1">{p.profiles?.campus || 'Não informado'}</div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-mono font-bold text-gray-500">{p.profiles?.registration_number || '---'}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <button className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                    <Mail className="w-5 h-5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {filteredParticipants.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Users className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Nenhum participante encontrado</h3>
                    <p className="text-gray-500 font-bold mt-2">Tente ajustar sua busca ou aguarde novas inscrições.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}