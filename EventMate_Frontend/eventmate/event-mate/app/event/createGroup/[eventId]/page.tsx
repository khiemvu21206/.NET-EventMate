'use client'
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FaUpload, FaTimes, FaUserPlus, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Image from 'next/image';
import { GroupRepository } from '@/repositories/GroupRepository';
import { FriendRepository } from '@/repositories/FriendRepository';
import { useParams, useRouter } from 'next/navigation';
import { useUserContext } from "@/providers/UserProvider";
import { group } from 'console';
import { JsonHubProtocol } from '@microsoft/signalr';


interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
}
interface Group {
  img: File | null;
  GroupName: string;
  CreatedAt: Date;
  EventId: string;
  TotalMember: number;
  Leader: string;
  Description: string | null;
  Visibility: number; // 0-private 1-public
  Status: number;
}
interface GroupCreateData {
  Img: File | null;
  GroupName: string;
  CreatedAt: Date;
  EventId: string;
  TotalMember: number;
  Leader: string;
  Description: string | null;
  Visibility: number; // 0-private 1-public
  Status: number;
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

export default function CreateGroupPage() {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const router = useRouter();
  const eventId = useParams().eventId;
  const { logout, id: leaderId, email, status } = useUserContext();
  const [group, setGroup] = useState<Group>({
    img: null,
    GroupName: 'khiem',
    CreatedAt: new Date(Date.now()),
    EventId: eventId as string,
    TotalMember: 1, 
    Leader: '',
    Description: 'dwadwadawdad',
    Visibility: 0, // Default to private
    Status: 1 // Assuming 0 is the default status
  });

  const [groupData, setGroupData] = useState<GroupCreateData>({
    Img: null,
    GroupName: '',
    CreatedAt: new Date(Date.now()),
    EventId: eventId as string,
    TotalMember: 0,
    Leader: '',
    Description: '',
    Visibility: 0, // Default to private
    Status: 0, // Assuming 0 is the default status
  });

  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [suggestedFriends, setSuggestedFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const formData = new FormData();

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await GroupRepository.getEventById(eventId as string);
      if (response.status === 200) {
        setEventData(response.data);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    const fetchSuggestedFriends = async () => {
      try {
        const response = await FriendRepository.getListFriends({
          currentPage: 1,
          pageSize: 10,
          keySearch: ''
        });

        if (response?.data) {
          const friends = response.data.data.map((friend: any) => ({
            id: friend.friend.userId,
            username: friend.friend.fullName,
            email: friend.friend.email,
            avatar: friend.friend.avatar
          }));
          setSuggestedFriends(friends);
        }
      } catch (error) {
        console.error('Error fetching suggested friends:', error);
      }
    };

    fetchSuggestedFriends();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      //alert('file: ' + file.name + ' type: ' + file.type);
      setGroupData(prevData => ({
        ...prevData,
        Img: file,
        Description: 'Xin chào, mời bạn vào nhóm mình nhé!'
      }));
      setGroup(prevData => ({
        ...prevData,
        img: file,
      }));
      // Need to check if Img exists before creating URL
    }
  };

  const handleInviteUser = (user: User) => {
    if (!invitedUsers.find(u => u.id === user.id)) {
      setInvitedUsers([...invitedUsers, user]);
    }
  };

  const handleRemoveInvited = (userId: number) => {
    setInvitedUsers(invitedUsers.filter(user => user.id !== userId));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (group?.img) {
      //alert('groupImg: ' + group?.imgURL + 'groupImg: ' + group?.img);
      formData.append('Img', group.img, group.img.name);
    }
    formData.append('GroupName', groupData.GroupName);
    formData.append('CreatedAt', groupData.CreatedAt.toISOString());
    formData.append('EventId', groupData.EventId);
    formData.append('TotalMember', '1');
    formData.append('Leader', leaderId);
    formData.append('Description', groupData.Description || '');
    formData.append('Visibility', groupData.Visibility.toString());
    formData.append('Status', '0'); // Assuming 0 is the default status
    // const formDataEntries = Array.from(formData.entries());
    // const formDataString = formDataEntries.map(([key, value]) => `${key}: ${value}`).join('\n');
    try {
      const response = await fetch('https://localhost:7121/api/Group/AddGroup', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const groupId = await response.json();
        await sendInvitations(groupId.data);
        router.push(`/group/member/${groupId.data}`);
      } else {
        alert('Failed to add group' + response.status + " " + response.statusText);
      }
    } catch (error) {
      alert('Error adding group:' + error);
    }
  };

  const sendInvitations = async (groupId: string) => {
    try {
      for (const user of invitedUsers) {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/requestCreate?groupId=${groupId}&senderId=${leaderId}&email=${user.email}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to send invitation to ${user.email}`);
        }
      }
      alert(`Invitations sent to ${invitedUsers.length} users`);
    } catch (error) {
      console.error('Error sending invitations:', error);
      alert('Failed to send invitations.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Group Space</h1>
            <p className="mt-1 text-sm text-gray-500">Create a new group for your event and invite members</p>
          </div>

          <div className="flex gap-8">
            {/* Left Column - Event Details */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                      <img className='w-full h-full object-cover'
                        src={eventData?.img || "/events/summer-festival.jpg"}
                        alt={eventData?.name || "Summer Music Festival 2024"}
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {eventData?.name || "Summer Music Festival 2024"}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{eventData?.timeStart} - {eventData?.timeEnd}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{eventData?.place || "Central Park, New York"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaUsers className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{eventData?.status === 1 ? "Live" : "Upcoming"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advertisement Banner */}
                <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="/ads/event-banner.jpg"
                      alt="Advertisement"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">Sponsored</h3>
                    <p className="mt-1 text-sm text-gray-500">Discover more events in your area</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Create Group Form */}
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Group Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Group Image</label>
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors">
                          {groupData.Img ? (
                            <>
                              <Image
                                src={URL.createObjectURL(groupData.Img)}
                                alt="Group"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => setGroupData({ ...groupData, Img: null })}
                                className="absolute top-2 right-2 p-1 bg-gray-900/70 rounded-full text-white hover:bg-gray-900"
                              >
                                <FaTimes size={12} />
                              </button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                              <FaUpload className="w-6 h-6 text-gray-400" />
                              <span className="mt-2 text-xs text-gray-500">Upload Image</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg, image/jpg, image/gif, image/png"
                                onChange={handleImageChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Group Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Group Name</label>
                        <input
                          type="text"
                          value={groupData.GroupName}
                          onChange={(e) => setGroupData({ ...groupData, GroupName: e.target.value })}
                          className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition-colors"
                          placeholder="Enter group name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
                        <textarea
                          value={groupData.Description || ''}
                          onChange={(e) => setGroupData({ ...groupData, Description: e.target.value })}
                          rows={4}
                          className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition-colors resize-none"
                          placeholder="Describe your group"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900">Invite Members</h3>
                      {/* <div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 text-sm transition-colors"
                          placeholder="Search users by username or email"
                        />
                      </div> */}

                      {invitedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                          {invitedUsers.map(user => (
                            <div
                              key={user.id}
                              className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200"
                            >
                              <span className="text-sm text-gray-700">{user.username}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveInvited(user.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <FaTimes size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Suggested Friends</h4>
                        <div className="space-y-2">
                          {suggestedFriends
                            .filter(friend => !invitedUsers.find(u => u.id === friend.id))
                            .map(friend => (
                              <div
                                key={friend.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative">
                                    <Image
                                      src={friend.avatar}
                                      alt={friend.username}
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{friend.username}</p>
                                    <p className="text-sm text-gray-500">{friend.email}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleInviteUser(friend)}
                                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                                >
                                  <FaUserPlus size={16} />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-100">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Create Group Space
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 