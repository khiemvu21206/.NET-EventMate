import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
} 