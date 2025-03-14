import { useState, useEffect } from 'react';
import { Database } from '@/lib/database.types';

type Bot = Database['public']['Tables']['chatbots']['Row'];

type BotFormProps = {
  bot: Bot | null;
  onSubmit: (data: Partial<Bot>) => void;
  isEditing: boolean;
};

export default function BotForm({ bot, onSubmit, isEditing }: BotFormProps) {
  const [formData, setFormData] = useState({
    name: bot?.name || '',
    language: bot?.language || 'English',
    prompt: bot?.prompt || '',
  });

  // Sync with bot prop changes
  useEffect(() => {
    if (bot) {
      setFormData({
        name: bot.name,
        language: bot.language,
        prompt: bot.prompt,
      });
    }
  }, [bot]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'language' && isEditing) {
      // Get the current prompt and replace only the language name in the last line
      const promptLines = formData.prompt.split('\n');
      const lastLine = promptLines[promptLines.length - 1];
      const newLastLine = lastLine.replace(/in \w+/, `in ${value}`);
      promptLines[promptLines.length - 1] = newLastLine;
      
      setFormData(prev => ({
        ...prev,
        language: value,
        prompt: promptLines.join('\n')
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-300">
          Language
        </label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-[#1E1E1E] border border-gray-700 text-white shadow-sm focus:border-[#25D366] focus:ring-[#25D366] sm:text-sm"
          disabled={!isEditing}
        >
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Spanish">Spanish</option>
          <option value="Hebrew">Hebrew</option>
        </select>
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
          Prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={8}
          value={formData.prompt}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md bg-[#1E1E1E] border border-gray-700 text-white shadow-sm focus:border-[#25D366] focus:ring-[#25D366] sm:text-sm"
          disabled={!isEditing}
        />
      </div>
    </form>
  );
} 