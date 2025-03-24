'use client'
import { SetStateAction, useState, useEffect } from 'react';
import { FaPlus, FaMoneyBillWave } from 'react-icons/fa';
import Navbar from '@/components/group/Navbar';
import Timeline from '@/components/group/TimeLine';
import CreateActivityModal from '@/components/group/CreateActivityModal';
import EditActivityModal from '@/components/group/EditActivityModal';
import DeleteActivityModal from '@/components/group/DeleteActivityModal';
import CreateTimelineModal from '@/components/group/CreateTimelineModal';
import EditTimelineModal from '@/components/group/EditTimelineModal';
import DeleteTimelineModal from '@/components/group/DeleteTimelineModal';
import AddCostModal from '@/components/group/AddCostModal';
import AddTemplateModal from '@/components/group/AddTemplateModal';
import { PlanRepository } from '@/repositories/PlanRepository';
import { format } from 'date-fns';
import { useUserContext } from '@/providers/UserProvider';  
import { useRouter } from 'next/navigation';
import { GroupRepository } from '@/repositories/GroupRepository';
import { useParams } from 'next/navigation';

// Define types for activities and timelines
interface Activity {
    activityId: string;
    planId: string;
    content: string;
    schedule: string;
    createdAt: string;
    createdBy: string;
    category: string;
    status: number;
    statusName: string;
    costs?: AdditionalCost[];
}

// Thêm interface mới cho chi phí phát sinh
interface AdditionalCost {
    id: string;
    amount: number;
    description: string;
    createdAt: string;
}

// Interface cho việc tạo chi phí mới
interface CreateAdditionalCost {
    activityId: string;
    amount: number;
    description: string;
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
interface TimelineData {
    planId: string;
    title: string;
    description: string;
    schedule: string;
    groupId: string;
    status: number;
    statusName: string;
    activities: Activity[];
}
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

export default function TimelinePage() {
    const { groupId } = useParams();
    const [timelines, setTimelines] = useState<TimelineData[]>([]);
    const router = useRouter();
    const fetchPlans = async () => {
        const data = await PlanRepository.getListPlan(groupId as string);
        if (data.status === 200) {
            setTimelines(data.data);
        }
    };

    useEffect(() => {
        fetchPlans();
        
    }, [groupId]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isCreateTimelineModalOpen, setIsCreateTimelineModalOpen] = useState<boolean>(false);
    const [isEditTimelineModalOpen, setIsEditTimelineModalOpen] = useState<boolean>(false);
    const [isDeleteTimelineModalOpen, setIsDeleteTimelineModalOpen] = useState<boolean>(false);
    const [isAddCostModalOpen, setIsAddCostModalOpen] = useState<boolean>(false);
    const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState<boolean>(false);
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    const [currentTimeline, setCurrentTimeline] = useState<TimelineData | null>(null);
    const [expandedTimelineIndex, setExpandedTimelineIndex] = useState<number | null>(null);
    const { id } = useUserContext();
    const handleCreateTimeline = async (newTimeline: { title: string; schedule: string; description: string }) => {
        const localSchedule = format(new Date(newTimeline.schedule), "yyyy-MM-dd'T'HH:mm:ss");
        const planData: TimelineCreateData = {
            title: newTimeline.title,
            description: newTimeline.description,
            schedule: localSchedule,
            groupId: groupId as string,
            status: 1
        };

        const response = await PlanRepository.createPlan(planData);
        if (response.status === 200) {
            await fetchPlans();
        }
        setIsCreateTimelineModalOpen(false);
    };
    const handleEditTimeline = async (updatedTimeline: Partial<TimelineData>) => {
        
        if (currentTimeline) {
            const formattedSchedule = updatedTimeline.schedule ? format(new Date(updatedTimeline.schedule), "yyyy-MM-dd'T'HH:mm:ss") : currentTimeline.schedule;
            const planData: TimelineUpdateData = {
                planId: currentTimeline.planId,
                title: updatedTimeline.title || currentTimeline.title,
                description: updatedTimeline.description || currentTimeline.description,
                schedule: formattedSchedule,
                groupId: currentTimeline.groupId,
                status: updatedTimeline.status || currentTimeline.status,
            };

            const response = await PlanRepository.updatePlan(planData);
            if (response.status === 200) {
                await fetchPlans();
            }
        }
        setCurrentTimeline(null);
    };

    const handleDeleteTimeline = async (timeline: { planId: string }) => {
        const response = await PlanRepository.deletePlan(timeline.planId);
        if (response.status === 200) {
            await fetchPlans();
        }
        setCurrentTimeline(null);
    };

    const handleCreateActivity = async (activity: { category: string; content: string; time: string }) => {
        try{

            const localSchedule = format(new Date(`${currentTimeline?.schedule.split('T')[0]}T${activity.time}`), "yyyy-MM-dd'T'HH:mm:ss");
            const activityData: CreateActivity = {
                planId: currentTimeline?.planId || '',
                content: activity.content,
                schedule: localSchedule,
                createdBy: id,
                category: activity.category,
                status: 1
            }

            const response = await PlanRepository.createActivity(activityData);
            if (response.status === 200) {
                await fetchPlans();
            }
        }catch(error){
            alert('error create activity' + error);
        }
        setIsCreateModalOpen(false);
        setCurrentTimeline(null);
    };

    const handleEditActivity = async (updatedActivity: Omit<Activity, 'createdBy'>) => {
        if (currentActivity) {
            const localSchedule = format(new Date(`${currentActivity?.schedule.split('T')[0]}T${updatedActivity.schedule}`), "yyyy-MM-dd'T'HH:mm:ss");
            const activityData: EditActivity = {
                activityId: currentActivity.activityId,
                content: updatedActivity.content,
                schedule: localSchedule,
                category: updatedActivity.category,
                status: updatedActivity.status,
            };

            const response = await PlanRepository.updateActivity(activityData);
            if (response.status === 200) {
                await fetchPlans();
            }
        }
        setIsEditModalOpen(false);
        setCurrentActivity(null);
    };

    const handleDeleteActivity = async () => {
        const response = await PlanRepository.deleteActivity(currentActivity?.activityId || '');
        if (response.status === 200) {
            await fetchPlans();
        }
        setIsDeleteModalOpen(false);
        setCurrentActivity(null);
    };

    const handleAddCost = async (cost: { amount: number; description: string }) => {
        try {
            if (!currentActivity) return;

            const costData: CreateCost = {
                activityId: currentActivity.activityId,
                amount: cost.amount,
                description: cost.description,
                category: 'Other',
                createdAt: new Date().toISOString().split('T')[0],
                createdBy: id,
                groupId: groupId as string,
                status: 0
            };

            const response = await GroupRepository.createCost(costData);
            if (response.status === 200) {
                router.push('/group/cost/'+groupId);
            } else {
                alert('Failed to add cost');
            }

            setIsAddCostModalOpen(false);
            setCurrentActivity(null);
        } catch (error) {
            console.error('Error adding cost:', error);
            alert('Có lỗi xảy ra khi thêm chi phí');
        }
    };

    const handleAddTemplate = async (quantity: number) => {
        try {
            const response = await GroupRepository.createTemplate(groupId as string, id, quantity);
            // TODO: Implement logic to create templates
            if(response.status === 200){
                await fetchPlans();
                setIsAddTemplateModalOpen(false);
            }
        } catch (error) {
            console.error('Error creating templates:', error);
            alert('Có lỗi xảy ra khi tạo template');
        }
    };

    const handleRemovePlan = async () => {
        try {
            const response = await GroupRepository.removePlanFromGroup(groupId as string);
            if (response.status === 200) {
                await fetchPlans(); // Refresh the timelines after removing the plan
            } else {
                alert('Failed to remove plan');
            }
        } catch (error) {
            console.error('Error removing plan:', error);
            alert('An error occurred while removing the plan');
        }
    };

    const getStatusTagStyle = (status: number) => {
        switch (status) {
            case 1: // Done
                return "bg-green-500 text-white";
            case 2: // Canceled
                return "bg-red-500 text-white";
            default: // In Progress
                return "bg-blue-500 text-white";
        }
    };

    const renderStatusTag = (timeline: TimelineData) => {
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusTagStyle(timeline.status)}`}>
                {timeline.statusName}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Timelines</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your event timelines and activities</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsAddTemplateModalOpen(true)}
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span className="font-medium">Add Template</span>
                        </button>
                        <button
                            onClick={handleRemovePlan}
                            className="px-5 py-2.5 bg-red-600 text-white rounded-xl flex items-center space-x-2 hover:bg-red-500 transition-colors duration-200 shadow-sm"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span className="font-medium">Remove Plan</span>
                        </button>
                        <button
                            onClick={() => setIsCreateTimelineModalOpen(true)}
                            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl flex items-center space-x-2 hover:bg-gray-800 transition-colors duration-200 shadow-sm"
                        >
                            <FaPlus className="w-4 h-4" />
                            <span className="font-medium">Add Timeline</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {timelines.map((timeline, index) => (
                        <div key={index}>

                            <Timeline
                                timeLineData={timeline}
                                statusTag={renderStatusTag(timeline)}
                                onEditActivity={(activity: Activity) => {
                                    setCurrentActivity(activity);
                                    setIsEditModalOpen(true);
                                }}
                                onDeleteActivity={(activity: Activity) => {
                                    setCurrentActivity(activity);
                                    setIsDeleteModalOpen(true);
                                }}
                                onAddCost={(activity: Activity) => {
                                    setCurrentActivity(activity);
                                    setIsAddCostModalOpen(true);
                                }}
                                onEditTimeline={() => {
                                    setCurrentTimeline(timeline);
                                    setIsEditTimelineModalOpen(true);
                                }}
                                onDeleteTimeline={() => {
                                    setCurrentTimeline(timeline);
                                    setIsDeleteTimelineModalOpen(true);
                                }}
                                onExpandChange={(isExpanded: boolean) => {
                                    setExpandedTimelineIndex(isExpanded ? index : null);
                                }}
                                onAddActivity={() => {
                                    //setCurrentTimeline(timeline);
                                    setIsCreateModalOpen(true);
                                }}
                            />
                            {expandedTimelineIndex === index && (
                                <div className="mt-4">
                                    {/* {timeline.activities.map(activity => (
                                        <div key={activity.activityId} className="p-2 border-b">
                                            <p className="font-medium">{activity.content}</p>
                                            <p className="text-sm text-gray-600">{activity.category}</p>
                                            <p className="text-sm text-gray-600">{new Date(activity.schedule).toLocaleString()}</p>
                                        </div>
                                    ))} */}
                                    <button
                                        onClick={() => {
                                            setCurrentTimeline(timeline);
                                            setIsCreateModalOpen(true);
                                        }}
                                        className="mt-4 w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        <span>Add New Activity</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <CreateTimelineModal
                    isOpen={isCreateTimelineModalOpen}
                    onClose={() => setIsCreateTimelineModalOpen(false)}
                    onSubmit={handleCreateTimeline}
                />

                <EditTimelineModal
                    isOpen={isEditTimelineModalOpen}
                    onClose={() => {
                        setIsEditTimelineModalOpen(false);
                        setCurrentTimeline(null);
                    }}
                    onSubmit={handleEditTimeline}
                    timeline={currentTimeline}
                />

                <DeleteTimelineModal
                    isOpen={isDeleteTimelineModalOpen}
                    onClose={() => {
                        setIsDeleteTimelineModalOpen(false);
                        setCurrentTimeline(null);
                    }}
                    onConfirm={handleDeleteTimeline}
                    timeline={currentTimeline}
                />

                <CreateActivityModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateActivity}
                />

                <EditActivityModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditActivity}
                    activity={currentActivity}
                />

                <DeleteActivityModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setCurrentActivity(null);
                    }}
                    onConfirm={handleDeleteActivity}
                    activity={currentActivity}
                />

                <AddCostModal
                    isOpen={isAddCostModalOpen}
                    onClose={() => {
                        setIsAddCostModalOpen(false);
                        setCurrentActivity(null);
                    }}
                    onSubmit={handleAddCost}
                />

                <AddTemplateModal
                    isOpen={isAddTemplateModalOpen}
                    onClose={() => setIsAddTemplateModalOpen(false)}
                    onSubmit={handleAddTemplate}
                />
            </div>
        </div>
    );
} 