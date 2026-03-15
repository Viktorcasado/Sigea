import { Activity } from '@/src/types';

const mockActivities: Activity[] = [
  {
    id: 1,
    event_id: 1,
    titulo: 'Palestra de Abertura: O Futuro da IA',
    descricao: 'Uma visão geral sobre como a inteligência artificial está moldando o mundo.',
    tipo: 'palestra',
    data: '2026-04-10',
    hora_inicio: '09:00',
    hora_fim: '10:30',
    local: 'Auditório Principal',
    instrutor: 'Dr. Alan Turing',
    carga_horaria_minutos: 90
  },
  {
    id: 2,
    event_id: 1,
    titulo: 'Minicurso: React para Iniciantes',
    descricao: 'Aprenda os conceitos básicos do React na prática.',
    tipo: 'minicurso',
    data: '2026-04-11',
    hora_inicio: '14:00',
    hora_fim: '18:00',
    local: 'Laboratório 01',
    instrutor: 'Eng. Ada Lovelace',
    carga_horaria_minutos: 240
  }
];

export const ActivityRepository = {
  async listByEvent(eventId: number): Promise<Activity[]> {
    return mockActivities.filter(a => a.event_id === Number(eventId));
  },

  async create(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const newActivity = { ...activityData, id: Math.floor(Math.random() * 1000) };
    mockActivities.push(newActivity);
    return newActivity;
  },

  async update(id: number, activityData: Partial<Omit<Activity, 'id'>>): Promise<Activity> {
    const index = mockActivities.findIndex(a => a.id === Number(id));
    if (index === -1) throw new Error('Atividade não encontrada');
    mockActivities[index] = { ...mockActivities[index], ...activityData };
    return mockActivities[index];
  },

  async delete(id: number): Promise<void> {
    const index = mockActivities.findIndex(a => a.id === Number(id));
    if (index !== -1) mockActivities.splice(index, 1);
  },
};
