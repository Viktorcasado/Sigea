import { Event } from '@/src/types';

const mockEvents: Event[] = [
  {
    id: 1,
    titulo: 'I Simpósio de Tecnologia do IFAL',
    descricao: 'Um evento focado em inovações tecnológicas e desenvolvimento de software.',
    data_inicio: '2026-04-10T08:00:00',
    data_fim: '2026-04-12T18:00:00',
    local: 'Auditório Central - Campus Maceió',
    banner_url: 'https://picsum.photos/seed/tech/800/400',
    status: 'publicado',
    modalidade: 'Presencial',
    vagas: 200,
    instituicao: 'IFAL',
    campus: 'Maceió'
  },
  {
    id: 2,
    titulo: 'Semana de Meio Ambiente 2026',
    descricao: 'Discussões sobre sustentabilidade e preservação ambiental no contexto alagoano.',
    data_inicio: '2026-06-05T09:00:00',
    data_fim: '2026-06-07T17:00:00',
    local: 'Campus Marechal Deodoro',
    banner_url: 'https://picsum.photos/seed/nature/800/400',
    status: 'publicado',
    modalidade: 'Híbrido',
    vagas: 150,
    instituicao: 'IFAL',
    campus: 'Marechal Deodoro'
  },
  {
    id: 3,
    titulo: 'Workshop de Robótica Educativa',
    descricao: 'Oficinas práticas de montagem e programação de robôs para iniciantes.',
    data_inicio: '2026-05-20T14:00:00',
    data_fim: '2026-05-20T18:00:00',
    local: 'Laboratório de Informática',
    banner_url: 'https://picsum.photos/seed/robot/800/400',
    status: 'publicado',
    modalidade: 'Presencial',
    vagas: 30,
    instituicao: 'IFAL',
    campus: 'Maceió'
  }
];

export const EventRepository = {
  async listAll(): Promise<Event[]> {
    return mockEvents;
  },

  async findById(id: number): Promise<Event | null> {
    return mockEvents.find(e => e.id === Number(id)) || null;
  },

  async create(eventData: Omit<Event, 'id'>): Promise<Event> {
    const newEvent = { ...eventData, id: Math.floor(Math.random() * 1000) };
    mockEvents.push(newEvent);
    return newEvent;
  },

  async update(id: number, eventData: Partial<Omit<Event, 'id'>>): Promise<Event> {
    const index = mockEvents.findIndex(e => e.id === Number(id));
    if (index === -1) throw new Error('Evento não encontrado');
    mockEvents[index] = { ...mockEvents[index], ...eventData };
    return mockEvents[index];
  },

  async listByIds(ids: number[]): Promise<Event[]> {
    return mockEvents.filter(e => ids.includes(e.id));
  },

  async delete(id: number): Promise<void> {
    const index = mockEvents.findIndex(e => e.id === Number(id));
    if (index !== -1) mockEvents.splice(index, 1);
  },
};
