import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft } from 'lucide-react';

interface GenderStepProps {
  onNext: (data: { gender: string }) => void;
  onBack: () => void;
  onClose: () => void;
  initialData?: { gender?: string };
}

const GENDER_OPTIONS = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'nao-binario', label: 'Não binário' },
  { value: 'outro', label: 'Outro' },
  { value: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
];

export function GenderStep({ onNext, onBack, onClose, initialData }: GenderStepProps) {
  const [selectedGender, setSelectedGender] = useState(initialData?.gender || '');

  const handleContinue = () => {
    if (selectedGender) {
      onNext({ gender: selectedGender });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-600 dark:text-gray-400"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Gênero</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400"
            data-testid="button-close"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Como você se identifica?
          </h2>
        </div>

        {/* Gender Options */}
        <div className="space-y-3 mb-8">
          {GENDER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedGender(option.value)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedGender === option.value
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white'
              }`}
              data-testid={`gender-option-${option.value}`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="mt-auto">
          <Button
            onClick={handleContinue}
            disabled={!selectedGender}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0"
            data-testid="button-continue"
          >
            Continuar
          </Button>
        </div>
      </main>
    </div>
  );
}
