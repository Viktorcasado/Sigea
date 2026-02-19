"use client";

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, XCircle, QrCode, ShieldCheck, Calendar, Clock, Building } from 'lucide-react';
import { CertificateRepository } from '@/src/repositories/CertificateRepository';
import { Certificate, Event } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';

export default function ValidateCertificatePage() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('codigo') || '');
  const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
  const [result, setResult] = useState<{ certificate: Certificate; event: Event } | null>(null);

  const handleValidation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;

    setStatus('loading');
    
    // Simula um pequeno delay de rede
    setTimeout(async () => {
      const data = await CertificateRepository.validate(code);
      if (data) {
        setResult(data);
        setStatus('valid');
      } else {
        setResult(null);
        setStatus('invalid');
      }
    }, 800);
  };

  useEffect(() => {
    if (searchParams.get('codigo')) {
      handleValidation();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-600 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Link>
          <div className="flex items-center gap-2 text-indigo-600">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-bold tracking-tight">SIGEA VALIDATOR</span>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
        >
          <h1 className="text-3xl font-black text-gray-900 mb-2">Validar Certificado</h1>
          <p className="text-gray-500 mb-8">Verifique a autenticidade de documentos emitidos pelo sistema.</p>

          <form onSubmit={handleValidation} className="space-y-4">
            <div className="relative">
              <input 
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex: SIGEA-0001-24"
                className="w-full pl-4 pr-12 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-mono text-lg uppercase placeholder:normal-case"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
              >
                {status === 'loading' ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 font-semibold hover:text-gray-700 transition-colors"
            >
              <QrCode className="w-5 h-5" />
              Escanear QR Code
            </button>
          </form>

          <AnimatePresence mode="wait">
            {status === 'valid' && result && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-gray-100"
              >
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-green-500 p-2 rounded-full">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-green-900">Documento Autêntico</h2>
                      <p className="text-green-700 text-sm">Este certificado é válido e foi emitido pelo SIGEA.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-black text-green-800/50 uppercase">Evento</p>
                      <p className="font-bold text-green-900">{result.event.titulo}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-green-800/50 uppercase">Instituição</p>
                      <div className="flex items-center gap-2 text-green-900 font-semibold">
                        <Building className="w-4 h-4" />
                        {result.event.instituicao} - {result.event.campus}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-green-800/50 uppercase">Carga Horária</p>
                      <div className="flex items-center gap-2 text-green-900 font-semibold">
                        <Clock className="w-4 h-4" />
                        {result.certificate.cargaHoraria} horas
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-green-800/50 uppercase">Data de Emissão</p>
                      <div className="flex items-center gap-2 text-green-900 font-semibold">
                        <Calendar className="w-4 h-4" />
                        {result.certificate.dataEmissao.toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {status === 'invalid' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-gray-100"
              >
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex items-start gap-4">
                  <div className="bg-red-500 p-2 rounded-full shrink-0">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-900">Certificado Inválido</h2>
                    <p className="text-red-700 mt-1">Não encontramos nenhum registro com o código informado. Verifique se houve erro de digitação.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-8 text-center text-gray-400 text-sm">
          Dúvidas sobre a autenticidade? Entre em contato com a coordenação do evento.
        </p>
      </div>
    </div>
  );
}