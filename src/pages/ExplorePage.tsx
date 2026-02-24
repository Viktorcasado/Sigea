import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, X, Loader2 } from 'lucide-react';
import { EventRepository } from '@/src/repositories/EventRepository';
import { Event } from '@/src/types';
import EventCard from '@/src/components/EventCard';
import { motion } from 'motion/react';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    EventRepository.listAll()
      .then(setEvents)
      .finally(() => setIsLoading(false));
  }, []);

  const toggleFavorite = (eventId: string) => {
    const numericId = parseInt(eventId, 10);
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(numericId)) next.delete(numericId);
      else next.add(numericId);
      return next;
    });
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (showFavorites) filtered = filtered.filter(e => favorites.has(Number(e.id)));
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.titulo.toLowerCase().includes(term) || 
        e.campus?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [searchTerm, showFavorites, favorites, events]);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Explorar</h1>
        <p className="text-gray-500 font-bold mt-1">Encontre eventos no IFAL, UFAL e comunidade</p>
      </header>

      <div className="sticky top-4 z-10 space-y-4">
        <div className="flex gap-3">
            <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold transition-all"
                />
            </div>
            <button className="p-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                <SlidersHorizontal className="w-6 h-6 text-gray-700" />
            </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
                    showFavorites ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-500'
                }`}
            >
                <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
                Favoritos
            </button>
            {['Presencial', 'Online', 'Híbrido'].map(mod => (
                <button key={mod} className="px-6 py-2.5 bg-white border border-gray-100 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:border-indigo-200 transition-all">
                    {mod}
                </button>
            ))}
        </div>
      </div>

      <main>
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold">Buscando eventos...</p>
            </div>
        ) : filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                variant="list" 
                isFavorite={favorites.has(Number(event.id))}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Nenhum evento encontrado</h3>
            <p className="text-gray-500 font-bold mt-2">Tente ajustar sua busca ou filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
}