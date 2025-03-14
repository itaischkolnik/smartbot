import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StepContentProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function StepContent({ children, title, description }: StepContentProps) {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-2 text-white">{title}</h2>
        <p className="text-gray-400 mb-8">{description}</p>
        
        <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-xl">
          {children}
        </div>
      </motion.div>
    </div>
  );
} 