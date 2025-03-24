// src/repositories/GroupRepository.ts  
import createRepository from '@/ultilities/createRepository';  
interface TimelineCreateData {
    title: string;
    description: string;
    schedule: string;
    groupId: string;
    status: number;
}
interface TimelineUpdateData {
    planId: string;
    title: string;
    description: string;
    schedule: string;
    groupId: string;
    status: number;
}
interface CreateActivity {
    planId: string;
    content: string;
    schedule: string;
    createdBy: string;
    category: string;
    status: number;
}
interface EditActivity {
    activityId: string;
    content: string;
    schedule: string;
    category: string;
    status: number;
}
export const PlanRepository = createRepository({  
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
    getListPlan: async (fetch, groupId: string) => {
        const response = await fetch(`https://localhost:7121/api/Plan/getListPlan/${groupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
            },
        });
        const data = await response;
        return data;
    },
    createPlan: async (fetch, planData: TimelineCreateData) => {
        const response = await fetch('https://localhost:7121/api/Plan', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(planData),
        });
        return response;
    },
    updatePlan: async (fetch, planData: TimelineUpdateData) => {
        const response = await fetch('https://localhost:7121/api/Plan', {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(planData),
        });
        return response;
    },
    deletePlan: async (fetch, planId: string) => {
        const response = await fetch(`https://localhost:7121/api/Plan/${planId}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
            },
        });
        return response;
    },
    createActivity: async (fetch, activityData: CreateActivity) => {
        const response = await fetch('https://localhost:7121/api/Plan/activities', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(activityData),
        });
        return response;
    },
    updateActivity: async (fetch, activityData: EditActivity) => {
        const response = await fetch('https://localhost:7121/api/Plan/activities', {
            method: 'PUT',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(activityData),
        });
        return response;
    },
    deleteActivity: async (fetch, activityId: string) => {
        const response = await fetch(`https://localhost:7121/api/Plan/activities/${activityId}`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
            },
        });
        return response;
    },
    //  const apiUrl = `https://localhost:7121/api/Group/getAllRequest/${id}`;  

});  