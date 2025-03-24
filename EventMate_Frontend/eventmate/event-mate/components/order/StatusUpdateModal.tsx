import React from 'react';

interface StatusOption {
    label: string;
    color: string;
    description: string;
}

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (status: string) => void;
    currentStatus: string;
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    statusColors: Record<string, string>;
    statusOptions: Record<string, StatusOption>;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
    isOpen,
    onClose,
    onUpdate,
    currentStatus,
    selectedStatus,
    onStatusChange,
    statusColors,
    statusOptions,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-50 rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Update Order Status</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Current Status: 
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm ${statusColors[currentStatus]}`}>
                            {currentStatus}
                        </span>
                    </p>
                    
                    <div className="space-y-2">
                        {Object.entries(statusOptions).map(([value, { label, color, description }]) => (
                            <label
                                key={value}
                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                    selectedStatus === value
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="status"
                                    value={value}
                                    checked={selectedStatus === value}
                                    onChange={(e) => onStatusChange(e.target.value)}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-2 py-1 rounded-full text-sm ${color}`}>
                                            {label}
                                        </span>
                                        {selectedStatus === value && (
                                            <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => onUpdate(selectedStatus)}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Update Status
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusUpdateModal; 