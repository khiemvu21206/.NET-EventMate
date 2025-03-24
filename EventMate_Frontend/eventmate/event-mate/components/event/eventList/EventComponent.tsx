"use client";
import React, { useState } from "react";
import styles from "@/styles/EventComponent.module.css";
import { Event } from "@/repositories/EventRepository";
import { ensureTimezone, timeConverter } from "@/lib/helpers";
import { useRouter } from "next/navigation";

export interface EventComponentProps {
  event: Event
}

export default function EventComponent({ event }: EventComponentProps) {
  const router = useRouter();

  return (
    <div className="group cursor-pointer"
      onClick={() => router.push(`/event/eventDetail/${event.eventId}`)}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Phần ảnh */}
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={event.img || 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={`Event ${event.name}`}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Phần thông tin */}
        <div className="p-4">
          {/* Tên sự kiện */}
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {event?.name}
          </h3>

          {/* Thời gian */}
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {timeConverter(new Date(ensureTimezone(event.createdAt)), false)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
