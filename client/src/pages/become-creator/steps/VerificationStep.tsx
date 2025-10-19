import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, ArrowLeft, FileText, Camera, Info } from 'lucide-react';

interface VerificationStepProps {
  onNext: (data: { verificationStatus: string; verificationSkipped: boolean }) => void;
  onBack: () => void;
  onClose: () => void;
  initialData?: { verificationStatus?: string; verificationSkipped?: boolean };
}

const VERIFICATION_STEPS = [
  {
    id: 'document',
    icon: FileText,
    title: 'Verificação de documento',
    description: 'Garante que não há reflexos no teu rosto nem no documento.',
  },
  {
    id: 'selfie',
    icon: Camera,
    title: 'Selfie - verificação de liveness',
    description: 'Garante que nada obstrua a verificação da sua foto.',
  },
  {
    id: 'mobile',
    icon: Info,
    title: 'Para melhores resultados usa o celular',
    description: 'Para melhores resultados usa o celular.',
  },
];

export function VerificationStep({ onNext, onBack, onClose, initialData }: VerificationStepProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyNow = async () => {
    setIsVerifying(true);
    
    try {
      // Simulate verification process
      // In a real implementation, this would redirect to a third-party service
      // like Stripe Identity, Veriff, etc.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark as pending and continue (verification can be completed later)
      onNext({
        verificationStatus: 'pending',
        verificationSkipped: false,
      });
    } catch (error) {
      console.error('Verification error:', error);
      setIsVerifying(false);
    }
  };

  const handleVerifyLater = () => {
    // Skip verification for now - user can verify later
    onNext({
      verificationStatus: 'pending',
      verificationSkipped: true,
    });
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

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Verificar identidade</h1>

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
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Verifica a tua identidade para levantar ganhos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            A verificação é rápida e permite que você saque os ganhos futuros! Todos os dados estão seguros.
          </p>
        </div>

        {/* What to Expect */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            O que esperar:
          </h3>
          
          <div className="space-y-3">
            {VERIFICATION_STEPS.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.id} className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-white dark:bg-gray-700 p-2 rounded-lg">
                        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-auto space-y-3">
          <Button
            onClick={handleVerifyNow}
            disabled={isVerifying}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white border-0"
            data-testid="button-verify-now"
          >
            {isVerifying ? 'Verificando...' : 'Continuar'}
          </Button>
          
          <Button
            onClick={handleVerifyLater}
            variant="ghost"
            className="w-full text-gray-600 dark:text-gray-400"
            data-testid="button-verify-later"
          >
            Verificar depois
          </Button>
        </div>
      </main>
    </div>
  );
}
