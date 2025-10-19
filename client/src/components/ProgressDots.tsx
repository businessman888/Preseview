import React from 'react';

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ProgressDots({ currentStep, totalSteps, className = '' }: ProgressDotsProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div
            key={stepNumber}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-black dark:bg-white'
                : 'bg-gray-300 dark:bg-gray-600'
            } ${
              isCurrent ? 'scale-110' : ''
            }`}
            data-testid={`progress-dot-${stepNumber}`}
          />
        );
      })}
    </div>
  );
}
