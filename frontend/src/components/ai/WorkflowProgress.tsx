'use client';

import { CheckIcon } from '@heroicons/react/24/outline';

interface Step {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface WorkflowProgressProps {
  steps: Step[];
  currentStep: number;
}

export default function WorkflowProgress({ steps, currentStep }: WorkflowProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-xs text-center max-w-20">
                <div className={`font-medium ${
                  step.id <= currentStep ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step.id < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}