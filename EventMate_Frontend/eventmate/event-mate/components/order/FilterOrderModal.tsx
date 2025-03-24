import React from 'react';
import {FiCalendar, FiTrash2} from "react-icons/fi";

interface FilterModalProps {
    showFilterModal: boolean;
    onClose: () => void;
    onApply: () => void;
    filterDate: {
        start: string;
        end: string;
    };
    filterPrice: {
        min: string;
        max: string;
    };
    setFilterDate: (date: { start: string; end: string }) => void;
    setFilterPrice: (price: { min: string; max: string }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
    showFilterModal,
    onClose,
    onApply,
    filterDate,
    filterPrice,
    setFilterDate,
    setFilterPrice
}) => {
    if (!showFilterModal) return null;

    const handleClearFilter = () => {
        setFilterDate({ start: "", end: "" });
        setFilterPrice({ min: "", max: "" });
    };

    const hasActiveFilters = filterDate.start || filterDate.end || filterPrice.min || filterPrice.max;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className="bg-gray-50 rounded-lg w-[500px] relative">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Filter Orders</h3>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="text-xs text-gray-500 mb-1 block">From</label>
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    value={filterDate.start}
                                    onChange={(e) => setFilterDate({ ...filterDate, start: e.target.value })}
                                />
                                <FiCalendar className="absolute left-3 top-[34px] w-5 h-5 text-gray-400" />
                            </div>
                            <div className="relative">
                                <label className="text-xs text-gray-500 mb-1 block">To</label>
                                <input
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    value={filterDate.end}
                                    onChange={(e) => setFilterDate({ ...filterDate, end: e.target.value })}
                                />
                                <FiCalendar className="absolute left-3 top-[34px] w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                <input
                                    type="number"
                                    placeholder="VNĐ"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    value={filterPrice.min}
                                    onChange={(e) => setFilterPrice({ ...filterPrice, min: e.target.value })}
                                    min="0"
                                />
                                <span className="absolute left-3 top-[34px] text-gray-400">$</span>
                            </div>
                            <div className="relative">
                                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                <input
                                    type="number"
                                    placeholder="VNĐ"
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                                    value={filterPrice.max}
                                    onChange={(e) => setFilterPrice({ ...filterPrice, max: e.target.value })}
                                    min="0"
                                />
                                <span className="absolute left-3 top-[34px] text-gray-400">$</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-b-lg flex justify-between gap-3">
                    <button
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${
                            hasActiveFilters 
                            ? "text-red-600 hover:text-red-700" 
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={handleClearFilter}
                        disabled={!hasActiveFilters}
                    >
                        <FiTrash2 className="w-4 h-4" />
                        Clear Filters
                    </button>
                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-6 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800"
                            onClick={onApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal; 