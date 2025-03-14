import React from 'react';
import { motion } from 'framer-motion';

export interface ProgressIndicatorProps {
  steps: { title: string; completed: boolean; }[];
  currentStep: number;
  direction: number;
}

export default function ProgressIndicator({ steps, currentStep, direction }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-3 ${
            currentStep === index ? 'text-white' : 'text-gray-400'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed
                ? 'bg-green-500'
                : currentStep === index
                ? 'bg-blue-500'
                : 'bg-gray-700'
            }`}
          >
            {step.completed ? (
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span className="text-sm font-medium">{step.title}</span>
        </motion.div>
      ))}
    </div>
  );
} 