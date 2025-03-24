// src/repositories/GroupRepository.ts  
import createRepository from '@/ultilities/createRepository';  

interface Cost {
    costId: string;
    amount: number;
    description: string;
    category: string;
    createdAt: string;
    createdBy: string;
    userName: string | null;
    status: number;
}

interface CreateCost {
    activityId: string | null;
    amount: number;
    description: string;
    category: string;
    createdAt: string;
    createdBy: string;
    groupId: string;
    status: number;
}

interface Group {
    img:File | null;
    GroupName: string;
    CreatedAt: Date;
    EventId: string;
    TotalMember: number;
    Leader: string;
    Description: string | null;
    Visibility: number; // 0-private 1-public
    Status: number;
}

interface UpdateCost {
  costId: string;
  amount: number;
  description: string;
  category: string;
  createdAt: string;
  createdBy: string;
  status: number;
}

interface CurrencyRatesResponse {
    date: string;
    base: string;
    rates: {
        [key: string]: [value:string]; // This allows for dynamic keys for different currencies
    };
}

export const GroupRepository = createRepository({  
    findGroup: async (fetch, groupId: string) => {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/findGroup/${groupId}`);  
        return response;  
    },  
    listUsersInGroup: async (fetch, groupId: string) => {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/list-users-in-group/${groupId}`,{  
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/DeleteUserGroup/${userId}/${groupId}`, {  
            method: 'DELETE',  
        });  
        return response;  
    },  
    listInvitation: async (fetch, id: string) => {  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/getAllRequest/${id}`,{  
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
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/getAllGroupByUserId/${userId}`,  
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
    addGroup: async (fetch,groupData: FormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/AddGroup`, {
                method: 'POST',
                data: groupData,
            });
            return response;
        } catch (error) {
            alert(error as string);
        }
    },
    addGroup2: async (fetch, groupData:Group) => {
        try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/AddGroup`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
            },
            data: groupData,
        });
        return response;} 
        catch (error) {
            alert(error as string );
          }
    },
    getEventById : async (fetch,eventId: string) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/${eventId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          
          return response;
        } catch (error) {
          throw new Error(error as string || 'Error fetching event');
        }
      },
    getGroupCosts: async (fetch, groupId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Cost/group/${groupId}`, {
                method: 'GET',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error fetching group costs');
        }
    },
    createCost: async (fetch, costData: CreateCost) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Cost`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(costData),
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error creating cost');
        }
    },
    createTemplate: async (fetch, groupId: string, userId: string, quantity: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/CreateTemplate/${groupId}/${userId}/${quantity}`, {
                method: 'POST',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                }
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error creating cost');
        }
    },
    updateCost: async (fetch, costData: UpdateCost) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Cost/UpdateCost`, {
                method: 'PUT',
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(costData),
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error updating cost');
        }
    },
    deleteCost: async (fetch, costId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Cost/${costId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error deleting cost');
        }
    },
    changeGroupLeader: async (fetch, userId: string, groupId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/ChangeGroupLeader/${userId}/${groupId}`, {
                method: 'PUT',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error changing group leader');
        }
    },
    deleteGroup: async (fetch, groupId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error deleting group');
        }
    },
    removeUserFromGroup: async (fetch, userId: string, groupId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/RemoveUserFromGroup/${userId}/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error removing user from group');
        }
    },
    changeGroupCurrency: async (fetch, groupId: string, currency: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/ChangeGroupCurrency/${groupId}/${currency}`, {
                method: 'PUT',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error changing group currency');
        }
    },
    removePlanFromGroup: async (fetch, groupId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Group/RemovePlanFromGroup/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'accept': '*/*',
                },
            });
            return response;
        } catch (error) {
            throw new Error(error as string || 'Error removing plan from group');
        }
    },
    getCurrencyExchangeRates: async (fetch): Promise<CurrencyRatesResponse> => {
        try {
            const response = await fetch(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=1c3e65a2e1c14ec0befe72aa667451f3`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Ensure the response is parsed as JSON
            const data: CurrencyRatesResponse = await response.data; // Correctly parse the JSON response
            alert(response.data.json());
            return data; // Return the data
        } catch (error) {
            throw new Error(error as string || 'Error fetching currency exchange rates');
        }
    },
    
});  