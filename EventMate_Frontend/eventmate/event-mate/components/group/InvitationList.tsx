"use client";

import React, { useEffect, useState } from 'react';
import { useUserContext } from '@/providers/UserProvider';
import { useRouter } from 'next/navigation';
import { GroupRepository } from '@/repositories/GroupRepository';
import { toast } from 'react-toastify'; // Import toast  
import 'react-toastify/dist/ReactToastify.css';

interface Sender {
  userId: string;
  fullName: string;
  email: string;
}

interface Group {
  groupId: string;
  groupName: string;
  img: string;
}

interface Invitation {
  requestId: string;
  groupId: string;
  senderId: string;
  sentAt: string;
  requestType: number;
  status: number;
  sender: Sender;
  group: Group;
}

const InvitationList: React.FC = () => {
  const { id, email } = useUserContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitations = async () => {
      setLoading(true);
      try {
        console.log(id);
        const response = await GroupRepository.listInvitation(id);

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response;

        if (data.status === 200) {
          setInvitations(data.data);
        } else {
          setError('There is no Invitation');
        }
      } catch (err) {
        setError(`There is no Invitation`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, [id]); //  Dependency array should only contain 'id'  

  const handleAccept = async (groupId: string) => {
    setLoading(true); // Start loading  
    const apiUrl = `https://localhost:7121/api/Group/add-user-to-group/${groupId}/${id}`;
    const deleteApiUrl = `https://localhost:7121/api/Group/DeleteRequest/${id}/${groupId}`; // Define delete API here  

    try {
      // Accept the invitation  
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to accept invitation: ${response.status}`);
      }

      const data = await response.json();
      console.log('User accepted successfully:', data);
      toast.success('Invitation accepted successfully!'); // Use toast notification  

      // Delete the invitation request after accepting  
      const deleteResponse = await fetch(deleteApiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!deleteResponse.ok) {
        console.error('Failed to delete invitation request:', deleteResponse.status);
        toast.error('Failed to delete invitation request.'); // Use toast notification  
      } else {
        console.log('Invitation request deleted successfully.');
      }

      // Update the invitations state to remove the accepted invitation  
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.groupId !== groupId)
      );

      // Navigate to a success page or back to the group list  
      router.push('/group/invitation-list');
      router.refresh();
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(`Failed to accept invitation: ${error.message}`); // Use toast notification  
    } finally {
      setLoading(false); // Stop loading  
    }
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {invitations.length > 0 ? (
        <ul>
          {invitations.map((invitation) => (
            <li key={invitation.requestId}>
              <div className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 flex items-center justify-between border border-gray-200">
                {/* Phần hiển thị ảnh và thông tin nhóm */}
                <div className="flex items-center space-x-4">
                  {/* Ảnh nhóm */}
                  <img
                    className="w-16 h-16 object-cover rounded-full border-2 border-gray-300"
                    src={invitation.group.img}
                    alt="Group Avatar"
                  />
                  {/* Thông tin cơ bản */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">{invitation.group.groupName}</h2>
                    <p className="text-sm text-gray-500">Người gửi {invitation.sender.email || 'N/A'}</p>
                  </div>
                </div>

                {/* Nút thao tác */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/group/accept-invitation/${invitation.groupId}/${email}`)}
                    style={{ cursor: 'pointer' }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
                  >
                    Xem chi tiết
                  </button>
                  {/* <button
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition shadow-md"
                    onClick={() => handleAccept(invitation.groupId)}  // Call handleAccept with the groupId  
                    disabled={loading}
                  >
                    {loading ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => router.push(`/group/groupList/${id}`)}
                    style={{ cursor: 'pointer' }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition shadow-md"
                  >
                    Xem groupList
                  </button> */}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No invitations found.</div>
      )}
    </div>
  );
};

export default InvitationList;  