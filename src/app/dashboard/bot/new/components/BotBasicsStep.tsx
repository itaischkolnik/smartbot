import React from 'react';

export interface BotBasicsStepProps {
  formData: {
    botName: string;
    [key: string]: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function BotBasicsStep({ formData, onInputChange }: BotBasicsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="botName" className="block text-sm font-medium mb-2">
          Bot Name
        </label>
        <input
          type="text"
          id="botName"
          value={formData.botName}
          onChange={(e) => onInputChange('botName', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter a name for your bot"
        />
      </div>
    </div>
  );
} 