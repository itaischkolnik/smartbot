import React from 'react';

export interface BotBehaviorStepProps {
  formData: {
    language: string;
    objective: string;
    tone: string;
    [key: string]: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function BotBehaviorStep({ formData, onInputChange }: BotBehaviorStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="language" className="block text-sm font-medium mb-2">
          Language
        </label>
        <select
          id="language"
          value={formData.language}
          onChange={(e) => onInputChange('language', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
        >
          <option value="">Select a language</option>
          <option value="af">Afrikaans</option>
          <option value="ar">Arabic</option>
          <option value="bg">Bulgarian</option>
          <option value="bn">Bengali</option>
          <option value="ca">Catalan</option>
          <option value="cs">Czech</option>
          <option value="da">Danish</option>
          <option value="de">German</option>
          <option value="el">Greek</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="et">Estonian</option>
          <option value="fa">Persian</option>
          <option value="fi">Finnish</option>
          <option value="fr">French</option>
          <option value="he">Hebrew</option>
          <option value="hi">Hindi</option>
          <option value="hr">Croatian</option>
          <option value="hu">Hungarian</option>
          <option value="id">Indonesian</option>
          <option value="it">Italian</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="lt">Lithuanian</option>
          <option value="lv">Latvian</option>
          <option value="ms">Malay</option>
          <option value="nl">Dutch</option>
          <option value="no">Norwegian</option>
          <option value="pl">Polish</option>
          <option value="pt">Portuguese</option>
          <option value="ro">Romanian</option>
          <option value="ru">Russian</option>
          <option value="sk">Slovak</option>
          <option value="sl">Slovenian</option>
          <option value="sq">Albanian</option>
          <option value="sr">Serbian</option>
          <option value="sv">Swedish</option>
          <option value="th">Thai</option>
          <option value="tr">Turkish</option>
          <option value="uk">Ukrainian</option>
          <option value="ur">Urdu</option>
          <option value="vi">Vietnamese</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      <div>
        <label htmlFor="objective" className="block text-sm font-medium mb-2">
          Objective
        </label>
        <textarea
          id="objective"
          value={formData.objective}
          onChange={(e) => onInputChange('objective', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px] text-white placeholder-gray-400"
          placeholder="Enter the bot's objective..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">
          Conversation Tone
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
            <input
              type="radio"
              name="tone"
              value="professional"
              checked={formData.tone === 'professional'}
              onChange={(e) => onInputChange('tone', e.target.value)}
              className="w-4 h-4 text-blue-500 border-gray-700 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm">Professional</span>
          </label>
          <label className="flex items-center p-4 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
            <input
              type="radio"
              name="tone"
              value="friendly"
              checked={formData.tone === 'friendly'}
              onChange={(e) => onInputChange('tone', e.target.value)}
              className="w-4 h-4 text-blue-500 border-gray-700 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm">Friendly</span>
          </label>
        </div>
      </div>
    </div>
  );
} 