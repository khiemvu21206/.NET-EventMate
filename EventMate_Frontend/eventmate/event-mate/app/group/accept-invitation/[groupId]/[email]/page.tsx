"use client"; // Indicate this component is a client component  

import { useUserContext } from '@/providers/UserProvider';  
import { useRouter } from 'next/navigation';  
import React, { useState, useEffect } from 'react';  

interface Group {  
  groupId: string;  
  img: string;  
  groupName: string;  
  createdAt: string;  
  eventId: string;  
  totalMember: number;  
  leader: string;
  leaderEmail:string;
  leaderName:string;  
  eventName:string;  
  description: string;  
  visibility: number;  
  status: number;  
  events: null;  
  user: null;  
  plans: null;  
  conversation: null;  
  requests: null;  
  user_Groups: null;  
  multimedia: null;  
}  

const AcceptInvitationPage = (props: { params: Promise<{ groupId: string; email: string }> }) => {  
  const router = useRouter();  
  const params = React.use(props.params); // Unwrap the params Promise  
  const { email, name, role, avatar, logout, id } = useUserContext();  
  const [group, setGroup] = useState<Group | null>(null);  
  const [loading, setLoading] = useState(true);  

  useEffect(() => {  
    const fetchGroupData = async () => {  
      if (params?.groupId) {  
        try {  
          const response = await fetch(`https://localhost:7121/api/Group/findGroup/${params.groupId}`);  
          if (!response.ok) {  
            throw new Error('Failed to fetch group data');  
          }  
          const data = await response.json();  
          setGroup(data.data);  
        } catch (error) {  
          console.error('Error fetching group data:', error);  
          // Handle error appropriately, e.g., display an error message to the user  
        } finally {  
          setLoading(false);  
        }  
      }  
    };  

    fetchGroupData();  
  }, [params?.groupId]);  

  const deleteInvitationRequest = async () => {  
    const deleteApiUrl = `https://localhost:7121/api/Group/DeleteRequest/${id}/${params.groupId}`;  

    try {  
      const response = await fetch(deleteApiUrl, {  
        method: 'DELETE', // Use DELETE method  
        headers: {  
          'Content-Type': 'application/json',  
        },  
      });  

      if (!response.ok) {  
        console.error('Failed to delete invitation request:', response.status);  
        // Optionally, show an error message to the user, but non-blocking  
      } else {  
        console.log('Invitation request deleted successfully.');  
      }  
    } catch (error) {  
      console.error('Error deleting invitation request:', error);  
      // Optionally, show an error message to the user, but non-blocking  
    }  
  };  


  const handleAccept = async () => {  

    const apiUrl = `https://localhost:7121/api/Group/add-user-to-group/${params.groupId}/${id}`;  

    try {  
      const response = await fetch(apiUrl, {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
      });  

      if (!response.ok) throw new Error('Failed to accept invitation.');  

      const data = await response.json();  
      console.log('User accepted successfully:', data);  
      alert('User accepted successfully!');  

      // Navigate to a success page  
      router.push('/group/member/'+params.groupId);
      router.refresh();
    } catch (error) {  
      console.error('Error accepting invitation:', error);  
      alert('Failed to accept invitation.');  
    } finally {  
      // Always delete the invitation request, regardless of accept success/failure  
      deleteInvitationRequest();  
    }  
  };  

  const handleCancel = () => {  
    deleteInvitationRequest(); // Delete the request on cancel  
    router.push('/group/invitation-list');
    router.refresh();
 // Navigate to another page in Next.js  
  };  

  if (loading) {  
    return <div>Loading...</div>;  
  }  

  if (!group) {  
    return <div>Error: Could not load group data.</div>;  
  }  

  return (  
    <div>  
      <div className="container mx-auto p-6 max-w-3xl bg-white shadow-lg rounded-2xl border border-gray-200">  
        <button  
          onClick={() => router.back()}  
          className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"  
        >  
          ← Quay lại  
        </button>  

        <div className="flex flex-col items-center text-center">  
          <img className="w-32 h-32 object-cover rounded-full border-4 border-gray-300" src={group.img} alt="Group Avatar" />  
          <h1 className="text-2xl font-bold text-gray-800 mt-4">{group.groupName}</h1>  
          <p className="text-gray-600">Leader: <span className="font-medium">{group.leaderName}</span></p>  
        </div>  

        <div className="mt-6 space-y-3">  
          <p className="text-gray-700">Sự kiện liên quan: <span className="font-medium">{group.eventName}</span></p>  
          <p className="text-gray-700">Mô tả: {group.description}</p>  
        </div>  

        {/*   <div className="mt-6">  
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Thành viên trong nhóm</h2>  
          <ul className="bg-gray-100 p-4 rounded-lg">  
            {group.members.map(member => (  
              <li key={member.id} className="text-gray-700 py-1">{member.name}</li>  
            ))}  
          </ul>  
        </div> */}  

        <div className="mt-6 flex justify-center space-x-4">  
          <button onClick={handleAccept} className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition shadow-md">  
            Tham gia nhóm  
          </button>  
          <button onClick={handleCancel} className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition shadow-md">  
            Từ chối  
          </button>  
        </div>  
      </div>
      
    </div>  
  );  
};  

// This export handles the parameter passing from the routing system  
export default AcceptInvitationPage;  