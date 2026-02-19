import { Vinculo, VinculoStatus } from '@/src/types';
import { mockUsers } from '@/src/data/mock';

const mockVinculosDB: Vinculo[] = [];

export const VinculoRepositoryMock = {
  async listByStatus(status: VinculoStatus): Promise<Vinculo[]> {
    return mockVinculosDB.filter(v => v.status === status);
  },

  async updateStatus(vinculoId: string, status: VinculoStatus): Promise<Vinculo | null> {
    const index = mockVinculosDB.findIndex(v => v.id === vinculoId);
    if (index > -1) {
      mockVinculosDB[index].status = status;
      return mockVinculosDB[index];
    }
    return null;
  }
};