import React from 'react';
import { motion } from 'framer-motion';

interface BotBehaviorStepProps {
  language: string;
  objective: string;
  greeting: string;
  questions: string;
  tone: string;
  instructions: string;
  onChange: (field: string, value: string) => void;
}

export default function BotBehaviorStep({
  language,
  objective,
  greeting,
  questions,
  tone,
  instructions,
  onChange,
}: BotBehaviorStepProps) {
  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'casual', label: 'Casual' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'ar', label: 'Arabic' },
    { value: 'hi', label: 'Hindi' },
    { value: 'bn', label: 'Bengali' },
    { value: 'nl', label: 'Dutch' },
    { value: 'tr', label: 'Turkish' },
    { value: 'pl', label: 'Polish' },
    { value: 'sv', label: 'Swedish' },
    { value: 'fi', label: 'Finnish' },
    { value: 'no', label: 'Norwegian' },
    { value: 'da', label: 'Danish' },
    { value: 'cs', label: 'Czech' },
    { value: 'el', label: 'Greek' },
    { value: 'he', label: 'Hebrew' },
    { value: 'th', label: 'Thai' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'id', label: 'Indonesian' },
    { value: 'ms', label: 'Malay' },
    { value: 'fa', label: 'Persian' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'ro', label: 'Romanian' },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Bot Behavior
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400"
        >
          Configure how your bot will interact with users
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
            Primary Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => onChange('language', e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="objective" className="block text-sm font-medium text-gray-300 mb-2">
            Bot's Objective
          </label>
          <textarea
            id="objective"
            value={objective}
            onChange={(e) => onChange('objective', e.target.value)}
            rows={3}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="What is the main purpose of this bot?"
          />
        </div>

        <div>
          <label htmlFor="greeting" className="block text-sm font-medium text-gray-300 mb-2">
            Greeting Message
          </label>
          <textarea
            id="greeting"
            value={greeting}
            onChange={(e) => onChange('greeting', e.target.value)}
            rows={3}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="How should the bot greet users?"
          />
        </div>

        <div>
          <label htmlFor="questions" className="block text-sm font-medium text-gray-300 mb-2">
            Initial Questions
          </label>
          <textarea
            id="questions"
            value={questions}
            onChange={(e) => onChange('questions', e.target.value)}
            rows={3}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="What questions should the bot ask initially? (one per line)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Conversation Tone
          </label>
          <div className="space-y-2">
            {toneOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={option.value}
                  name="tone"
                  value={option.value}
                  checked={tone === option.value}
                  onChange={(e) => onChange('tone', e.target.value)}
                  className="text-green-500 focus:ring-green-500"
                />
                <label htmlFor={option.value} className="text-white">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-300 mb-2">
            Custom Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => onChange('instructions', e.target.value)}
            rows={3}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="Any additional instructions for the bot?"
          />
        </div>
      </motion.div>
    </div>
  );
} 