import { Vinculo, VinculoStatus } from '@/src/types';

const mockVinculos: Vinculo[] = [
  {
    id: 1,
    user_id: 'user-123',
    instituicao: 'IFAL',
    campus: 'Maceió',
    matricula: '2023101010',
    status: 'pendente',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 'user-456',
    instituicao: 'IFAL',
    campus: 'Marechal Deodoro',
    siape: '1234567',
    status: 'pendente',
    created_at: new Date().toISOString()
  }
];

export const VinculoRepository = {
  async listByStatus(status: VinculoStatus): Promise<Vinculo[]> {
    return mockVinculos.filter(v => v.status === status);
  },

  async updateStatus(vinculoId: number, status: VinculoStatus): Promise<Vinculo> {
    const index = mockVinculos.findIndex(v => v.id === Number(vinculoId));
    if (index === -1) throw new Error('Vínculo não encontrado');
    mockVinculos[index].status = status;
    return mockVinculos[index];
  },

  async create(vinculoData: Omit<Vinculo, 'id' | 'created_at'>): Promise<Vinculo> {
    const newVinculo: Vinculo = {
      ...vinculoData,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    };
    mockVinculos.push(newVinculo);
    return newVinculo;
  },
};
