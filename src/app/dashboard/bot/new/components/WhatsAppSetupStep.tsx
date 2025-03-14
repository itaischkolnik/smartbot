import React from 'react';

export interface WhatsAppSetupStepProps {
  formData: {
    whatsappNumber: string;
    greenApiInstanceId: string;
    greenApiToken: string;
    [key: string]: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function WhatsAppSetupStep({ formData, onInputChange }: WhatsAppSetupStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-2">
          WhatsApp Number
        </label>
        <input
          type="text"
          id="whatsappNumber"
          value={formData.whatsappNumber}
          onChange={(e) => onInputChange('whatsappNumber', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your WhatsApp number"
        />
      </div>

      <div>
        <label htmlFor="greenApiInstanceId" className="block text-sm font-medium mb-2">
          GreenAPI Instance ID
        </label>
        <input
          type="text"
          id="greenApiInstanceId"
          value={formData.greenApiInstanceId}
          onChange={(e) => onInputChange('greenApiInstanceId', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your GreenAPI Instance ID"
        />
      </div>

      <div>
        <label htmlFor="greenApiToken" className="block text-sm font-medium mb-2">
          GreenAPI Token
        </label>
        <input
          type="password"
          id="greenApiToken"
          value={formData.greenApiToken}
          onChange={(e) => onInputChange('greenApiToken', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your GreenAPI Token"
        />
      </div>
    </div>
  );
} 