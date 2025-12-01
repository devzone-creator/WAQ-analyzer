import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  completedSteps: number[];
  onStepClick?: (step: number) => void;
  stepErrors?: Record<number, boolean>;
}

const STEP_LABELS = [
  { number: 1, title: 'Notability Check', subtitle: 'Verify GNG with 3+ sources' },
  { number: 2, title: 'Lead & Infobox', subtitle: 'Draft article definition' },
  { number: 3, title: 'Citation Structure', subtitle: 'Add references' },
  { number: 4, title: 'Content & NPOV', subtitle: 'Check neutrality' },
  { number: 5, title: 'Review & Metadata', subtitle: 'Policy compliance' },
  { number: 6, title: 'Final Submission', subtitle: 'Submit to Wikipedia' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  stepErrors = {}
}) => {
  // completedSteps is an array of numbers (canonical type)
  return (
    <div className="w-full">
      {/* Desktop view - horizontal */}
      <div className="hidden md:flex items-center justify-between mb-8">
        {STEP_LABELS.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const hasError = stepErrors[step.number];

          return (
            <div key={step.number} className="flex flex-col items-center flex-1">
              {/* Step circle */}
              <button
                onClick={() => onStepClick?.(step.number)}
                disabled={!isCompleted && !isCurrent}
                className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 mb-2
                  ${
                    isCurrent
                      ? 'ring-4 ring-blue-300 bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : hasError
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                  }
                  ${!isCompleted && !isCurrent ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}
                `}
              >
                {hasError ? (
                  <AlertCircle className="w-6 h-6" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-sm">{step.number}</span>
                )}
              </button>

              {/* Step label */}
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-900">{step.title}</p>
                <p className="text-xs text-gray-600">{step.subtitle}</p>
              </div>

              {/* Connector line */}
              {step.number < 6 && (
                <div
                  className={`
                    absolute top-6 left-[calc(50%+24px)] w-[calc(100%-48px-2rem)] h-1
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile view - vertical */}
      <div className="md:hidden space-y-3 mb-6">
        {STEP_LABELS.map((step) => {
          const isCompleted = completedSteps.includes(step.number);
          const isCurrent = currentStep === step.number;
          const hasError = stepErrors[step.number];

          return (
            <button
              key={step.number}
              onClick={() => onStepClick?.(step.number)}
              disabled={!isCompleted && !isCurrent}
              className={`
                w-full p-4 rounded-lg flex items-start gap-3 transition-all
                ${
                  isCurrent
                    ? 'ring-2 ring-blue-600 bg-blue-50 border-blue-600'
                    : isCompleted
                      ? 'bg-green-50 border-green-500'
                      : hasError
                        ? 'bg-red-50 border-red-500'
                        : 'bg-gray-50 border-gray-300'
                }
                border-2
              `}
            >
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : hasError
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {hasError ? (
                  <AlertCircle className="w-5 h-5" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-bold text-xs">{step.number}</span>
                )}
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="text-sm text-gray-600">{step.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
