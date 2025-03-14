import React from 'react';
import { motion } from 'framer-motion';

interface CompanyInfoStepProps {
  companyName: string;
  companyOverview: string;
  companyDetails: { id: string; value: string }[];
  onChange: (field: string, value: string) => void;
  onAddDetail: () => void;
  onUpdateDetail: (id: string, value: string) => void;
  onRemoveDetail: (id: string) => void;
}

export default function CompanyInfoStep({
  companyName,
  companyOverview,
  companyDetails,
  onChange,
  onAddDetail,
  onUpdateDetail,
  onRemoveDetail,
}: CompanyInfoStepProps) {
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Company Information
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400"
        >
          Tell us about your company so the bot can represent you accurately
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-6"
      >
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            value={companyName}
            onChange={(e) => onChange('companyName', e.target.value)}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="Enter your company name"
          />
        </div>

        <div>
          <label htmlFor="companyOverview" className="block text-sm font-medium text-gray-300 mb-2">
            Company Overview
          </label>
          <textarea
            id="companyOverview"
            value={companyOverview}
            onChange={(e) => onChange('companyOverview', e.target.value)}
            rows={4}
            className="w-full bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
            placeholder="Describe what your company does"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Key Details
          </label>
          <div className="space-y-3">
            {companyDetails.map((detail) => (
              <motion.div
                key={detail.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={detail.value}
                  onChange={(e) => onUpdateDetail(detail.id, e.target.value)}
                  className="flex-1 bg-[#2a2a2a] text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow"
                  placeholder="Enter a key detail about your company"
                />
                <button
                  type="button"
                  onClick={() => onRemoveDetail(detail.id)}
                  className="text-red-500 hover:text-red-400 px-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </motion.div>
            ))}
            <motion.button
              type="button"
              onClick={onAddDetail}
              className="text-green-500 hover:text-green-400 text-sm font-medium flex items-center gap-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Detail
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 