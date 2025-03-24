import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="text-center">
        <p className="text-red-500 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Thử lại
          </button>
        )}
      </div>
    </div>
  );
} 