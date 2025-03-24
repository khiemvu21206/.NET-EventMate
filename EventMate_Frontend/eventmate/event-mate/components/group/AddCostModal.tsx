import React, { useState } from 'react';
import Modal from '@/components/shared/Modal';

interface AddCostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { amount: number; description: string }) => void;
}

const AddCostModal: React.FC<AddCostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            amount: parseFloat(amount),
            description: description
        });
        setAmount('');
        setDescription('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    Thêm Chi Phí Phát Sinh
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Số Tiền (VND)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                            min="0"
                            step="1000"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Mô Tả Chi Phí
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                        >
                            Xác Nhận
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddCostModal; 