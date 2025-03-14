'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/lib/database.types';
import ProgressIndicator from './components/ProgressIndicator';
import WizardContainer from './components/WizardContainer';
import NavigationButtons from './components/NavigationButtons';
import BotBasicsStep from './components/BotBasicsStep';
import WhatsAppSetupStep from './components/WhatsAppSetupStep';
import CompanyInfoStep from './components/CompanyInfoStep';
import BotBehaviorStep from './components/BotBehaviorStep';

interface FormData {
  botName: string;
  whatsappNumber: string;
  greenApiInstanceId: string;
  greenApiToken: string;
  language: string;
  objective: string;
  tone: string;
  companyName: string;
  [key: string]: string;
}

interface CompanyDetail {
  id: string;
  value: string;
}

const LANGUAGE_NAMES: { [key: string]: string } = {
  af: 'Afrikaans',
  ar: 'Arabic',
  bg: 'Bulgarian',
  bn: 'Bengali',
  ca: 'Catalan',
  cs: 'Czech',
  da: 'Danish',
  de: 'German',
  el: 'Greek',
  en: 'English',
  es: 'Spanish',
  et: 'Estonian',
  fa: 'Persian',
  fi: 'Finnish',
  fr: 'French',
  he: 'Hebrew',
  hi: 'Hindi',
  hr: 'Croatian',
  hu: 'Hungarian',
  id: 'Indonesian',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  lt: 'Lithuanian',
  lv: 'Latvian',
  ms: 'Malay',
  nl: 'Dutch',
  no: 'Norwegian',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  ru: 'Russian',
  sk: 'Slovak',
  sl: 'Slovenian',
  sq: 'Albanian',
  sr: 'Serbian',
  sv: 'Swedish',
  th: 'Thai',
  tr: 'Turkish',
  uk: 'Ukrainian',
  ur: 'Urdu',
  vi: 'Vietnamese',
  zh: 'Chinese'
};

export default function NewBotPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const supabase = createClientComponentClient<Database>();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    botName: '',
    whatsappNumber: '',
    greenApiInstanceId: '',
    greenApiToken: '',
    language: '',
    objective: '',
    tone: 'professional',
    companyName: '',
  });
  const [companyDetails, setCompanyDetails] = useState<CompanyDetail[]>([
    { id: uuidv4(), value: '' },
  ]);

  const steps = [
    { title: 'Basic Info', completed: !!formData.botName },
    {
      title: 'WhatsApp Setup',
      completed: !!(
        formData.whatsappNumber &&
        formData.greenApiInstanceId &&
        formData.greenApiToken
      ),
    },
    {
      title: 'Company Info',
      completed: !!(formData.companyName && companyDetails.some((detail) => detail.value.trim() !== '')),
    },
    {
      title: 'Bot Behavior',
      completed: !!(formData.language && formData.objective && formData.tone),
    },
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCompanyDetail = () => {
    setCompanyDetails((prev) => [...prev, { id: uuidv4(), value: '' }]);
  };

  const handleUpdateCompanyDetail = (id: string, value: string) => {
    setCompanyDetails((prev) =>
      prev.map((detail) => (detail.id === id ? { ...detail, value } : detail))
    );
  };

  const handleRemoveCompanyDetail = (id: string) => {
    setCompanyDetails((prev) => prev.filter((detail) => detail.id !== id));
  };

  const constructPrompt = () => {
    const companyInfo = companyDetails
      .map((detail) => detail.value.trim())
      .filter(Boolean)
      .join('\n');

    const languageName = LANGUAGE_NAMES[formData.language] || formData.language;

    return `You are a ${formData.tone} WhatsApp chatbot for a company with the following information:

${companyInfo}

Your objective is: ${formData.objective}

Please communicate in ${languageName} and maintain a ${formData.tone} tone throughout the conversation.`;
  };

  const validateCurrentStep = () => {
    setError(null);
    
    switch (currentStep) {
      case 0:
        if (!formData.botName.trim()) {
          setError('Please enter a bot name');
          return false;
        }
        break;
      case 1:
        if (!formData.whatsappNumber.trim()) {
          setError('Please enter a WhatsApp number');
          return false;
        }
        if (!formData.greenApiInstanceId.trim()) {
          setError('Please enter a GreenAPI Instance ID');
          return false;
        }
        if (!formData.greenApiToken.trim()) {
          setError('Please enter a GreenAPI Token');
          return false;
        }
        break;
      case 2:
        if (!formData.companyName.trim()) {
          setError('Please enter a company name');
          return false;
        }
        if (!companyDetails.some(detail => detail.value.trim())) {
          setError('Please enter at least one company detail');
          return false;
        }
        break;
      case 3:
        if (!formData.language) {
          setError('Please select a language');
          return false;
        }
        if (!formData.objective.trim()) {
          setError('Please enter the bot\'s objective');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    console.log('handleNext called, currentStep:', currentStep);
    
    if (!validateCurrentStep()) {
      console.log('Validation failed');
      return;
    }

    if (currentStep === steps.length - 1) {
      console.log('Final step, attempting to create bot...');
      setIsLoading(true);
      setError(null);
      
      try {
        if (!session?.user) {
          console.error('No active session');
          setError('Please sign in to create a bot');
          router.push('/auth/login');
          return;
        }

        // First, get the user's Supabase ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single();

        if (userError || !userData) {
          throw new Error('Failed to get user data');
        }

        const prompt = constructPrompt();
        console.log('Constructed prompt:', prompt);

        console.log('Inserting bot data...');
        const { data, error: supabaseError } = await supabase
          .from('chatbots')
          .insert({
            user_id: userData.id, // Use the Supabase user ID
            name: formData.botName,
            company: formData.companyName,
            language: formData.language,
            prompt: prompt,
            whatsapp_number: formData.whatsappNumber,
            greenapi_instance_id: formData.greenApiInstanceId,
          })
          .select();

        if (supabaseError) {
          console.error('Supabase insert error:', supabaseError);
          throw new Error(supabaseError.message);
        }

        console.log('Bot created successfully:', data);
        router.push('/dashboard');
      } catch (error) {
        console.error('Error creating bot:', error);
        setError(error instanceof Error ? error.message : 'Failed to create bot');
      } finally {
        setIsLoading(false);
      }
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="fixed left-8 top-1/2 -translate-y-1/2">
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          direction={direction}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-12 text-center">Create a New SmartBot</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <div className="relative min-h-[400px]">
          {steps.map((step, index) => (
            <WizardContainer
              key={index}
              isActive={currentStep === index}
              direction={direction}
            >
              <div className="space-y-8">
                {index === 0 && (
                  <BotBasicsStep
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                )}
                {index === 1 && (
                  <WhatsAppSetupStep
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                )}
                {index === 2 && (
                  <CompanyInfoStep
                    companyDetails={companyDetails}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onAddCompanyDetail={handleAddCompanyDetail}
                    onUpdateCompanyDetail={handleUpdateCompanyDetail}
                    onRemoveCompanyDetail={handleRemoveCompanyDetail}
                  />
                )}
                {index === 3 && (
                  <BotBehaviorStep
                    formData={formData}
                    onInputChange={handleInputChange}
                  />
                )}
              </div>
            </WizardContainer>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-8">
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isLastStep={currentStep === steps.length - 1}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
} 