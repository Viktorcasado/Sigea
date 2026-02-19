"use client";

import { useState } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Image as ImageIcon } from 'lucide-react';

export default function EditProfilePage() {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  
  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) {
      setError('O nome completo é obrigatório.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await updateProfile({ nome, telefone, avatar_url: avatarUrl });
      alert('Perfil atualizado com sucesso!');
      navigate('/perfil');
    } catch (err: any) {
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/perfil" className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar para o Perfil
      </Link>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Perfil</h1>
            <p className="text-gray-500 text-sm">Mantenha seus dados sempre atualizados.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Preview" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-50 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL da Foto de Perfil</label>
              <div className="relative">
                <input 
                  type="url" 
                  value={avatarUrl} 
                  onChange={(e) => setAvatarUrl(e.target.value)} 
                  placeholder="https://exemplo.com/foto.jpg"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
                <ImageIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Insira o link de uma imagem para usar como avatar.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => setNome(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail (Não alterável)</label>
            <input 
              type="email" 
              value={user?.email || ''} 
              readOnly 
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Telefone</label>
            <input 
              type="tel" 
              value={telefone} 
              onChange={(e) => setTelefone(e.target.value)} 
              placeholder="(00) 00000-0000"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/perfil')}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:bg-indigo-300"
            >
              {isLoading ? 'Salvando...' : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}