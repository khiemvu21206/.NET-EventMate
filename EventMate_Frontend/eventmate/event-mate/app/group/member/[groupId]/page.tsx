'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/group/Navbar';
import { UserCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import InviteMemberModal from '@/components/group/InviteMemberModal';
import { GroupRepository } from '@/repositories/GroupRepository';
import { useUserContext } from '@/providers/UserProvider';
import { FriendRepository } from '@/repositories/FriendRepository';
import { Friend } from '@/model/common';

// Define types for members and suggested members
interface Member {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  status: string;
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
  events: any | null;  
  user: any | null;  
  plans: any | null;  
  conversation: any | null;  
  requests: any | null;  
  user_Groups: any | null;  
  multimedia: any | null;  
  place: string;
}

export default function MemberPage() {
  const { groupId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const { id } = useUserContext();
  

  useEffect(() => {
    const fetchData = async () => {
      if (!groupId) return;
      
      try {
        // Fetch group data first
        const groupResponse = await GroupRepository.findGroup(groupId as string);
        if (groupResponse.status === 200) {
          const groupDetails = groupResponse.data as GroupData;
          setGroupData(groupDetails);          
          // Then fetch members
          const membersResponse = await GroupRepository.listUsersInGroup(groupId as string);
          if (membersResponse.status === 200) {
            const usersData = membersResponse.data.map((user: any) => ({
              id: user.userId,
              name: user.fullName,
              avatar: user.avatar,
              // Set role to 'Leader' if userId matches group leader
              role: user.userId === groupDetails.leader ? 'Leader' : 'Member',
              status: user.status === 0 ? 'Offline' : 'Active'
            }));
            setMembers(usersData);
          }
          setIsLeader(groupDetails.leader === id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [groupId]);

  const handleDeleteMember = async (memberId: string) => {
    setDeletingMemberId(memberId);
    try {
      const response = await GroupRepository.deleteUserGroup(memberId, groupId as string);
      if (response.status === 200) {
        setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
        console.log(`Member ${memberId} deleted successfully.`);
      } else {
        console.error('Failed to delete member:', response);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setDeletingMemberId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Welcome back, nice to meet you again</h1>
            </div>

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-700">Group Members</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Thêm thành viên
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                    {/* <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th> */}
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((member) => (
                    <tr className="group hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4">
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
                          {/* <img src='https://lh3.googleusercontent.com/a/ACg8ocIS_i-k6VTmH_yDMV5GE67pVgoF7zj48HzYpKJfTc4f6GckSg=s96-c'></img> */}
                          <span className="ml-3 text-sm font-medium text-gray-900">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{member.role}</span>
                      </td>
                      {/* <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            member.status === 'Active'
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {member.status}
                        </span>
                      </td> */}
                      <td className="px-6 py-4">
                        {isLeader && member.role !== 'Leader' && (  
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
                            disabled={deletingMemberId === member.id}
                        >
                          {deletingMemberId === member.id ? 'Deleting...' : 'Delete'}
                        </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <InviteMemberModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupId={groupId as string}
      />
    </div>
  );
} 