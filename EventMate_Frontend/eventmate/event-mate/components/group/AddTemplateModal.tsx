import React, { useState } from 'react';

interface AddTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quantity: number) => void;
}

const AddTemplateModal: React.FC<AddTemplateModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [quantity, setQuantity] = useState<string>("1");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-100 rounded-lg p-6 w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Add Template</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose template to create
                    </label>
                    <select
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option value="1">Cultural</option>
                        <option value="2">Concerts</option>
                        <option value="3">Food Festival</option>
                    </select>
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSubmit(parseInt(quantity))}
                        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                    >
                        Tạo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTemplateModal; 