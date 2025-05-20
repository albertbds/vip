import React from 'react';
import { BrainCircuit } from 'lucide-react';

export function ChatGPTIntegration() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <BrainCircuit className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">ChatGPT</h2>
        </div>

        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://chat.openai.com"
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '600px' }}
            title="ChatGPT Integration"
          />
        </div>
      </div>
    </div>
  );
}