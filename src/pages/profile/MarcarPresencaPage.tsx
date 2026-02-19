"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, ListChecks } from 'lucide-react';

export default function MarcarPresencaPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <Link to="/perfil" className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar para o Perfil
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marcar Presença</h1>
        <p className="text-gray-500 mt-1">Confirme a participação dos alunos nas atividades</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-indigo-300 transition-colors text-left">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Escanear QR Code</h3>
            <p className="text-sm text-gray-500">Use a câmera para validar o código do participante</p>
          </div>
        </button>

        <button className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-indigo-300 transition-colors text-left">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
            <ListChecks className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Lista de Chamada</h3>
            <p className="text-sm text-gray-500">Marque a presença manualmente pela lista de inscritos</p>
          </div>
        </button>
      </div>
    </div>
  );
}