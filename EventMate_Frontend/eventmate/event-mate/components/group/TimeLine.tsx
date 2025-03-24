'use client'
import React, { useState } from 'react';
import { FaChevronDown, FaTrash, FaPen, FaMoneyBillWave } from 'react-icons/fa';

// Define types for activities and timeline props
interface AdditionalCost {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
}

interface Activity {
  activityId: string;
  planId: string;
  content: string;
  schedule: string;
  createdAt: string;
  createdBy: string;
  category: string;
  status: number;
  statusName: string;
  costs?: AdditionalCost[];
}

interface TimelineData {
  planId: string;
  title: string;
  description: string;
  schedule: string;
  groupId: string;
  status: number;
  statusName: string;
  activities: Activity[];
}

interface TimelineProps {
  timeLineData: TimelineData;
  statusTag: React.ReactNode;
  onEditActivity: (activity: Activity) => void;
  onDeleteActivity: (activity: Activity) => void;
  onExpandChange: (isExpanded: boolean) => void;
  onEditTimeline: (timeline: { title: string; schedule: string; activities: Activity[] }) => void;
  onDeleteTimeline: (timeline: { title: string; schedule: string; activities: Activity[] }) => void;
  onAddActivity?: () => void;
  onAddCost: (activity: Activity) => void;
}

const Timeline: React.FC<TimelineProps> = ({
  timeLineData,
  statusTag,
  onEditActivity,
  onDeleteActivity,
  onExpandChange,
  onEditTimeline,
  onDeleteTimeline,
  onAddCost
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleExpandClick = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandChange?.(newExpandedState);
  };

  const getStatusTagStyle = (status: number) => {
    switch (status) {
      case 0:
        return 'bg-blue-100 text-blue-800'; // Chưa hoàn thành
      case 1:
        return 'bg-green-100 text-green-800'; // Hoàn thành
      case 2:
        return 'bg-red-100 text-red-800'; // Đang thực hiện
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {statusTag}
            <h2 className="text-xl font-semibold">{timeLineData.title}</h2>
            <p className="text-base text-gray-600">{new Date(timeLineData.schedule).toLocaleString('vi-VN')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEditTimeline({ title: timeLineData.title, schedule: timeLineData.schedule, activities: timeLineData.activities })}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaPen size={16} />
            </button>
            <button
              onClick={() => onDeleteTimeline({ title: timeLineData.title, schedule: timeLineData.schedule, activities: timeLineData.activities })}
              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <FaTrash size={16} />
            </button>
            <button
              onClick={handleExpandClick}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaChevronDown
                className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                  }`}
              />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600">{timeLineData.description}</p>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {timeLineData.activities.map((activity, index) => (
            <div
              key={activity.activityId}
              className={`p-4 ${index !== timeLineData.activities.length - 1 ? 'border-b border-gray-100' : ''
                }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusTagStyle(activity.status)}`}>
                    {activity.statusName}
                  </span>
                  <h4 className="font-medium text-gray-800">{activity.content}</h4>
                  <span className="text-base text-gray-600">
                    {new Date(activity.schedule).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditActivity(activity)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaPen size={14} />
                  </button>
                  <button
                    onClick={() => onDeleteActivity(activity)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Created by: {activity.createdBy}</span>
                  <span>Description: {activity.category}</span>
                </div>

                {/* Hiển thị danh sách chi phí */}
                {activity.costs && activity.costs.length > 0 && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-700">Chi phí phát sinh</h5>
                      <div className="px-3 py-1 bg-gray-200 rounded-full">
                        <span className="text-xs font-medium text-gray-700">
                          {activity.costs.length} khoản chi
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {activity.costs.map((cost) => (
                        <div
                          key={cost.id}
                          className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-800">
                              {cost.description}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(cost.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-gray-900">
                              {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              }).format(cost.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tổng chi phí */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Tổng chi phí</span>
                        <span className="text-base font-bold text-gray-900">
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(
                            activity.costs.reduce((sum, cost) => sum + cost.amount, 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => onAddCost(activity)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                  >
                    <FaMoneyBillWave size={14} className="text-gray-500" />
                    <span>Thêm Chi Phí</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;