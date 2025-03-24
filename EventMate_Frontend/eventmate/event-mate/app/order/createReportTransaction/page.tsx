'use client';

import React, { useState } from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiHelpCircle, FiSend, FiFileText } from 'react-icons/fi';

const statusColors = {
  submitted: {
    bg: '#EBF5FF',
    text: '#0066CC',
    icon: <FiSend size={16} />,
  },
  under_review: {
    bg: '#FFF7E6',
    text: '#B25E02',
    icon: <FiClock size={16} />,
  },
  resolved: {
    bg: '#E6F4EA',
    text: '#137333',
    icon: <FiCheckCircle size={16} />,
  },
  pending: {
    bg: '#FEE8E7',
    text: '#B31412',
    icon: <FiAlertCircle size={16} />,
  }
};

export default function ReportTransaction() {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [reportStatus, setReportStatus] = useState('under_review');

  const transactionDetails = {
    id: '#TRX-89275',
    date: 'March 15, 2025',
    amount: '$599.99',
    seller: 'John Smith',
    paymentMethod: 'Credit Card (**** 4589)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ issueType, description });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      console.log('Files selected:', files);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Report Transaction</h1>
        <div className="flex items-center gap-4">
          <div 
            className="px-3 py-1 rounded-full flex items-center gap-2"
            style={{
              backgroundColor: statusColors[reportStatus as keyof typeof statusColors].bg,
              color: statusColors[reportStatus as keyof typeof statusColors].text,
            }}
          >
            {statusColors[reportStatus as keyof typeof statusColors].icon}
            <span className="font-medium">{reportStatus.replace('_', ' ').toUpperCase()}</span>
          </div>
          <span className="text-gray-600">Transaction ID: {transactionDetails.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Transaction Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText />
              Transaction Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Date</p>
                <p>{transactionDetails.date}</p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p>{transactionDetails.amount}</p>
              </div>
              <div>
                <p className="text-gray-500">Seller</p>
                <p>{transactionDetails.seller}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p>{transactionDetails.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Report Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiAlertCircle />
              Report Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                >
                  <option value="">Select an issue type</option>
                  <option value="not_received">Item Not Received</option>
                  <option value="damaged">Damaged Item</option>
                  <option value="wrong_item">Wrong Item</option>
                  <option value="other">Other Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Detailed Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FiSend className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2">Drag and drop files here or click to upload</p>
                  <p className="text-sm text-gray-500">Supported: JPG, PNG, PDF (Max 10MB)</p>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 flex items-center gap-2"
                >
                  <FiSend />
                  Submit Report
                </button>
                <button
                  type="button"
                  className="px-6 py-2 border border-black text-black rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiClock />
              Resolution Timeline
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-2"></div>
                <div>
                  <p className="flex items-center gap-2">
                    <FiSend size={16} />
                    Report Submitted
                  </p>
                  <p className="text-sm text-gray-500">March 15, 2025 - 10:30 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-gray-300 mt-2"></div>
                <div>
                  <p className="flex items-center gap-2">
                    <FiClock size={16} />
                    Under Review
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiHelpCircle />
              Need Help?
            </h2>
            <p className="text-gray-600 mb-4">Our support team is available 24/7 to assist you</p>
            <button className="w-full px-4 py-2 border border-black text-black rounded hover:bg-gray-50 flex items-center justify-center gap-2">
              <FiHelpCircle />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}