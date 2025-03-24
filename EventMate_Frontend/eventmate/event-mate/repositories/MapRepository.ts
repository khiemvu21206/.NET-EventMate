// src/repositories/GroupRepository.ts  
import createRepository from '@/ultilities/createRepository';  

export const MapRepository = createRepository({  
    findGroup: async (fetch, groupId: string) => {  
        const response = await fetch(`https://localhost:7121/api/Group/findGroup/${groupId}`);  
        return response;  
    },  
    listUsersInGroup: async (fetch, groupId: string) => {  
        const response = await fetch(`https://localhost:7121/api/Group/list-users-in-group/${groupId}`,{  
            method: 'GET', // Specify the request method  
            headers: {  
              'Content-Type': 'application/json',  
              'Cache-Control': 'no-cache, no-store, must-revalidate',  
              'Pragma': 'no-cache',  
              'Expires': '0',  
               // Set appropriate headers  
            },  
    
          });  
        return response;  
    },  
    deleteUserGroup: async (fetch, userId: string, groupId: string) => {  
        const response = await fetch(`https://localhost:7121/api/Group/DeleteUserGroup/${userId}/${groupId}`, {  
            method: 'DELETE',  
        });  
        return response;  
    },  
    listInvitation: async (fetch, id: string) => {  
        const response = await fetch(`https://localhost:7121/api/Group/getAllRequest/${id}`,{  
            method: 'GET', // Specify the request method  
            headers: {  
                'Content-Type': 'application/json',  
                'Cache-Control': 'no-cache, no-store, must-revalidate',  
                'Pragma': 'no-cache',  
                'Expires': '0',  
                 // Set appropriate headers  
              },  
          });  
        return response;  
    },
    getAllGroupByUserId: async (  
        fetch,  
        userId: string,  
        searchTerm: string,  
        sortBy: string,  
        ascending: boolean,  
        currentPage: number,  
        pageSize: number  
    ) => {  
        const response = await fetch(  
            `https://localhost:7121/api/Group/getAllGroupByUserId/${userId}`,  
            {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                data: JSON.stringify({  
                    searchTerm,  
                    sortBy,  
                    ascending,  
                    currentPage,  
                    pageSize,  
                }),  
            }  
        );  
        return response;  
    },  
    fetchHotels: async (fetch, lat: number, lng: number) => {  
        const response = await fetch(`https://localhost:7121/api/Map/hotels?lat=${lat}&lng=${lng}`);  
        const data = await response;  
        return data;  
    },  
    //  const apiUrl = `https://localhost:7121/api/Group/getAllRequest/${id}`;  

});  