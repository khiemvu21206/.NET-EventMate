'use client'
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/group/Navbar';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { GroupRepository } from '@/repositories/GroupRepository';
import { useParams } from 'next/navigation';
import EditCostModal from '@/components/group/EditCostModal';

// Định nghĩa các interface
interface Cost {
  costId: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
  createdBy: string;
  userName: string | null;
  status: number;
}

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

interface MemberSettlement {
  [key: string]: number;
}

const categories: string[] = [
  'Accommodation',
  'Transportation',
  'Food',
  'Activities',
  'Shopping',
  'Other'
];

const CostPage: React.FC = () => {
  const { groupId } = useParams();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [newCost, setNewCost] = useState<CreateCost>({
    activityId: null,
    amount: 0,
    description: '',
    category: 'Food',
    createdAt: new Date().toISOString(),
    createdBy: '',
    groupId: groupId as string,
    status: 0
  });
  const [currency, setCurrency] = useState<string>('USD'); // Default currency
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchGroupData = async () => {
    try {
      const response = await GroupRepository.findGroup(groupId as string);
      if (response.status === 200) {
        const groupDetails = response.data;
        setCurrency(groupDetails.currency); // Set currency from group data
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await GroupRepository.listUsersInGroup(groupId as string);
      if (response.status === 200) {
        const usersData = response.data.map((user: any) => ({
          id: user.userId,
          name: user.fullName,
          avatar: user.avatar,
          role: 'Member',
          status: user.status === 0 ? 'Offline' : 'Active'
        }));
        setMembers(usersData);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const fetchCosts = async () => {
    try {
      const response = await GroupRepository.getGroupCosts(groupId as string);
      if (response.status === 200) {
        const data = response.data as Cost[];
        setCosts(data);
      }
    } catch (error) {
      console.error('Error fetching costs:', error);
    }
  };

  // Fetch data from API
  useEffect(() => {
    fetchGroupData();
    fetchMembers();
    fetchCosts();
  }, []);

  const totalCosts: number = costs.reduce((sum, cost) => sum + cost.amount, 0);
  const perPersonCost: number = members.length > 0 ? totalCosts / members.length : 0;

  const paidByPerson: MemberSettlement = members.reduce((acc, member) => {
    acc[member.id] = costs
      .filter(cost => cost.createdBy === member.id && cost.status === 1)
      .reduce((sum, cost) => sum + cost.amount, 0);
    return acc;
  }, {} as MemberSettlement);

  const finalSettlement: MemberSettlement = members.reduce((acc, member) => {
    const paid: number = paidByPerson[member.id];
    const shouldPay: number = perPersonCost;
    acc[member.id] = paid - shouldPay;
    return acc;
  }, {} as MemberSettlement);

  const handleAddCost = async (): Promise<void> => {
    if (!newCost.description || !newCost.amount) return;

    try {
      const response = await GroupRepository.createCost(newCost);
      if (response.status === 200) {
        // Refresh the costs list
        await fetchCosts();
        // Reset the form
        setNewCost({
          activityId: null,
          amount: 0,
          description: '',
          category: 'Food',
          createdAt: new Date().toISOString(),
          createdBy: members[0]?.id || '',
          groupId: groupId as string,
          status: 0
        });
        setIsAdding(false);
      } else {
        alert('Failed to add cost');
      }
    } catch (error) {
      console.error('Error adding cost:', error);
      alert('Error adding cost');
    }
  };

  const handleEditCost = (cost: Cost): void => {
    setEditingId(cost.costId);
    setNewCost({
      activityId: null,
      amount: cost.amount,
      description: cost.description,
      category: cost.category,
      createdAt: cost.createdAt,
      createdBy: cost.createdBy,
      groupId: groupId as string,
      status: cost.status
    });
    setIsModalOpen(true);
  };

  const handleUpdateCost = async (): Promise<void> => {
    if (editingId === null) return;

    try {
      const response = await GroupRepository.updateCost({
        costId: editingId,
        amount: newCost.amount,
        description: newCost.description,
        category: newCost.category,
        createdAt: newCost.createdAt,
        createdBy: newCost.createdBy,
        status: newCost.status
      });

      if (response.status === 200) {
        // Refresh the costs list after successful update
        await fetchCosts();
        setEditingId(null);
        setNewCost({
          activityId: null,
          amount: 0,
          description: '',
          category: 'Food',
          createdAt: new Date().toISOString().split('T')[0],
          createdBy: members[0]?.id || '',
          groupId: groupId as string,
          status: 0
        });
        setIsModalOpen(false);
      } else {
        alert('Failed to update cost');
      }
    } catch (error) {
      console.error('Error updating cost:', error);
      alert('Error updating cost');
    }
  };

  const handleDeleteCost = (id: string): void => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi phí này?')) {
      // Here you would typically make an API call to delete the cost
      // For now, we'll just update the local state
      setCosts(costs.filter(cost => cost.costId !== id));
    }
  };

  const togglePaidStatus = (id: string): void => {
    setCosts(costs.map(cost =>
      cost.costId === id ? { ...cost, status: cost.status === 1 ? 0 : 1 } : cost
    ));
  };

  // Format currency helper
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: currency, // Use the currency from group data
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-[95%] mx-auto">
          {/* Thống kê tổng quan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng chi phí</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCosts)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Chi phí/người</h3>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(perPersonCost)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Số khoản chi</h3>
              <p className="text-2xl font-bold text-gray-900">{costs.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Đã thanh toán</h3>
              <p className="text-2xl font-bold text-gray-900">
                {costs.filter(e => e.status === 1).length}/{costs.length}
              </p>
            </div>
          </div>

          {/* Chi tiết theo thành viên */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Chi tiết theo thành viên</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Thành viên</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Đã trả</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Cần trả</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Chênh lệch</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-8 h-8 rounded-full bg-gray-100"
                              /> 
                            ) : (
                              <UserCircleIcon className="w-8 h-8 text-gray-400" />
                            )}
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          {formatCurrency(paidByPerson[member.id])}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          {formatCurrency(perPersonCost)}
                        </td>
                        <td className={`py-3 px-4 text-sm font-medium text-right ${
                          finalSettlement[member.id] > 0 ? 'text-green-600' : finalSettlement[member.id] < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {formatCurrency(Math.abs(finalSettlement[member.id]))}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {finalSettlement[member.id] > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Được nhận
                            </span>
                          ) : finalSettlement[member.id] < 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Cần trả
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Đã cân bằng
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Danh sách chi tiết các khoản chi */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Chi tiết các khoản chi</h2>
                {!isAdding && (
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Thêm khoản chi
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Mô tả</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Phân loại</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Số tiền</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Ngày</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Người trả</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Trạng thái</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isAdding && (
                      <tr className="bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={newCost.description}
                            onChange={(e) => setNewCost({ ...newCost, description: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-md"
                            placeholder="Nhập mô tả"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={newCost.category}
                            onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-md"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={newCost.amount}
                            onChange={(e) => setNewCost({ ...newCost, amount: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-200 rounded-md text-right"
                            placeholder="0"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative">
                            <input
                              type="date"
                              value={newCost.createdAt}
                              onChange={(e) => setNewCost({ ...newCost, createdAt: e.target.value })}
                              className="w-full p-2 border border-gray-200 rounded-md"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={newCost.createdBy}
                            onChange={(e) => setNewCost({ ...newCost, createdBy: e.target.value })}
                            className="w-full p-2 border border-gray-200 rounded-md"
                          >
                            {members.map(member => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setNewCost({ ...newCost, status: newCost.status === 1 ? 0 : 1 })}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              newCost.status === 1
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {newCost.status === 1 ? 'Đã trả' : 'Chưa trả'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleAddCost}
                              className="px-3 py-1 text-sm text-white bg-gray-900 rounded-md hover:bg-gray-800"
                            >
                              Lưu
                            </button>
                            <button
                              onClick={() => {
                                setIsAdding(false);
                                setNewCost({
                                  activityId: null,
                                  amount: 0,
                                  description: '',
                                  category: 'Food',
                                  createdAt: new Date().toISOString().split('T')[0],
                                  createdBy: members[0]?.id || '',
                                  groupId: groupId as string,
                                  status: 0
                                });
                              }}
                              className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                              Huỷ
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {costs.map((cost) => (
                      <tr key={cost.costId} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{cost.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{cost.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          {formatCurrency(cost.amount)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{cost.createdAt}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{cost.userName}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cost.status === 1
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {cost.status === 1 ? 'Đã trả' : 'Chưa trả'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditCost(cost)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCost(cost.costId)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Cost Modal */}
        <EditCostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cost={newCost}
          onUpdateCost={handleUpdateCost}
          setCost={setNewCost}
          members={members}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default CostPage; 