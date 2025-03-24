'use client';  

import { useState, useEffect, useCallback, CSSProperties } from 'react';  
import { useUserContext } from '@/providers/UserProvider';  
import { useRouter, useParams } from 'next/navigation';  
import Navbar from '@/components/group/Navbar';  
import { UserCircleIcon } from '@heroicons/react/24/outline';  
import { GroupRepository } from '@/repositories/GroupRepository'; // Import GroupRepository  

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
    place:string;
}  

interface UserData {  
    userId: string;  
    fullName: string;  
    dateOfBirth: string | null;  
    avatar: string;  
    email: string;  
    license: string | null;  
    companyName: string | null;  
    address: string | null;  
    phone: string | null;  
    status: number;  
}  

// Group Repository - REMOVED FROM HERE  

export default function GroupDetailPage() {  
    const router = useRouter();  
    const { email, name, role, avatar: userAvatar, logout, id } = useUserContext();  
    const params = useParams();  
    const groupId: string = typeof params.groupId === 'string' ? params.groupId : (Array.isArray(params.groupId) ? params.groupId[0] : "");  
    const [groupData, setGroupData] = useState<GroupData | null>(null);  
    const [users, setUsers] = useState<UserData[] | null>(null);  
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState<Error | null>(null);  
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);  

    const fetchGroupDetails = useCallback(async () => {  
        setLoading(true);  
        try {  
            // Use GroupRepository to fetch group details  
            const groupResponse = await GroupRepository.findGroup(groupId);  

            if (groupResponse.status!=200) {  
                throw new Error(`HTTP error! Status: ${groupResponse.status}`);  
            }  
            const groupDetails = (await groupResponse).data as GroupData;  
            setGroupData(groupDetails);  

            // Use GroupRepository to fetch users in the group  
            const usersResponse = await GroupRepository.listUsersInGroup( groupId);  
            if (usersResponse.status!=200) {  
                throw new Error(`HTTP error! Status: ${usersResponse.status}`);  
            }  
            const usersData = (await usersResponse).data as UserData[];  
            setUsers(usersData);  

            setError(null);  
        } catch (error) {  
            console.error("Failed to fetch data:", error);  
            setError(error instanceof Error ? error : new Error('An unexpected error occurred'));  
            setGroupData(null);  
            setUsers(null);  
        } finally {  
            setLoading(false);  
        }  
    }, [groupId]);  

    useEffect(() => {  
        if (groupId) {  
            fetchGroupDetails();  
        }  
    }, [groupId, fetchGroupDetails]);  

    const handleDeleteUser = async (userId: string) => {  
        setDeletingUserId(userId);  
        try {  
            // Use GroupRepository to delete user from group  
            const deleteResponse = await GroupRepository.deleteUserGroup(userId, groupId);  

           

            setUsers((prevUsers) => prevUsers ? prevUsers.filter((user) => user.userId !== userId) : []);  

            console.log(`User ${userId} deleted successfully.`);  
        } catch (error) {  
            console.error("Error deleting user:", error);  
            setError(error instanceof Error ? error : new Error('Failed to delete user'));  
            fetchGroupDetails();  
        } finally {  
            setDeletingUserId(null);  
        }  
    };  

    if (loading) {  
        return <p>Loading group details and users...</p>;  
    }  

    if (error) {  
        return <p>Error: {error.message}</p>;  
    }  

    if (!groupData) {  
        return <p>Group not found.</p>;  
    }  

    return (  
        <div className="flex min-h-screen bg-white">  
            <Navbar />  
            <div className="flex-1 p-8">  
                <div className="max-w-4xl mx-auto">  
                    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-6">  
                        <div className="mb-6">  
                            <h1 className="text-2xl font-bold text-gray-800">Group Details</h1>  
                        </div>  

                        <div className="flex justify-between items-center mb-6">  
                            <h2 className="text-lg font-medium text-gray-700">Users in Group</h2>  
                        </div>  

                        <div className="overflow-x-auto">  
                            <table className="w-full">  
                                <thead>  
                                    <tr className="border-b border-gray-100">  
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>  
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>  
                                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>  
                                    </tr>  
                                </thead>  
                                <tbody className="divide-y divide-gray-100">  
                                    {users && users.map((user) => (  
                                        <tr key={user.userId} className="group hover:bg-gray-50 transition-colors duration-150">  
                                            <td className="px-6 py-4">  
                                                <div className="flex items-center">  
                                                    {user.avatar ? (  
                                                        <img  
                                                            src={user.avatar}  
                                                            alt={user.fullName}  
                                                            className="w-8 h-8 rounded-full bg-gray-100"  
                                                        />  
                                                    ) : (  
                                                        <UserCircleIcon className="w-8 h-8 text-gray-400" />  
                                                    )}  
                                                    <span className="ml-3 text-sm font-medium text-gray-900">  
                                                        {user.fullName}  
                                                    </span>  
                                                </div>  
                                            </td>  
                                            <td className="px-6 py-4">  
                                                <span className="text-sm text-gray-600">{user.email}</span>  
                                            </td>  
                                            <td className="px-6 py-4">  
                                                <button  
                                                    onClick={() => handleDeleteUser(user.userId)}  
                                                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"  
                                                    disabled={deletingUserId === user.userId}  
                                                >  
                                                    {deletingUserId === user.userId ? 'Deleting...' : 'Delete'}  
                                                </button>  
                                            </td>  
                                        </tr>  
                                    ))}  
                                </tbody>  
                            </table>  
                        </div>  
                    </div>  
                </div>  
            </div>  
        </div>  
    );  
}  