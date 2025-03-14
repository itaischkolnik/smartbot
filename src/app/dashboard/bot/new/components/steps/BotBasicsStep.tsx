import React from 'react';
import { motion } from 'framer-motion';

interface BotBasicsStepProps {
  botName: string;
  onChange: (value: string) => void;
}

export default function BotBasicsStep({ botName, onChange }: BotBasicsStepProps) {
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
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Let's Create Your Bot
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400"
        >
          First, give your bot a name that reflects its purpose
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <label htmlFor="botName" className="block text-sm font-medium text-gray-300 mb-2">
          Bot Name
        </label>
        <input
          type="text"
          id="botName"
          value={botName}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
          placeholder="Enter a name for your bot"
          autoFocus
        />
        <p className="mt-2 text-sm text-gray-400">
          Choose a name that your users will recognize and remember
        </p>
      </motion.div>
    </div>
  );
} 