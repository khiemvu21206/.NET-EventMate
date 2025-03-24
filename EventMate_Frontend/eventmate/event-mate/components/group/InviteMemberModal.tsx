import { useState, useEffect } from 'react';
import { useUserContext } from '@/providers/UserProvider';
import { XMarkIcon, MagnifyingGlassIcon, UserCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { GroupRepository } from '@/repositories/GroupRepository';
import { FriendRepository } from '@/repositories/FriendRepository';
import { Friend } from '@/model/common';
// Define types for suggested members and component props
interface SuggestedMember {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
}

export default function InviteMemberModal({ isOpen, onClose, groupId }: InviteMemberModalProps) {
  const { logout, id: senderId } = useUserContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<SuggestedMember[]>([]);
  const [existingUsers, setExistingUsers] = useState<SuggestedMember[]>([]);
  const [suggestedMembers, setSuggestedMembers] = useState<SuggestedMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingUsers = async () => {
      try {
        const response = await GroupRepository.listUsersInGroup(groupId);
        if (response.status === 200) {
          setExistingUsers(response.data);
        } else {
          console.error('Failed to fetch existing users:', response);
        }
      } catch (err) {
        console.error('Error fetching existing users:', err);
      }
    };

    if (groupId) {
      fetchExistingUsers();
    }
  }, [groupId]);

  useEffect(() => {
    const fetchSuggestedMembers = async () => {
      try {
        const response = await FriendRepository.getListFriends({
          currentPage: 1,
          pageSize: 10,
          keySearch: ''
        });

        if (response?.data) {
          const friends = response.data.data.map((friend: Friend) => ({
            id: friend.friend.userId,
            name: friend.friend.fullName,
            email: friend.friend.email,
            avatar: friend.friend.avatar
          }));
          setSuggestedMembers(friends);
          // alertSuggestedMembers(friends);
        }
      } catch (error) {
        console.error('Error fetching suggested members:', error);
      }
    };

    fetchSuggestedMembers();
  }, []);

  const alertSuggestedMembers = (members: SuggestedMember[]) => {
    const memberList = members.map(member => `${member.name} (${member.email})`).join('\n');
    alert(`Suggested Members:\n${memberList}`);
  };

  const alertSelectedMembers = () => {
    const memberList = selectedMembers.map(member => `${member.name} (${member.email})`).join('\n');
    alert(`Selected Members:\n${memberList}`);
  };

  useEffect(() => {
    if (!email) {
      setValidationError(null);
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
    } else if (existingUsers.some(user => user.email === email)) {
      setValidationError('User already in group.');
    } else {
      setValidationError(null);
    }
  }, [email, existingUsers]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const filteredSuggestions = suggestedMembers.filter(member => 
    (member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     member.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedMembers.some(selected => selected.id === member.id) &&
    !existingUsers.some(existing => existing.email === member.email)
  );

  const handleAddMember = (member: SuggestedMember) => {
    setSelectedMembers([...selectedMembers, member]);
    // alertSelectedMembers();
  };

  const handleRemoveMember = (memberId: number) => {
    setSelectedMembers(selectedMembers.filter(member => member.id !== memberId));
    // alertSelectedMembers();
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (email && !validationError) {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/requestCreate?groupId=${groupId}&senderId=${senderId}&email=${email}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to send invitation to ${email}`);
        }
        alert(`Invitation sent to ${email}`);
        setEmail('');
      }

      for (const member of selectedMembers) {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/requestCreate?groupId=${groupId}&senderId=${senderId}&email=${member.email}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to send invitation to ${member.email}`);
        }
      }
      alert(`Đã gửi email mời tham gia nhóm đến ${selectedMembers.length} người`);
      setSelectedMembers([]);
      setSearchQuery('');
      onClose();
    } catch (err: any) {
      console.error('Error sending invitations:', err);
      setError(err.message || 'Failed to send invitations.');
    }
  };

  const handleClose = () => {
    setSelectedMembers([]);
    setSearchQuery('');
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black-100 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="bg-white-100 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Thêm thành viên</h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* New Section for Direct Email Invitation */}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter email address"
            />
            {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
          </div>

          {/* Danh sách thành viên đã chọn */}
          {selectedMembers.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Đã chọn:</div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map(member => (
                  <div
                    key={member.id}
                    className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1"
                  >
                    <span className="text-sm text-gray-900">{member.name}</span>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách gợi ý */}
          <div className="max-h-60 overflow-y-auto">
            {filteredSuggestions.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                onClick={() => handleAddMember(member)}
              >
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
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                  </div>
                </div>
                <PlusIcon className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>

          {/* Nút thêm */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Huỷ
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedMembers.length === 0 && !email}
              className={`px-4 py-2 text-sm text-white rounded-md transition-colors ${
                (selectedMembers.length > 0 || email) && !validationError
                  ? 'bg-gray-900 hover:bg-gray-800'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Gửi lời mời {selectedMembers.length > 0 && `(${selectedMembers.length})`}
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
} 