import React from 'react';
import { XMarkIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface CreateCost {
  activityId: string | null;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
  createdBy: string;
  groupId: string;
  status: number;
}

interface Member {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  status: string;
}

interface EditCostModalProps {
  isOpen: boolean;
  onClose: () => void;
  cost: CreateCost;
  onUpdateCost: (cost: CreateCost) => void;
  setCost: (cost: CreateCost) => void;
  members: Member[];
  categories: string[];
}

const EditCostModal: React.FC<EditCostModalProps> = ({
  isOpen,
  onClose,
  cost,
  onUpdateCost,
  setCost,
  members,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa chi phí</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <input
              type="text"
              value={cost.description}
              onChange={(e) => setCost({ ...cost, description: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phân loại</label>
            <select
              value={cost.category}
              onChange={(e) => setCost({ ...cost, category: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-md"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
            <input
              type="number"
              value={cost.amount}
              onChange={(e) => setCost({ ...cost, amount: parseFloat(e.target.value) })}
              className="w-full p-2 border border-gray-200 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <div className="relative">
              <input
                type="date"
                value={cost.createdAt}
                onChange={(e) => setCost({ ...cost, createdAt: e.target.value })}
                className="w-full p-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Người trả</label>
            <select
              value={cost.createdBy}
              onChange={(e) => setCost({ ...cost, createdBy: e.target.value })}
              className="w-full p-2 border border-gray-200 rounded-md"
            >
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <button
              onClick={() => setCost({ ...cost, status: cost.status === 1 ? 0 : 1 })}
              className={`w-full px-3 py-2 rounded-md text-sm font-medium ${
                cost.status === 1
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {cost.status === 1 ? 'Đã trả' : 'Chưa trả'}
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Huỷ
          </button>
          <button
            onClick={() => {
              onUpdateCost(cost);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCostModal; 