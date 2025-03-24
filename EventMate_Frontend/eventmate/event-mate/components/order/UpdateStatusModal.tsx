import React, { useState, useEffect } from 'react';

enum OrderStatus {
    WaitingForApproval = 0,
    Accepted = 1,
    InTransit = 2,
    Rejected = 3,
    Delivered = 4,
    Completed = 5
}

interface UpdateStatusModalProps {
    showModal: boolean;
    onClose: () => void;
    onUpdate: (newStatus: OrderStatus) => void;
    orderId: string | null;
    currentStatus: OrderStatus;
}

const statusOptions: Record<OrderStatus, { label: string; color: string; bgColor: string; description: string }> = {
    [OrderStatus.WaitingForApproval]: {
        label: 'Waiting For Approval',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100',
        description: 'Order is waiting for seller approval'
    },
    [OrderStatus.Accepted]: {
        label: 'Accepted',
        color: 'text-blue-700',
        bgColor: 'bg-blue-100',
        description: 'Order has been accepted by the seller'
    },
    [OrderStatus.InTransit]: {
        label: 'In Transit',
        color: 'text-purple-700',
        bgColor: 'bg-purple-100',
        description: 'Order is being delivered'
    },
    [OrderStatus.Rejected]: {
        label: 'Rejected',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        description: 'Order has been rejected by the seller'
    },
    [OrderStatus.Delivered]: {
        label: 'Delivered',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        description: 'Order has been delivered to the customer'
    },
    [OrderStatus.Completed]: {
        label: 'Completed',
        color: 'text-gray-700',
        bgColor: 'bg-gray-100',
        description: 'Order has been completed successfully'
    }
};

const UpdateStatusModal = ({ showModal, onClose, onUpdate, orderId, currentStatus }: UpdateStatusModalProps) => {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);

    useEffect(() => {
        if (showModal) {
            setSelectedStatus(currentStatus);
        }
    }, [showModal]);

    if (!showModal) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(selectedStatus);
    };

    return (
        <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xs p-4 m-3">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Update Order Status</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 bg-gray-50 p-2.5 rounded-md">
                        <p className="text-xs text-gray-600">
                            Order ID: <span className="font-medium text-gray-900">{orderId}</span>
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            Current Status: 
                            <span className={`px-2 py-0.5 rounded-full font-medium ${statusOptions[currentStatus].color} ${statusOptions[currentStatus].bgColor}`}>
                                {statusOptions[currentStatus].label}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="space-y-1.5">
                            {Object.entries(OrderStatus)
                                .filter(([key]) => isNaN(Number(key)))
                                .map(([key, value]) => {
                                    const status = value as OrderStatus;
                                    const option = statusOptions[status];
                                    const isSelected = selectedStatus === status;
                                    return (
                                        <label
                                            key={key}
                                            className={`flex items-center p-2 rounded-md border cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? `${option.bgColor} border-gray-200`
                                                    : 'hover:bg-gray-50 border-gray-100'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="status"
                                                value={status}
                                                checked={isSelected}
                                                onChange={(e) => setSelectedStatus(Number(e.target.value) as OrderStatus)}
                                                className="hidden"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${option.color} ${option.bgColor}`}>
                                                        {option.label}
                                                    </span>
                                                    {isSelected && (
                                                        <svg className="h-4 w-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-xs text-gray-600">{option.description}</p>
                                            </div>
                                        </label>
                                    );
                                })
                            }
                        </div>

                        <div className="flex gap-2 pt-2 border-t">
                            <button
                                type="submit"
                                className="flex-1 px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                            >
                                Update Status
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateStatusModal; 