import React from 'react';

export interface CompanyDetail {
  id: string;
  value: string;
}

export interface CompanyInfoStepProps {
  companyDetails: CompanyDetail[];
  formData: {
    companyName: string;
    [key: string]: string;
  };
  onInputChange: (field: string, value: string) => void;
  onAddCompanyDetail: () => void;
  onUpdateCompanyDetail: (id: string, value: string) => void;
  onRemoveCompanyDetail: (id: string) => void;
}

export default function CompanyInfoStep({
  companyDetails,
  formData,
  onInputChange,
  onAddCompanyDetail,
  onUpdateCompanyDetail,
  onRemoveCompanyDetail,
}: CompanyInfoStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-2">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => onInputChange('companyName', e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
          placeholder="Enter your company name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Overview
        </label>
        <div className="space-y-4">
          {companyDetails.map((detail) => (
            <div key={detail.id} className="flex items-start gap-2">
              <textarea
                value={detail.value}
                onChange={(e) => onUpdateCompanyDetail(detail.id, e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y min-h-[100px] text-white placeholder-gray-400"
                placeholder="Enter company information..."
              />
              <button
                onClick={() => onRemoveCompanyDetail(detail.id)}
                className="p-2 text-gray-400 hover:text-red-500"
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
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onAddCompanyDetail}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
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
        Add Company Detail
      </button>
    </div>
  );
} 