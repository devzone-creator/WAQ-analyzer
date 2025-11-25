import React, { useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { WACWizardManager } from '../services/wacWizardManager';
import { WACWizardState } from '../types/waca';
import { StepIndicator } from './WizardStepIndicator';
import { Step1NotabilityCheck } from './Step1NotabilityCheck';
import { Step4ContentNPOV } from './Step4ContentNPOV';

interface WACWizardProps {
  onSubmit?: (wikitext: string) => void;
}

export const WACWizard: React.FC<WACWizardProps> = () => {
  const [articleTitle, setArticleTitle] = useState('');
  const [manager, setManager] = useState<WACWizardManager | null>(null);
  const [state, setState] = useState<WACWizardState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({});

  // Initialize wizard
  const initializeWizard = useCallback(() => {
    if (!articleTitle.trim()) {
      alert('Please enter an article title');
      return;
    }

    const newManager = new WACWizardManager(articleTitle);
    setManager(newManager);
    setState(newManager.getState());
  }, [articleTitle]);

  // Handle step update
  const handleStepUpdate = useCallback(
    async (stepData: any) => {
      if (!manager) return;

      try {
        const currentStep = state?.currentStep || 1;

        if (currentStep === 1) {
          await manager.updateStep1(stepData);
        } else if (currentStep === 2) {
          manager.updateStep2(stepData.leadText, stepData.infoboxWikitext);
        } else if (currentStep === 3) {
          manager.updateStep3(stepData.wikitext);
        } else if (currentStep === 4) {
          manager.updateStep4(stepData.bodyContent);
        } else if (currentStep === 5) {
          manager.updateStep5(
            stepData.checklist,
            stepData.coi,
            stepData.categories
          );
        } else if (currentStep === 6) {
          // Step 6 submission handled in step validation
        }

        setState(manager.getState());
      } catch (error) {
        console.error('Error updating step:', error);
        alert('Error updating step. Please try again.');
      }
    },
    [manager, state?.currentStep]
  );

  // Handle next step
  const handleNext = useCallback(async () => {
    if (!manager) return;

    setIsLoading(true);
    try {
      const result = await manager.nextStep();

      if (result.success) {
        setStepErrors({});
        setState(manager.getState());
      } else {
        const newErrors: Record<number, boolean> = {};
        newErrors[manager.getState().currentStep] = true;
        setStepErrors(newErrors);
        alert(`Cannot proceed: ${result.validation.errors.join('\n')}`);
      }
    } catch (error) {
      console.error('Error moving to next step:', error);
      alert('Error moving to next step. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [manager]);

  // Handle previous step
  const handlePrevious = useCallback(() => {
    if (!manager) return;

    if (manager.previousStep()) {
      setState(manager.getState());
    }
  }, [manager]);

  if (!manager || !state) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Wikipedia Article Creation Assistant
          </h2>
          <p className="text-blue-800 mb-6">
            Create policy-compliant Wikipedia article drafts with guided 6-step wizard
          </p>

          <div className="max-w-md mx-auto">
            <label className="block text-left font-semibold text-blue-900 mb-2">
              Article Title
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Albert Einstein, Climate Change, etc."
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && initializeWizard()}
                className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={initializeWizard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-blue-600 text-white py-6 mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">WACA - Wikipedia Article Creation Assistant</h1>
          <p className="text-blue-100">
            Creating: <span className="font-semibold">{state.articleTitle}</span>
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={state.currentStep}
          completedSteps={state.completedSteps}
          stepErrors={stepErrors}
        />

        {/* Step Content */}
        <div className="bg-white rounded-lg border border-gray-300 p-8 mb-8">
          {state.currentStep === 1 && (
            <Step1NotabilityCheck
              data={state.step1}
              onUpdate={handleStepUpdate}
              onNext={handleNext}
              isLoading={isLoading}
            />
          )}

          {state.currentStep === 2 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Step 2: Lead & Infobox - Coming Soon</p>
            </div>
          )}

          {state.currentStep === 3 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Step 3: Citation Structure - Coming Soon</p>
            </div>
          )}

          {state.currentStep === 4 && (
            <Step4ContentNPOV
              data={state.step4}
              onUpdate={handleStepUpdate}
              onNext={handleNext}
              isLoading={isLoading}
            />
          )}

          {state.currentStep === 5 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Step 5: Review & Metadata - Coming Soon</p>
            </div>
          )}

          {state.currentStep === 6 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Step 6: Final Submission - Coming Soon</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={handlePrevious}
            disabled={state.currentStep === 1 || isLoading}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex-1" />

          <p className="flex items-center text-gray-600 font-medium">
            Step {state.currentStep} of 6
          </p>
        </div>
      </div>
    </div>
  );
};
