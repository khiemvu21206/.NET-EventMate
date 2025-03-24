'use client';  

import React, { useEffect, useState } from 'react';  
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js  
import { useUserContext } from '@/providers/UserProvider';

// Define the interface for a group object  
interface Group {  
  groupId: string;  
  img: string | null;  
  groupName: string;  
  createdAt: string;  
  totalMember: number;  
}  

const GroupList: React.FC = () => {  
    const { id, email } = useUserContext();  
  const router = useRouter(); // Initialize the router  
  const [groups, setGroups] = useState<Group[]>([]);  
  const [searchTerm, setSearchTerm] = useState('');  
  const [sortBy, setSortBy] = useState<'groupname' | 'createdat'>('groupname');  
  const [ascending, setAscending] = useState(true);  
  const [currentPage, setCurrentPage] = useState(1);  
  const [totalCount, setTotalCount] = useState(0);  
  const pageSize = 5;  

  const fetchGroups = async () => {  
                  console.log(id);
    const response = await fetch('https://localhost:7121/api/Group/getAllGroupByUserId/'+id, {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
      },  
      body: JSON.stringify({  
        searchTerm,  
        sortBy,  
        ascending,  
        currentPage,  
        pageSize,  
      }),  
    });  

    if (response.ok) {  
      const data = await response.json();  
      setGroups(data.data.data);  
      setTotalCount(data.data.totalCount);  
    } else {  
      console.error('Failed to fetch groups');  
    }  
  };  

  useEffect(() => {  
    fetchGroups();  
  }, [searchTerm, sortBy, ascending, currentPage]);  

  const handlePageChange = (page: number) => {  
    setCurrentPage(page);  
  };  

  const totalPages = Math.ceil(totalCount / pageSize);  

  return (  
    <div>  
      <h1>Group List</h1>  

      <div>  
        <input  
          type="text"  
          placeholder="Search by group name"  
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}  
        />  

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'groupname' | 'createdat')}>  
          <option value="groupname">Group Name</option>  
          <option value="createdat">Created At</option>  
        </select>  
        
        <label>  
          Ascending  
          <input  
            type="checkbox"  
            checked={ascending}  
            onChange={(e) => setAscending(e.target.checked)}  
          />  
        </label>  
      </div>  

      <div>  
        {groups.map((group) => (  
          <div key={group.groupId} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>  
            <img src={group.img || 'default-image-url.jpg'} alt={group.groupName} style={{ width: '50px', height: '50px', marginRight: '10px' }} />  
            <div onClick={() => router.push(`/group/group-detail/${group.groupId}`)} style={{ cursor: 'pointer' }}
              >  
              <h3>{group.groupName}</h3>  
              <p>Created At: {new Date(group.createdAt).toLocaleDateString()}</p>  
              <p>Total Members: {group.totalMember}</p>  
            </div>  
          </div>  
        ))}  
      </div>  

      <div>  
        <button   
          disabled={currentPage === 1}   
          onClick={() => handlePageChange(currentPage - 1)}  
        >  
          Previous  
        </button>  
        
        <span>{currentPage} of {totalPages}</span>  
        
        <button   
          disabled={currentPage === totalPages}   
          onClick={() => handlePageChange(currentPage + 1)}  
        >  
          Next  
        </button>  
      </div>  
    </div>  
  );  
};  

export default GroupList;  
