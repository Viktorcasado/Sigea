import { useState, useEffect } from 'react';
import { EventRepository } from '@/src/repositories/EventRepository';

import { Event } from '@/src/types';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

// This would typically be in a shared component library
const StatusBadge = ({ status }: { status: Event['status'] }) => {
  const statusStyles: { [key in Event['status']]: string } = {
    rascunho: 'bg-yellow-100 text-yellow-800',
    publicado: 'bg-blue-100 text-blue-800',
    encerrado: 'bg-gray-100 text-gray-800',
  };
  const statusText: { [key in Event['status']]: string } = {
    rascunho: 'Rascunho',
    publicado: 'Publicado',
    encerrado: 'Encerrado',
  };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

export default function GestorEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    EventRepository.listAll().then(setEvents);
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Eventos</h1>
        <p className="text-gray-600 mt-1">Visualize e gerencie os eventos da sua instituição.</p>
      </header>

      {/* Filters would go here */}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{event.titulo}</div>
                      <div className="text-sm text-gray-500">{event.campus}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.data_inicio).toLocaleDateString('pt-BR')} - {event.data_fim ? new Date(event.data_fim).toLocaleDateString('pt-BR') : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={event.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/evento/${event.id}`} className="text-indigo-600 hover:text-indigo-900">Gerenciar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
        <div className="md:hidden divide-y divide-gray-200">
          {events.map(event => (
            <div key={event.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{event.titulo}</h3>
                  <p className="text-sm text-gray-500">{event.campus}</p>
                </div>
                <StatusBadge status={event.status} />
              </div>
              <div className="text-sm text-gray-600">
                {new Date(event.data_inicio).toLocaleDateString('pt-BR')} - {event.data_fim ? new Date(event.data_fim).toLocaleDateString('pt-BR') : ''}
              </div>
              <Link to={`/evento/${event.id}`} className="block w-full text-center py-2 bg-gray-50 text-indigo-600 font-semibold rounded-lg">
                Gerenciar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
