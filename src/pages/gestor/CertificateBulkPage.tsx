import React, { useState } from 'react';
import { ArrowLeft, Upload, Send, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CertificateBulkPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'success'>('idle');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartDisparo = () => {
    if (!file) return;
    
    setStatus('processing');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('success');
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disparo em Massa</h1>
          <p className="text-gray-600">Gere e envie certificados para múltiplos participantes de uma vez.</p>
        </div>
      </header>

      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        {status === 'idle' && (
          <div className="space-y-8">
            <div className="border-2 border-dashed border-gray-200 rounded-[24px] p-12 text-center hover:border-indigo-300 transition-colors cursor-pointer group">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".csv,.xlsx" 
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {file ? file.name : 'Clique para subir sua lista'}
                </h3>
                <p className="text-gray-500 mt-2">Arraste ou selecione um arquivo CSV ou Excel</p>
                <p className="text-xs text-gray-400 mt-4">Formato sugerido: Nome, Email, CPF, Carga Horária</p>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 rounded-[24px]">
                <h4 className="font-semibold text-gray-800 mb-2">1. Prepare sua lista</h4>
                <p className="text-sm text-gray-600">Certifique-se de que as colunas estão bem definidas para o mapeamento automático.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-[24px]">
                <h4 className="font-semibold text-gray-800 mb-2">2. Escolha o modelo</h4>
                <p className="text-sm text-gray-600">O sistema usará o modelo padrão da instituição com os dados da sua lista.</p>
              </div>
            </div>

            <button 
              disabled={!file}
              onClick={handleStartDisparo}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                file ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-6 h-6" />
              Iniciar Disparo de Certificados
            </button>
          </div>
        )}

        {status === 'processing' && (
          <div className="py-12 text-center space-y-6">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  strokeDasharray="100, 100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-600 transition-all duration-300"
                  strokeDasharray={`${progress}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-600">
                {progress}%
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Processando Certificados</h3>
              <p className="text-gray-500 mt-2">Gerando documentos e enviando para os e-mails...</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="py-12 text-center space-y-8">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Disparo Concluído!</h3>
              <p className="text-gray-600 mt-2">142 certificados foram gerados e enviados com sucesso.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setStatus('idle')}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-colors"
              >
                Novo Disparo
              </button>
              <button 
                onClick={() => navigate('/gestor/relatorios')}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Ver Relatório
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-[24px] p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
        <div>
          <h4 className="font-bold text-amber-900">Importante</h4>
          <p className="text-sm text-amber-800 mt-1">
            O disparo em massa consome créditos de e-mail da sua instituição. 
            Verifique se você tem saldo suficiente antes de iniciar processos com mais de 500 destinatários.
          </p>
        </div>
      </div>
    </div>
  );
}
