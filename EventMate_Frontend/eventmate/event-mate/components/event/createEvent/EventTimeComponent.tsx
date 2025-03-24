"use client";
import React, { useState } from "react";

interface EventTimeProps {
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

export default function EventTimeComponent({ onStartTimeChange, onEndTimeChange }: EventTimeProps) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    onStartTimeChange(newStartTime);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    onEndTimeChange(newEndTime);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <div className="flex flex-wrap gap-4">
        {/* Thời gian bắt đầu */}
        <div className="flex-1">
          <label className="block font-semibold mb-2">*Thời gian bắt đầu</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Thời gian kết thúc */}
        <div className="flex-1">
          <label className="block font-semibold mb-2">*Thời gian kết thúc</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full text-black rounded-md p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
} 