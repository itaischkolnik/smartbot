import React from 'react';
import { motion } from 'framer-motion';

interface WhatsAppSetupStepProps {
  whatsappNumber: string;
  instanceId: string;
  apiToken: string;
  onChange: (field: string, value: string) => void;
}

export default function WhatsAppSetupStep({
  whatsappNumber,
  instanceId,
  apiToken,
  onChange,
}: WhatsAppSetupStepProps) {
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
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          WhatsApp Integration
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400"
        >
          Connect your bot to WhatsApp using GreenAPI
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-300 mb-2">
            WhatsApp Number
          </label>
          <input
            type="text"
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => onChange('whatsappNumber', e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="+1234567890"
          />
          <p className="mt-2 text-sm text-gray-400">
            Enter the WhatsApp number in international format
          </p>
        </div>

        <div>
          <label htmlFor="instanceId" className="block text-sm font-medium text-gray-300 mb-2">
            GreenAPI Instance ID
          </label>
          <input
            type="text"
            id="instanceId"
            value={instanceId}
            onChange={(e) => onChange('instanceId', e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="Enter your GreenAPI instance ID"
          />
        </div>

        <div>
          <label htmlFor="apiToken" className="block text-sm font-medium text-gray-300 mb-2">
            GreenAPI Token
          </label>
          <input
            type="password"
            id="apiToken"
            value={apiToken}
            onChange={(e) => onChange('apiToken', e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="Enter your GreenAPI token"
          />
        </div>
      </motion.div>
    </div>
  );
} 