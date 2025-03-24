'use client'
import { useState } from 'react';
import { FaChevronDown, FaTrash, FaPen } from 'react-icons/fa';

const Timeline = ({ 
  title, 
  date, 
  activities, 
  onEditActivity, 
  onDeleteActivity, 
  onExpandChange,
  onEditTimeline,
  onDeleteTimeline,
  onAddActivity 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandChange?.(newExpandedState);
  };

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-5 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEditTimeline({ title, date, activities })}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaPen size={16} />
          </button>
          <button
            onClick={() => onDeleteTimeline({ title, date, activities })}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          >
            <FaTrash size={16} />
          </button>
          <button
            onClick={handleExpandClick}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaChevronDown
              className={`transform transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 ${
                index !== activities.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                  <p className="text-sm text-gray-500">{activity.content}</p>
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
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Created by: {activity.createdBy}
                  </span>
                  <span className="text-sm text-gray-500">
                    Cost: {activity.cost}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Timeline;