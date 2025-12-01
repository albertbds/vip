import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { Territory } from './types';
import { findTerritoryByCity } from './data';
import { SplineSceneBasic } from './components/SplineSceneBasic';
import { AppList } from './components/AppList';
import { StreamingContent } from './components/StreamingContent';
import { Condominiums } from './components/Condominiums';
import { PlansDetailModal } from './components/PlansDetailModal';
import { FAQ } from './components/FAQ';
import { CepGeral } from './components/CepGeral';
import {
  Home, Search, Smartphone, HelpCircle, MapPin
} from 'lucide-react';
import { useSearch } from './contexts/SearchContext';

function App() {
  const isSystemDisabled = true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Disabled Message */}
      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-2xl border border-red-500/50 mb-6">
            <div className="text-5xl">⚠</div>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white">Sistema Desativado</h1>

          <p className="text-xl text-gray-300 max-w-md mx-auto">
            O sistema não está mais disponível no momento.
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl p-6 sm:p-8 border border-red-500/30 max-w-md mx-auto">
          <p className="text-gray-200 text-sm sm:text-base">
            Para mais informações ou suporte, entre em contato conosco através dos nossos canais de atendimento.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://beacons.ai/gigamaisempresas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-medium"
          >
            Portal Empresarial
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;