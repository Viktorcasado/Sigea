import { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, Loader2, Calendar, MapPin, Filter } from 'lucide-react';
import { EventRepository } from '@/src/repositories/EventRepository';
import { Event } from '@/src/types';
import EventCard from '@/src/components/EventCard';
import { motion, AnimatePresence } from 'motion/react';

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModality, setActiveModality] = useState<string | null>(null);

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
    if (activeModality) filtered = filtered.filter(e => e.modalidade === activeModality);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.titulo.toLowerCase().includes(term) || 
        e.campus?.toLowerCase().includes(term) ||
        e.instituicao?.toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [searchTerm, showFavorites, favorites, events, activeModality]);

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Explorar</h1>
        <p className="text-gray-500 font-bold mt-1">Encontre eventos no IFAL, UFAL e comunidade</p>
      </header>

      <div className="sticky top-4 z-20 space-y-4">
        <div className="flex gap-3">
            <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por título, campus ou instituição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-200/20 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-bold transition-all"
                />
            </div>
            <button className="p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:bg-gray-50 transition-all active:scale-95">
                <SlidersHorizontal className="w-6 h-6 text-gray-700" />
            </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap ${
                    showFavorites ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-gray-100 text-gray-500 hover:border-indigo-200'
                }`}
            >
                <Star className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
                Favoritos
            </button>
            
            <div className="w-px h-8 bg-gray-200 mx-1 self-center"></div>

            {['Presencial', 'Online', 'Híbrido'].map(mod => (
                <button 
                    key={mod} 
                    onClick={() => setActiveModality(activeModality === mod ? null : mod)}
                    className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                        activeModality === mod 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-white border border-gray-100 text-gray-500 hover:border-indigo-200'
                    }`}
                >
                    {mod}
                </button>
            ))}
        </div>
      </div>

      <main>
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-gray-400"
                >
                    <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
                    <p className="font-black uppercase tracking-widest text-xs">Buscando eventos...</p>
                </motion.div>
            ) : filteredEvents.length > 0 ? (
                <motion.div 
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2 mb-6">
                        {filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}
                    </p>
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            variant="list" 
                            isFavorite={favorites.has(Number(event.id))}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </motion.div>
            ) : (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm"
                >
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                        <Search className="w-12 h-12 text-gray-200" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Nenhum evento encontrado</h3>
                    <p className="text-gray-500 font-bold mt-2 max-w-xs mx-auto">Tente ajustar sua busca ou remover alguns filtros para encontrar o que procura.</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setActiveModality(null); setShowFavorites(false); }}
                        className="mt-10 text-indigo-600 font-black uppercase tracking-widest text-xs hover:underline"
                    >
                        Limpar todos os filtros
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </main>
    </div>
  );
}