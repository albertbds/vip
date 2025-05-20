import React, { useState } from 'react';
import { UserCheck, AlertCircle } from 'lucide-react';

export function CpfConsult() {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    nome?: string;
    dataNascimento?: string;
    situacao?: string;
  } | null>(null);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setCpf(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cpf.length !== 14) {
      setError('CPF inválido. Digite um CPF completo.');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Note: This is a mock response since we can't actually call the Receita Federal API
      // In a real application, you would make an actual API call here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      // Simulate a response
      setData({
        nome: 'Nome não disponível via API',
        dataNascimento: 'Data não disponível',
        situacao: 'Consulte no site da Receita Federal'
      });
    } catch (err) {
      setError('Erro ao consultar CPF. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <UserCheck className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Consulta de CPF</h2>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8">
          <div className="mb-4">
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              value={cpf}
              onChange={handleCPFChange}
              maxLength={14}
              placeholder="000.000.000-00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading || cpf.length !== 14}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              loading || cpf.length !== 14
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Consultando...' : 'Consultar CPF'}
          </button>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {data && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resultado da Consulta</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nome</label>
                <p className="text-gray-900">{data.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Data de Nascimento</label>
                <p className="text-gray-900">{data.dataNascimento}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Situação Cadastral</label>
                <p className="text-gray-900">{data.situacao}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Informações importantes</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• A consulta é gratuita</li>
              <li>• Tenha em mãos o número do seu CPF</li>
              <li>• O serviço é oferecido pela Receita Federal do Brasil</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Dicas</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Mantenha seus dados sempre atualizados</li>
              <li>• Verifique a situação do seu CPF regularmente</li>
              <li>• Em caso de irregularidades, procure uma unidade da Receita Federal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}