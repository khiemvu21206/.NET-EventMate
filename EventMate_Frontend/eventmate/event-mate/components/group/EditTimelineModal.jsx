'use client'
import { useState, useEffect } from 'react';
import { FaTimes, FaClock } from 'react-icons/fa';

const EditTimelineModal = ({ isOpen, onClose, onSubmit, timeline: initialTimeline }) => {
    const [timeline, setTimeline] = useState({
        title: '',
        schedule: '',
        time: '',
        description: '',
        status: 0, // Default to InProgress
    });

    useEffect(() => {
        if (initialTimeline && initialTimeline.schedule) {
            // Split date and time from the ISO 8601 datetime string
            const [date, time] = initialTimeline.schedule.split('T');
            setTimeline({
                title: initialTimeline.title,
                schedule: date,
                time: time.slice(0, 5), // Extract only the HH:mm part
                description: initialTimeline.description || '',
                status: initialTimeline.status || 0,
            });
        }
    }, [initialTimeline]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedSchedule = `${timeline.time} ${timeline.schedule}`;
        onSubmit({
            ...initialTimeline,
            title: timeline.title,
            schedule: formattedSchedule,
            description: timeline.description,
            status: timeline.status,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black-100 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-2xl bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Edit Timeline</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Timeline Title
                        </label>
                        <input
                            type="text"
                            value={timeline.title}
                            onChange={(e) => setTimeline({ ...timeline, title: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter timeline title"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Schedule
                            </label>
                            <input
                                type="date"
                                value={timeline.schedule}
                                onChange={(e) => setTimeline({ ...timeline, schedule: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Time
                            </label>
                            <div className="relative">
                                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="time"
                                    value={timeline.time}
                                    onChange={(e) => setTimeline({ ...timeline, time: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={timeline.description}
                            onChange={(e) => setTimeline({ ...timeline, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter timeline description"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            value={timeline.status}
                            onChange={(e) => setTimeline({ ...timeline, status: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value={1} className="text-green-500">Done</option>
                            <option value={2} className="text-red-500">Canceled</option>
                            <option value={0} className="text-gray-500">InProgress</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTimelineModal; 