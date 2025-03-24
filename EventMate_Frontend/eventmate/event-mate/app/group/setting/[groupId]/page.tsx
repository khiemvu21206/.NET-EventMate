'use client'
import { useState, useEffect } from 'react';
import Navbar from '@/components/group/Navbar';
import { BellIcon, UserCircleIcon, XMarkIcon, ExclamationTriangleIcon, CalendarDaysIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import ChangeLeaderModal from '@/components/group/ChangeLeaderModal';
import { JSX } from 'react/jsx-runtime';
import { useParams, useRouter } from 'next/navigation';
import { useUserContext } from '@/providers/UserProvider';
import { GroupRepository } from '@/repositories/GroupRepository';

interface Member {
  userId: string;
  fullName: string;
  avatar: string | null;
  role: 'Leader' | 'Member';
  email: string;
  status: number;
}

interface CurrentUser {
  id: string;
  name: string;
  role: 'Leader' | 'Member';
}

interface GroupData {  
  groupId: string;  
  img: string;  
  groupName: string;  
  createdAt: string;  
  eventId: string;  
  totalMember: number;  
  leader: string;  
  description: string | null;  
  visibility: number;  
  status: number;

  user: any | null;  
  plans: any | null;  
  conversation: any | null;  
  requests: any | null;  
  user_Groups: any | null;  
  multimedia: any | null;  
  place: string;
  currency: string;
}

interface EventData {
  eventId: string;
  name: string;
  place: string;
  createdAt: string;
  timeStart: string;
  timeEnd: string;
  img: string | null;
  description: string | null;
  type: number;
  status: number;
  organizerName: string | null;
  organizerLogo: string | null;
  organizerDescription: string | null;
  banner: string | null;
}

export default function SettingPage(): JSX.Element {
  const { groupId } = useParams();
  const [notifications, setNotifications] = useState<boolean>(true);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState<boolean>(false);
  const [selectedNewLeader, setSelectedNewLeader] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('');
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'Leader' | 'Member'>('Member');
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [eventData, setEventData] = useState<EventData | null>(null);
  const router = useRouter();
  const { id, name, email } = useUserContext();

  const fetchData = async () => {
    if (!groupId) return;
    
    try {
      // Fetch group data first
      const groupResponse = await GroupRepository.findGroup(groupId as string);
      if (groupResponse.status === 200) {
        const groupDetails = groupResponse.data as GroupData;
        setGroupData(groupDetails);
        setCurrentUserRole(groupDetails.leader === id ? 'Leader' : 'Member');
        setSelectedCurrency(groupDetails.currency);

        // Fetch event data using eventId from group details
        if (groupDetails.eventId) {
          const eventResponse = await GroupRepository.getEventById(groupDetails.eventId);
          if (eventResponse.status === 200) {
            setEventData(eventResponse.data);
          }
        }

        // Then fetch members
        const membersResponse = await GroupRepository.listUsersInGroup(groupId as string);
        if (membersResponse.status === 200) {
          const usersData = membersResponse.data.map((user: any) => ({
            userId: user.userId,
            fullName: user.fullName,
            avatar: user.avatar,
            email: user.email,
            status: user.status,
            role: user.userId === groupDetails.leader ? 'Leader' : 'Member'
          }));
          setMembers(usersData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId, id]);

  const currentUser: CurrentUser = {
    id: id,
    name: name,
    role: currentUserRole
  };

  const handleNotificationToggle = (): void => {
    setNotifications(!notifications);
  };

  const handleLeaveGroup = async (): Promise<void> => {
    if (currentUser.role === 'Leader') {
      setIsLeaveModalOpen(true);
    } else {
      if (window.confirm('Bạn có chắc chắn muốn rời khỏi nhóm?')) {
        // Handle leaving group
        console.log('Rời nhóm');
        try {
          const response = await GroupRepository.removeUserFromGroup(id, groupId as string);
          if (response.status === 200) {
            router.push('/home');
          }
        } catch (error) {
          console.error('Error leaving group:', error);
            alert('Error leaving group');
          }
      }
    }
  };

  const handleEndGroup = async (): Promise<void> => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc nhóm? Hành động này không thể hoàn tác.')) {
      // Handle ending group
      console.log('Kết thúc nhóm');
      try {
        const response = await GroupRepository.deleteGroup(groupId as string);
        if (response.status === 200) {
          router.push('/home');
        }
      } catch (error) {
        console.error('Error ending group:', error);
        alert('Error ending group');
      }
    }
  };

  const handleSubmitReport = (): void => {
    // Handle report submission
    console.log('Báo cáo với lý do:', reportReason);
    setShowReportModal(false);
    setReportReason('');
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    try {
      const response = await GroupRepository.changeGroupCurrency(groupId as string, newCurrency);
      if (response.status === 200) {
        setSelectedCurrency(newCurrency);
        await fetchData();
      } else {
        alert('Failed to change currency');
      }
    } catch (error) {
      console.error('Error changing currency:', error);
      alert('Error changing currency');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your group settings and preferences here</p>
          </div>

          {/* Group Settings Section */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900">Group Settings</h2>
              
              {/* Event Information */}
              <div className="mt-6">
                <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      <CalendarDaysIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Event Information</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={eventData?.img || "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
                            alt="Event Image"
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Name:</span> {eventData?.name || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Time:</span> {eventData?.timeStart} - {eventData?.timeEnd}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Place:</span> {eventData?.place || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Status:</span> {eventData?.status === 1 ? "Live" : "Upcoming"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Currency Setting */}
              <div className="mt-6">
                <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      <BanknotesIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Currency</p>
                      <p className="text-sm text-gray-500">Select the currency for the group</p>
                    </div>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="VND">VND</option>
                    <option value="EUR">EUR</option>
                    <option value="JPY">JPY</option>
                    <option value="CNH">CNH</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>

                {/* Group Leader Setting */}
                <div className="flex items-center justify-between py-4 hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                      <UserCircleIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Group Leader</p>
                      <p className="text-sm text-gray-500">
                        Current Leader: {members.find(member => member.role === 'Leader')?.fullName || 'Loading...'}
                      </p>
                    </div>
                  </div>
                  {currentUser.role === 'Leader' && (
                    <button
                      onClick={() => setIsLeaveModalOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Appoint New Leader
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-gray-100">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                </div>

                <div className="space-y-3">
                  {/* Report Group */}
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm bg-white border border-gray-200 hover:border-gray-300 rounded-lg group transition-all"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-gray-700">Report Group</div>
                      <div className="text-gray-500">Report inappropriate content or behavior</div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Leave Group */}
                  <button
                    onClick={handleLeaveGroup}
                    className="w-full flex items-center justify-between p-4 text-left text-sm bg-white border border-gray-200 hover:border-gray-300 rounded-lg group transition-all"
                  >
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-gray-700">Leave Group</div>
                      <div className="text-gray-500">Permanently leave this group</div>
                    </div>
                    <div className="ml-4">
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* End Group (Only for Leader) */}
                  {currentUser.role === 'Leader' && (
                    <button
                      onClick={handleEndGroup}
                      className="w-full flex items-center justify-between p-4 text-left text-sm bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg group transition-all"
                    >
                      <div>
                        <div className="font-medium text-red-700">End Group Space</div>
                        <div className="text-red-600">Permanently delete this group and all its data</div>
                      </div>
                      <div className="ml-4">
                        <svg className="w-5 h-5 text-red-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangeLeaderModal 
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        members={members}
        currentUser={currentUser}
        selectedNewLeader={selectedNewLeader}
        onSelectNewLeader={(userId: string) => {
          setSelectedNewLeader(userId);
        }}
        onConfirm={async () => {
          if (selectedNewLeader) {
            try {
              const response = await GroupRepository.changeGroupLeader(selectedNewLeader, groupId as string);
              if (response.status === 200) {
                await fetchData();
                // Optionally, refresh group data or update UI to reflect the change
              } else {
                alert('Failed to change group leader');
              }
            } catch (error) {
              console.error('Error changing group leader:', error);
              alert('Error changing group leader');
            }
            setIsLeaveModalOpen(false);
          }
        }}
      />

      {/* Report Group Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Báo cáo nhóm</h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <textarea
                value={reportReason}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReportReason(e.target.value)}
                placeholder="Mô tả lý do báo cáo..."
                className="w-full h-32 p-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-300 resize-none placeholder:text-gray-400 transition-all"
              />

              <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={!reportReason.trim()}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    reportReason.trim()
                      ? 'text-white bg-gray-900 hover:bg-gray-800'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
