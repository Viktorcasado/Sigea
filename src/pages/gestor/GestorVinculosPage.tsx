"use client";

import { useEffect, useState } from 'react';
import { VinculoRepository } from '@/src/repositories/VinculoRepository';
import { Check, X, Loader2, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function GestorVinculosPage() {
  const [vinculos, setVinculos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadVinculos = async () => {
    setIsLoading(true);
    try {
      const data = await VinculoRepository.listPendentes();
      setVinculos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVinculos();
  }, []);

  const handleAprovar = async (id: string) => {
    if (!window.confirm('Deseja aprovar este servidor como organizador?')) return;
    try {
      await VinculoRepository.aprovarVinculo(id);
      setVinculos(prev => prev.filter(v => v.id !== id));
      alert('Vínculo aprovado com sucesso!');
    } catch (error) {
      alert('Erro ao aprovar vínculo.');
    }
  };

  const handleRejeitar = async (id: string) => {
    if (!window.confirm('Deseja rejeitar esta solicitação?')) return;
    try {
      await VinculoRepository.rejeitarVinculo(id);
      setVinculos(prev => prev.filter(v => v.id !== id));
      alert('Solicitação rejeitada.');
    } catch (error) {
      alert('Erro ao rejeitar vínculo.');
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-gray-900">Aprovação de Vínculos</h1>
        <p className="text-gray-600 mt-1">Analise solicitações de servidores para se tornarem organizadores.</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        </div>
      ) : vinculos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-100 text-center">
          <UserIcon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Nenhuma solicitação pendente no momento.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Campus / Matrícula</th>
                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {vinculos.map(vinculo => (
                <tr key={vinculo.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">{vinculo.full_name}</div>
                      <div className="text-xs text-gray-500 font-medium">Servidor</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="font-medium">{vinculo.campus}</div>
                      <div className="text-xs text-gray-400">SIAPE: {vinculo.registration_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAprovar(vinculo.id)} 
                        className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                        title="Aprovar"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleRejeitar(vinculo.id)} 
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                        title="Rejeitar"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}