'use client'
import { useState } from 'react';
import Navbar from '@/components/group/Navbar';
import { CalendarIcon, MapPinIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function ActivitiesPage() {
  // Mock data cho activities
  const activities = [
    {
      id: 1,
      title: 'Group Meeting',
      type: 'Meeting',
      date: '2024-03-20',
      time: '14:00',
      location: 'Coffee Shop Downtown',
      description: 'Weekly group meeting to discuss event planning and progress',
      attendees: 8,
      image: '/activities/meeting.jpg',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Venue Visit',
      type: 'Site Visit',
      date: '2024-03-22',
      time: '10:00',
      location: 'Event Venue',
      description: 'Visit the event venue to check facilities and plan layout',
      attendees: 5,
      image: '/activities/venue.jpg',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Budget Review',
      type: 'Meeting',
      date: '2024-03-18',
      time: '15:30',
      location: 'Online',
      description: 'Review and finalize the event budget',
      attendees: 6,
      image: '/activities/budget.jpg',
      status: 'completed'
    }
  ];

  const [filter, setFilter] = useState('all'); // all, upcoming, completed

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
              <p className="mt-1 text-sm text-gray-500">View and manage group activities</p>
            </div>
            <button
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Activity
            </button>
          </div>

          {/* Filters */}
          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={filter === 'all' 
                ? 'px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900'
                : 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'}
            >
              All Activities
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={filter === 'upcoming'
                ? 'px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900'
                : 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={filter === 'completed'
                ? 'px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900'
                : 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'}
            >
              Completed
            </button>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            {filteredActivities.map(activity => (
              <div
                key={activity.id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div className="flex">
                  <div className="relative w-48 h-48 flex-shrink-0">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {activity.type}
                        </span>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                      </div>
                      <span className={activity.status === 'completed'
                        ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                        : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'}>
                        {activity.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                      {activity.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                        {activity.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                        {activity.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                        {activity.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                        {activity.attendees} attendees
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button className="text-sm font-medium text-gray-900 hover:text-gray-700">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
