import React, { useState } from 'react';
import { ArrowLeft, FileUp, User, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CertificateUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    participante: '',
    evento: '',
    dataEmissao: new Date().toISOString().split('T')[0],
    cargaHoraria: '',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Certificado Registrado!</h2>
          <p className="text-gray-600 mt-2">O documento foi enviado e vinculado ao perfil do participante.</p>
        </div>
        <button 
          onClick={() => navigate('/gestor/painel')}
          className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subir Certificado</h1>
          <p className="text-gray-600">Registre manualmente um certificado externo ou digitalizado.</p>
        </div>
      </header>

      <form onSubmit={handleUpload} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" />
                Nome do Participante
              </label>
              <input 
                required
                type="text" 
                placeholder="Ex: Maria Silva"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.participante}
                onChange={e => setFormData({...formData, participante: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Evento / Atividade
              </label>
              <input 
                required
                type="text" 
                placeholder="Ex: Semana de Tecnologia 2026"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.evento}
                onChange={e => setFormData({...formData, evento: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Data de Emissão
              </label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.dataEmissao}
                onChange={e => setFormData({...formData, dataEmissao: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Carga Horária (Horas)
              </label>
              <input 
                required
                type="number" 
                placeholder="Ex: 20"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={formData.cargaHoraria}
                onChange={e => setFormData({...formData, cargaHoraria: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <FileUp className="w-4 h-4 text-indigo-500" />
              Arquivo do Certificado (PDF ou Imagem)
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-8 text-center hover:border-indigo-300 transition-colors cursor-pointer relative">
              <input 
                required
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept=".pdf,image/*"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
              <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileUp className="w-6 h-6 text-indigo-600" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                {file ? file.name : 'Clique para selecionar o arquivo'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tamanho máximo: 10MB</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isUploading}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            isUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
              Subindo Arquivo...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-6 h-6" />
              Registrar Certificado
            </>
          )}
        </button>
      </form>
    </div>
  );
}
