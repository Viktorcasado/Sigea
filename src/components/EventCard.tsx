import { Event } from '@/src/types';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle, Zap, Clock, Star, ArrowRight, ChevronRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  variant?: 'horizontal' | 'vertical' | 'list';
  isFavorite?: boolean;
  onToggleFavorite?: (eventId: string) => void;
}

const StatusBadge = ({ status }: { status: Event['status'] }) => {
  if (!status) return null;
  const statusInfo = {
    'rascunho': { icon: <Zap className="w-3 h-3 mr-1.5" />, color: 'bg-yellow-100 text-yellow-800', text: 'Rascunho' },
    'publicado': { icon: <CheckCircle className="w-3 h-3 mr-1.5" />, color: 'bg-blue-100 text-blue-800', text: 'Publicado' },
    'encerrado': { icon: <Clock className="w-3 h-3 mr-1.5" />, color: 'bg-gray-100 text-gray-800', text: 'Encerrado' },
  };
  const currentStatus = statusInfo[status] || { icon: null, color: 'bg-gray-100 text-gray-800', text: 'Indefinido' };
  return <div className={`text-[10px] inline-flex items-center font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${currentStatus.color}`}>{currentStatus.icon}{currentStatus.text}</div>;
};

export default function EventCard({ event, variant = 'horizontal', isFavorite, onToggleFavorite }: EventCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(event.id.toString());
  };

  if (variant === 'list') {
    return (
        <div className="block bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start gap-4">
                <Link to={`/evento/${event.id}`} className='flex-grow'>
                    <h3 className="font-black text-gray-900 text-lg tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{event.titulo}</h3>
                    <p className="text-sm font-bold text-gray-400 mt-1">{event.instituicao} • {event.campus}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-gray-500 mt-4">
                        <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-500" /> {new Date(event.data_inicio).toLocaleDateString('pt-BR')}</div>
                        <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-indigo-500" /> {event.modalidade}</div>
                    </div>
                </Link>
                <div className="flex flex-col items-end gap-2">
                    {onToggleFavorite && (
                        <button onClick={handleFavoriteClick} className="p-3 rounded-2xl bg-gray-50 hover:bg-yellow-50 transition-colors group/fav">
                            <Star className={`w-5 h-5 ${isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-300 group-hover/fav:text-yellow-400'}`} />
                        </button>
                    )}
                    <StatusBadge status={event.status} />
                </div>
            </div>
        </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <Link to={`/evento/${event.id}`} className="block bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{event.titulo}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{event.campus}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/evento/${event.id}`} className="flex-shrink-0 w-72 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 mr-4 overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{new Date(event.data_inicio).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                <span className="text-xl font-black leading-none">{new Date(event.data_inicio).getDate()}</span>
            </div>
            <StatusBadge status={event.status} />
        </div>
        <h3 className="font-black text-gray-900 text-xl tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{event.titulo}</h3>
        <p className="text-sm font-bold text-gray-400 flex items-center">
          <MapPin className="w-4 h-4 mr-1.5 text-indigo-500" />
          {event.campus}
        </p>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Ver Detalhes</span>
        <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}