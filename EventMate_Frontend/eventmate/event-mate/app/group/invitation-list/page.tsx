"use client";
import InvitationList from '../../../components/group/InvitationList'; // Adjust the path as necessary  
import { useUserContext } from '@/providers/UserProvider';  

const App: React.FC = () => {  
    const { email, name, role, avatar, logout, id } = useUserContext();  
    if(!email){
        return(
            <div>  
              <h1>Your Request not available +${email}</h1>  
              <br></br>
            </div>  
        )
    }else{
        return (  
          
            <div>  
            <div className="container mx-auto p-6 max-w-6xl">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh sách lời mời vào nhóm</h1>
                  <div className="flex flex-col space-y-4">                  
                  <InvitationList/> 
                  </div>
                </div>
               
            </div>  
          );  
    }
  
};  
export default App;  
// pages/invitations/page.tsx  
// app/invitations/page.tsx  
// import React, { useEffect, useState } from 'react';  
// import { useUserContext } from '@/providers/UserProvider';  
// import { useRouter } from 'next/navigation';  

// interface Invitation {  
//     RequestId: string;  
//     GroupId: string;  
//     Sender: {  
//         FullName: string;  
//         Email: string;  
//     };  
// }  

// const InvitationsPage = () => {  
//     const { email, name, role, avatar, logout, id } = useUserContext();  
//     const [invitations, setInvitations] = useState<Invitation[]>([]);  
//     const [loading, setLoading] = useState<boolean>(true);  
//     const [error, setError] = useState<string | null>(null);  
//     const router = useRouter();  

//     useEffect(() => {  
//         // Function to fetch invitations  
//         const fetchInvitations = async () => {  
//             if (!id || !email) {  
//                 setError('User ID or email is not available');  
//                 setLoading(false);  
//                 return;  
//             }  

//             const apiUrl = `https://localhost:7121/api/Group/getAllRequest/${id}`;  
//             console.log("Calling API:", apiUrl);  

//             setLoading(true);  
//             try {  
//                 const response = await fetch(apiUrl, {  
//                     method: 'GET',  
//                     headers: {  
//                         'Content-Type': 'application/json',  
//                     },  
//                 });  

//                 if (!response.ok) {  
//                     throw new Error(`HTTP error! status: ${response.status}`);  
//                 }  

//                 const data = await response.json();  
                
//                 if (data.Status === 200) {  
//                     setInvitations(data.Data.$values);  
//                 } else {  
//                     setError('Failed to fetch invitations');  
//                 }  
//             } catch (err) {  
//                 setError(`An error occurred while fetching invitations: ${err}`);  
//             } finally {  
//                 setLoading(false);  
//             }  
//         };  

//         fetchInvitations();  
//     }, [id, email]); // Dependency on id and email  

//     // Loading indicator  
//     if (loading) {  
//         return <div>Loading invitations...</div>;  
//     }  

//     // Error handling  
//     if (error) {  
//         return <div>  
//             <h1>{error} (User ID: {id}, Email: {email})</h1>  
//         </div>;  
//     }  

//     // Invitations display  
//     return (  
//         <div>  
//             <h2>Invitations</h2>  
//             {invitations.length > 0 ? (  
//                 <ul>  
//                     {invitations.map((invitation) => (  
//                         <li key={invitation.RequestId}   
//                             onClick={() => router.push(`/group/accept-invitation/${invitation.GroupId}/${email}`)}   
//                             style={{ cursor: 'pointer' }}  
//                         >  
//                             <div>  
//                                 <strong>Group ID:</strong> {invitation.GroupId}  
//                             </div>  
//                             <div>  
//                                 <strong>Request ID:</strong> {invitation.RequestId}  
//                             </div>  
//                             <div>  
//                                 <strong>Sender Name:</strong> {invitation.Sender?.FullName || 'N/A'}  
//                             </div>  
//                             <div>  
//                                 <strong>Sender Email:</strong> {invitation.Sender?.Email || 'N/A'}  
//                             </div>  
//                             <hr />  
//                         </li>  
//                     ))}  
//                 </ul>  
//             ) : (  
//                 <div>No invitations found.</div>  
//             )}  
//         </div>  
//     );  
// };  

// export default InvitationsPage;  