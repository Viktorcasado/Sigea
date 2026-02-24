import { useState, useEffect } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { updateProfile } from '@/src/services/profileService';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Copy, Paperclip, ShieldCheck, CreditCard } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import { validateCPF } from '@/src/utils/cpf';

export default function DocumentsPage() {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();

  const [cpf, setCpf] = useState(user?.cpf || '');
  const [isCpfValid, setIsCpfValid] = useState(true);
  const [matricula, setMatricula] = useState(user?.matricula || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length === 11) {
      setIsCpfValid(validateCPF(cpf));
    } else if (cleanCpf.length > 0) {
      setIsCpfValid(false);
    } else {
      setIsCpfValid(true);
    }
  }, [cpf]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cpf.replace(/\D/g, ''));
    alert('CPF copiado!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (cpf && !validateCPF(cpf)) {
      setIsCpfValid(false);
      alert('CPF inválido. Verifique os números.');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(user.id, { 
        matricula,
        // Nota: Se quiser salvar o CPF, precisará adicionar a coluna 'cpf' na tabela 'profiles'
      });
      await refreshUser();
      alert('Documentos atualizados com sucesso!');
      navigate('/perfil');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar documentos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/perfil" className="flex items-center text-gray-600 hover:text-gray-900 font-bold mb-8 group">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100 mr-3 group-hover:scale-110 transition-transform">
            <ArrowLeft className="w-5 h-5" />
        </div>
        Voltar para o Perfil
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Documento de Identidade</h2>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">Número do CPF</label>
            <div className="relative">
              <IMaskInput
                mask="000.000.000-00"
                value={cpf}
                onAccept={(value: any) => setCpf(value)}
                placeholder="000.000.000-00"
                className={`w-full px-6 py-4 bg-gray-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium ${!isCpfValid ? 'border-red-300' : 'border-gray-100'}`}
              />
              <button type="button" onClick={copyToClipboard} className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-indigo-600 transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            {!isCpfValid && <p className="text-xs font-bold text-red-500 ml-2">CPF inválido. Verifique os números.</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Vínculo Institucional</h2>
            </div>
            
            <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700">Matrícula ou SIAPE</label>
                <input 
                    type="text" 
                    value={matricula} 
                    onChange={(e) => setMatricula(e.target.value)} 
                    placeholder="Ex: 202512345" 
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all font-medium" 
                />
            </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-dashed border-gray-200 flex items-center gap-4 text-gray-400">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <Paperclip className='w-5 h-5' />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest">Anexos comprobatórios em breve</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
            <button 
                type="submit" 
                disabled={isLoading || !isCpfValid} 
                className="flex-1 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:bg-gray-300"
            >
                {isLoading ? 'Salvando...' : 'Salvar Documentos'}
            </button>
            <button 
                type="button" 
                onClick={() => navigate('/perfil')} 
                className="flex-1 px-8 py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
            >
                Voltar
            </button>
        </div>
      </form>
    </div>
  );
}