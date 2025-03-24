"use client";  

import { useUserContext } from '@/providers/UserProvider';  
import { useRouter } from 'next/navigation';  
import React, { useState, useEffect } from 'react';  
import { GroupRepository } from '@/repositories/GroupRepository'; // Import GroupRepository  

interface ReceiveInvitationProps {  
    groupId: string;  
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

const ReceiveInvitation = ({ groupId }: ReceiveInvitationProps) => {  
    const router = useRouter();  
    const [email, setEmail] = useState('');  
    const { logout, id } = useUserContext();  
    const [isLoading, setIsLoading] = useState(false);  
    const [error, setError] = useState<string | null>(null);  
    const [existingUsers, setExistingUsers] = useState<UserData[] | null>(null);  
    const [validationError, setValidationError] = useState<string | null>(null); // New state for validation error  

    // Fetch existing users in the group  
    useEffect(() => {  
        const fetchExistingUsers = async () => {  
            try {  
                const usersResponse = await GroupRepository.listUsersInGroup(groupId);  
                if (usersResponse.status != 200) {  
                    throw new Error(`Failed to fetch users: ${usersResponse.status}`);  
                }  
                const usersData = usersResponse.data as UserData[];  
                setExistingUsers(usersData);  
            } catch (err: any) {  
                console.error('Error fetching existing users:', err);  
                setError(err.message || 'Failed to fetch existing users.');  
            }  
        };  

        fetchExistingUsers();  
    }, [groupId]);  

    // Email Validation  
    useEffect(() => {  
        if (!email) {  
            setValidationError(null); // Clear error when email is empty  
            return;  
        }  

        if (!isValidEmail(email)) {  
            setValidationError('Please enter a valid email address.');  
            return;  
        }  

        if (existingUsers) {  
            const emailExists = existingUsers.some((user) => user.email === email);  
            if (emailExists) {  
                setValidationError('This email is already a member of the group.');  
            } else {  
                setValidationError(null); // Clear error if email is valid and not in the group  
            }  
        }  
    }, [email, existingUsers]);  

    // Email validation helper function  
    const isValidEmail = (email: string) => {  
        // Basic email validation regex  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
        return emailRegex.test(email);  
    };  

    const handleAccept = async () => {  
        setIsLoading(true);  
        setError(null);  

        if (validationError) {  
            setError("Please correct the email before sending the invitation.");  
            setIsLoading(false);  
            return;  
        }  

        if (!email) {  
            setError("Please enter an email address.");  
            setIsLoading(false);  
            return;  
        }  

        const apiUrl = `https://localhost:7121/api/Group/requestCreate?groupId=${groupId}&senderId=${id}&email=${email}`;  

        try {  
            const response = await fetch(apiUrl, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
            });  

            if (!response.ok) {  
                const errorData = await response.json(); // Try to get more specific error info  
                throw new Error(`Failed to accept invitation: ${response.status} - ${errorData.message || 'Unknown error'}`);  
            }  

            const data = await response.json();  
            console.log('Invitation accepted successfully:', data);  
            alert('Invitation request sent successfully!'); // Changed alert message  
            // router.push('/success-receive');  
        } catch (err: any) {  
            console.error('Error accepting invitation:', err);  
            setError(err.message || 'Failed to accept invitation.');  
            alert(`Failed to request invitation: ${err.message}`); // Changed alert message  
        } finally {  
            setIsLoading(false);  
        }  
    };  

    return (  
        <div>  
            {/* <h1>Accept Invitation</h1>  
            <p>Group ID: {groupId}</p>  
            <p>Sender ID (Your ID): {id}</p>   */}
            <br />  

            <label htmlFor="email">Enter the email address to invite:</label>  
            <input  
                type="email"  
                id="email"  
                value={email}  
                onChange={(e) => setEmail(e.target.value)}  
                required  
            />  
            {validationError && <p style={{ color: 'red' }}>{validationError}</p>} {/* Display validation error */}  
            <br />  
            <br />  

            <button onClick={handleAccept} disabled={isLoading || validationError !== null}>  
                {isLoading ? 'Sending...' : 'Send Invitation'}  
            </button>  

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}  
        </div>  
    );  
};  

export default ReceiveInvitation;  