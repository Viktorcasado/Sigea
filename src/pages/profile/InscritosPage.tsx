"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Search } from 'lucide-react';

export default function InscritosPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/perfil" className="flex items-center text-gray-600 hover:text-gray-900 font-semibold mb-6">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Voltar para o Perfil
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lista de Inscritos</h1>
        <p className="text-gray-500 mt-1">Gerencie os participantes dos seus eventos</p>
      </header>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Selecione um evento</h2>
        <p className="text-gray-500 mt-2">Para ver a lista de inscritos, acesse a gestão de um evento específico em "Meus Eventos".</p>
        <Link to="/perfil/meus-eventos" className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl">
          Ir para Meus Eventos
        </Link>
      </div>
    </div>
  );
}