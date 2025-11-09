import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfigError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral dark:bg-dark-bg p-4 text-center">
      <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-2xl font-bold font-poppins text-dark-text dark:text-white mb-2">
        Erro de Configuração
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
        A aplicação não foi configurada corretamente. As variáveis de ambiente do Supabase estão ausentes.
      </p>
      <div className="mt-6 p-4 bg-white dark:bg-dark-bg/50 rounded-lg shadow-soft text-left">
        <h2 className="text-lg font-semibold mb-2">Como resolver:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Acesse o painel do seu site no serviço de deploy (ex: Netlify).</li>
          <li>Vá para a seção de variáveis de ambiente.</li>
          <li>
            Adicione as seguintes variáveis com os valores do seu projeto Supabase:
            <ul className="list-disc list-inside ml-4 mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <li><code>NEXT_PUBLIC_SUPABASE_URL</code></li>
              <li><code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            </ul>
          </li>
          <li>Salve as alterações e acione um novo deploy.</li>
        </ol>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Consulte o arquivo `README.md` para mais detalhes.
        </p>
      </div>
    </div>
  );
};

export default ConfigError;
