'use client'
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const DeleteTimelineModal = ({ isOpen, onClose, onConfirm, timeline }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black-100 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-2xl bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Delete Timeline</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-50">
                        <FaExclamationTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div className="text-center">
                        <h4 className="text-lg font-medium text-gray-800 mb-2">
                            Are you sure you want to delete this timeline?
                        </h4>
                        <p className="text-sm text-gray-500">
                            "{timeline?.title}" and all its activities will be permanently removed. This action cannot be undone.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm(timeline);
                            onClose();
                        }}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                        Delete Timeline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTimelineModal; 