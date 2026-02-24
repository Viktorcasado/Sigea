import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/services/supabase';
import { Event } from '@/src/types';
import { useUser } from '@/src/contexts/UserContext';
import { checkInscription, createInscription, deleteInscription } from '@/src/services/inscriptionService';
import { useNotifications } from '@/src/contexts/NotificationContext';
import { ArrowLeft, Share2, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { addNotification } = useNotifications();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setEvent(data as Event);

        if (user) {
          const subscribed = await checkInscription(user.id, parseInt(id));
          setIsSubscribed(subscribed);
        }

      } catch (err) {
        setError('Não foi possível carregar o evento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleSubscription = async () => {
    if (!user || !event) return;

    setIsSubscriptionLoading(true);
    try {
      if (isSubscribed) {
        await deleteInscription(user.id, event.id);
        setIsSubscribed(false);
        addNotification({
          titulo: 'Inscrição Cancelada',
          mensagem: `Sua inscrição no evento "${event.titulo}" foi cancelada.`,
          tipo: 'aviso',
        });
      } else {
        await createInscription(user.id, event.id);
        setIsSubscribed(true);
        addNotification({
          titulo: 'Inscrição Confirmada',
          mensagem: `Você se inscreveu no evento "${event.titulo}".`,
          tipo: 'evento',
          referenciaId: event.id.toString(),
        });
      }
    } catch (err) {
      addNotification({
        titulo: 'Erro na Inscrição',
        mensagem: 'Não foi possível processar sua inscrição. Tente novamente.',
        tipo: 'sistema',
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Carregando detalhes do evento...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!event) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold">Evento não encontrado</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Voltar ao Início</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-4">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </button>
      </header>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.titulo}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-500 mb-6">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{new Date(event.data_inicio).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{event.local}</span>
                </div>
            </div>

            <p className="text-gray-600 leading-relaxed">{event.descricao}</p>
        </div>
        {user && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            {isSubscribed ? (
                 <button 
                    onClick={handleSubscription}
                    disabled={isSubscriptionLoading}
                    className="w-full text-center px-6 py-3 rounded-lg bg-red-100 text-red-800 font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <XCircle className="w-5 h-5"/> {isSubscriptionLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
                </button>
            ) : (
                <button 
                    onClick={handleSubscription}
                    disabled={isSubscriptionLoading}
                    className="w-full text-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 flex items-center justify-center gap-2"
                >
                    <CheckCircle className="w-5 h-5"/> {isSubscriptionLoading ? 'Inscrevendo...' : 'Inscrever-se'}
                </button>
            )}
            <button className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
