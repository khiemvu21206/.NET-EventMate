
// "use client";
// import React from 'react';  
// import Group from '@/components/group/GroupDetail'; // Adjust the path as necessary  

// const App: React.FC = () => {  
//   return (  
//     <div>  
//       <h1>Group Details</h1>  
//       <Group/>  
//     </div>  
//   );  
// };  

// export default App;  
"use client";  
import React from 'react';  
import Group from '@/components/group/GroupDetail'; // Adjust the path as necessary  
import ReceiveInvitation from '@/components/group/ReceiveInvitation'; // Adjust the path as necessary  
import { useParams } from 'next/navigation';  

const App: React.FC = () => {  
  const params = useParams();  
  const groupId = typeof params.groupId === 'string' ? params.groupId : ''; //Safely access groupId  

  return (  
    <div>    
      <Group />  
      <h2>Receive Invitation</h2>  
      {groupId && <ReceiveInvitation groupId={groupId} />}  
    </div>  
  );  
};  

export default App;  