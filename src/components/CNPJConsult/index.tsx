import React, { useState } from 'react';
import { Store } from 'lucide-react';

interface CNPJData {
  razao_social: string;
  estabelecimento?: {
    logradouro?: string;
    numero?: string;
    email?: string;
    telefone?: string;
    data_inicio_atividade?: string;
    situacao_cadastral?: string;
  };
}

export function CNPJConsult() {
  const [cnpj, setCnpj] = useState('');
  const [data, setData] = useState<CNPJData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatCNPJ = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as CNPJ: XX.XXX.XXX/XXXX-XX
    return numbers.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, 
      '$1.$2.$3/$4-$5'
    );
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const fetchCNPJ = async () => {
    if (!cnpj) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Remove all non-numeric characters for the API call
      const cleanCNPJ = cnpj.replace(/\D/g, '');
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cleanCNPJ}`);
      if (!response.ok) throw new Error('CNPJ não encontrado');
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao consultar CNPJ');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-lg p-6 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <Store className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Consulta CNPJ</h2>
      </div>

      <div className="flex gap-4 mb-6 max-w-xl">
        <input
          type="text"
          placeholder="Digite o CNPJ"
          value={cnpj}
          onChange={handleCNPJChange}
          maxLength={18}
          className="w-64 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchCNPJ}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 text-sm"
        >
          {isLoading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-4 text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Razão Social</h3>
              <p>{data.razao_social}</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Endereço</h3>
              <p>
                {data.estabelecimento?.logradouro}
                {data.estabelecimento?.numero && `, ${data.estabelecimento.numero}`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Email</h3>
              <p>{data.estabelecimento?.email || 'Não informado'}</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Telefone</h3>
              <p>{data.estabelecimento?.telefone || 'Não informado'}</p>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 text-white">Situação Cadastral</h3>
              <p>{data.estabelecimento?.situacao_cadastral || 'Não informado'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}