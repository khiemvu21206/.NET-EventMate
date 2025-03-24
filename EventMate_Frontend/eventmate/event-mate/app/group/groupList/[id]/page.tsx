"use client";
import React from 'react';  
import GroupList from '../../../../components/group/test'; // Adjust the path as necessary  
import { useParams } from 'next/navigation';  

const App: React.FC = () => {  
    const params = useParams();  
    const id = typeof params.id === 'string' ? params.id : ''; //Safely access groupId  
  return (  
    <div>  
      <h1>Group Lists</h1>  
      <GroupList userId={id}/>  
    </div>  
  );  
};  

export default App;  

// Component for Navigation Buttons  

{/* <Router>  
      <div>  
        
        <NavigationButtons />  
        
        <Routes>  
          <Route   
            path="/group/send-invitation/:groupId/:senderId"   
            element={<SendInvitation params={{  
              groupId: 'AC606ACD-2827-455E-9510-65992299CA60',  
              senderId: '9D0EB9A4-9810-4B29-B952-515BF39050EC',  
              email: 'khiemvu08@gmail.com'  
            }} />}   
          />  
          <Route   
            path="/group/accept-invitation/:groupId/:userId"   
            element={<AcceptInvitation params={{  
              groupId: 'AC606ACD-2827-455E-9510-65992299CA60',  
              userId: '171CAA9A-E8CF-4466-A625-08DD5A184BE1'  
            }} />}   
          />  
        </Routes>  
      </div>  
    </Router>   */}
