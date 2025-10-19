import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowLeft } from 'lucide-react';

interface SubscriptionPriceStepProps {
  onNext: (data: { subscriptionPrice: number }) => void;
  onBack: () => void;
  onClose: () => void;
  initialData?: { subscriptionPrice?: number };
}

const PRICE_SUGGESTIONS = [
  { value: 9.90, label: 'R$ 9,90' },
  { value: 19.90, label: 'R$ 19,90' },
  { value: 29.90, label: 'R$ 29,90' },
  { value: 49.90, label: 'R$ 49,90' },
  { value: 0, label: 'Gratuito' },
];

export function SubscriptionPriceStep({ onNext, onBack, onClose, initialData }: SubscriptionPriceStepProps) {
  const [subscriptionPrice, setSubscriptionPrice] = useState<string>(
    initialData?.subscriptionPrice?.toString() || '0'
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.,]/g, '');
    
    // Convert to number
    const number = parseFloat(numericValue.replace(',', '.')) || 0;
    
    // Format as currency
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubscriptionPrice(value);
    
    // Clear errors when user types
    if (errors.subscriptionPrice) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.subscriptionPrice;
        return newErrors;
      });
    }
  };

  const handleSuggestionClick = (price: number) => {
    setSubscriptionPrice(price.toString());
    
    // Clear errors
    if (errors.subscriptionPrice) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.subscriptionPrice;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const price = parseFloat(subscriptionPrice);

    if (isNaN(price) || price < 0) {
      newErrors.subscriptionPrice = 'Preço deve ser um número válido maior ou igual a 0';
    } else if (price > 999.99) {
      newErrors.subscriptionPrice = 'Preço máximo é R$ 999,99';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      const price = parseFloat(subscriptionPrice) || 0;
      onNext({ subscriptionPrice: price });
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

          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Preço de assinatura</h1>

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
            Quanto os assinantes vão pagar?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Defina o valor mensal da assinatura para acessar seu conteúdo exclusivo
          </p>
        </div>

        {/* Price Input */}
        <div className="space-y-2 mb-8">
          <Label htmlFor="subscriptionPrice" className="text-lg font-medium">
            Preço mensal (R$)
          </Label>
          <Input
            id="subscriptionPrice"
            type="text"
            value={subscriptionPrice}
            onChange={handlePriceChange}
            placeholder="0,00"
            className={`text-2xl font-bold text-center h-16 ${errors.subscriptionPrice ? 'border-red-500' : ''}`}
            data-testid="input-subscription-price"
          />
          {errors.subscriptionPrice && (
            <p className="text-sm text-red-500 text-center">{errors.subscriptionPrice}</p>
          )}
        </div>

        {/* Price Suggestions */}
        <div className="mb-8">
          <Label className="text-lg font-medium mb-4 block">Sugestões</Label>
          <div className="grid grid-cols-2 gap-3">
            {PRICE_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.value}
                onClick={() => handleSuggestionClick(suggestion.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  parseFloat(subscriptionPrice) === suggestion.value
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white'
                }`}
                data-testid={`price-suggestion-${suggestion.value}`}
              >
                <span className="font-semibold">{suggestion.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 Você pode alterar o preço depois nas configurações do seu perfil
          </p>
        </div>

        {/* Continue Button */}
        <div className="mt-auto">
          <Button
            onClick={handleContinue}
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
