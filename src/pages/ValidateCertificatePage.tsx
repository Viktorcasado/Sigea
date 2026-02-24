"use client";

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, XCircle, QrCode, Loader2 } from 'lucide-react';
import { CertificateRepository } from '@/src/repositories/CertificateRepository';
import { Certificate, Event } from '@/src/types';

interface ValidationResult {
  certificate: Certificate;
  event: Event;
}

export default function ValidateCertificatePage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('codigo') || '');
  const [validationStatus, setValidationStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [result, setResult] = useState<ValidationResult | null>(null);

  useEffect(() => {
    if (searchParams.get('codigo')) {
      handleValidation();
    }
  }, []);

  const handleValidation = async () => {
    if (!code.trim()) return;

    setValidationStatus('loading');
    setResult(null);

    try {
      const data = await CertificateRepository.validate(code.trim());
      if (data) {
        setResult(data);
        setValidationStatus('valid');
      } else {
        setValidationStatus('invalid');
      }
    } catch (error) {
      console.error(error);
      setValidationStatus('invalid');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
        <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar ao Início
        </Link>

        <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900">Validação de Certificado</h1>
            <p className="text-gray-500 mt-1">Insira o código para verificar a autenticidade.</p>

            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: SIGEA-0001-26"
                    className="flex-grow px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <button 
                    onClick={handleValidation}
                    disabled={validationStatus === 'loading'}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                >
                    {validationStatus === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Validar
                </button>
            </div>
        </div>

        {validationStatus === 'valid' && result && (
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-lg font-bold text-green-800">Certificado Válido</h2>
                </div>
                <div className="mt-4 pl-9 text-gray-700 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Evento</p>
                      <p className="font-semibold">{result.event.titulo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Instituição / Campus</p>
                      <p>{result.event.instituicao} - {result.event.campus}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Carga Horária</p>
                        <p>{Math.floor(result.certificate.carga_horaria_minutos / 60)}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Data de Emissão</p>
                        <p>{new Date(result.certificate.data_emissao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Código de Autenticidade</p>
                      <p className="font-mono text-sm bg-white/50 p-1 rounded border border-green-100 inline-block">{result.certificate.codigo_validacao}</p>
                    </div>
                </div>
            </div>
        )}

        {validationStatus === 'invalid' && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                    <XCircle className="w-6 h-6 text-red-600 mr-3" />
                    <h2 className="text-lg font-bold text-red-800">Certificado Não Encontrado</h2>
                </div>
                <p className="mt-2 pl-9 text-red-700">O código inserido não corresponde a nenhum certificado em nosso sistema ou é inválido. Verifique o código e tente novamente.</p>
            </div>
        )}
    </div>
  );
}