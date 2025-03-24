import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ChangeLeaderModal({ 
  isOpen, 
  onClose, 
  members, 
  currentUser, 
  selectedNewLeader, 
  onSelectNewLeader, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-100 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-2xl bg-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Chọn Leader mới</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-4">
            Bạn cần chọn một leader mới 
          </p>

          <div className="space-y-2 mb-6">
            {members.filter(m => m.userId !== currentUser.id).map(member => (
              <div
                key={member.userId}
                onClick={() => {
                  onSelectNewLeader(member.userId);
                }}
                className={`flex items-center p-3 rounded-md cursor-pointer transition-colors ${
                  selectedNewLeader === member.userId 
                    ? 'bg-gray-100 border border-gray-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.fullName}
                    className="w-8 h-8 rounded-full bg-gray-100"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
                <span className="ml-3 text-sm font-medium text-gray-900">
                  {member.fullName}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={onConfirm}
              disabled={!selectedNewLeader}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedNewLeader
                  ? 'text-white bg-gray-900 hover:bg-gray-800'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              Xác nhận 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
