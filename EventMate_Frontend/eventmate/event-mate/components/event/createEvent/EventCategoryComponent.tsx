"use client";
import React, { useState } from "react";

interface EventCategoryProps {
  onTypeChange: (type: number) => void;
}

// Enum cho các loại sự kiện khớp với backend
enum EventType {
  CulturalFestival = 0,   // Lễ hội văn hóa
  MusicConcert = 1,       // Hòa nhạc
  ArtExhibition = 2,      // Triển lãm nghệ thuật
  SportsEvent = 3,        // Sự kiện thể thao
  TradeFair = 4,          // Hội chợ thương mại
  FoodFestival = 5,       // Lễ hội ẩm thực
  CommunityGathering = 6, // Sự kiện cộng đồng
  CharityEvent = 7,       // Hoạt động thiện nguyện
  Conference = 8,         // Hội nghị, diễn đàn
  Workshop = 9,           // Hội thảo
  MovieScreening = 10,     // Chiếu phim ngoài trời
  PoliticalRally = 11,     // Biểu tình, tuần hành
  TechExpo = 12,           // Triển lãm công nghệ
  CosplayEvent = 13       // Sự kiện cosplay, anime/manga
}

export default function EventCategoryComponent({ onTypeChange }: EventCategoryProps) {
  const [selectedType, setSelectedType] = useState<EventType>(EventType.CulturalFestival);
  const [error, setError] = useState<string>("");

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = parseInt(e.target.value) as EventType;
    if (newType === EventType.None) {
      setError("Vui lòng chọn loại sự kiện");
      return;
    }
    setError("");
    setSelectedType(newType);
    onTypeChange(newType);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-md text-white">
      <div className="flex flex-col">
        <label className="block font-semibold mb-2">* Loại sự kiện</label>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className={`w-full text-black rounded-md p-2 border ${
            error ? "border-red-500" : "border-gray-700"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value={EventType.CulturalFestival}>Lễ hội văn hóa</option>
          <option value={EventType.MusicConcert}>Hòa nhạc</option>
          <option value={EventType.ArtExhibition}>Triển lãm nghệ thuật</option>
          <option value={EventType.SportsEvent}>Sự kiện thể thao</option>
          <option value={EventType.TradeFair}>Hội chợ thương mại</option>
          <option value={EventType.FoodFestival}>Lễ hội ẩm thực</option>
          <option value={EventType.CommunityGathering}>Sự kiện cộng đồng</option>
          <option value={EventType.CharityEvent}>Hoạt động thiện nguyện</option>
          <option value={EventType.Conference}>Hội nghị, diễn đàn</option>
          <option value={EventType.Workshop}>Hội thảo</option>
          <option value={EventType.MovieScreening}>Chiếu phim ngoài trời</option>
          <option value={EventType.PoliticalRally}>Biểu tình, tuần hành</option>
          <option value={EventType.TechExpo}>Triển lãm công nghệ</option>
          <option value={EventType.CosplayEvent}>Sự kiện cosplay, anime/manga</option>
        </select>
        {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
      </div>
    </div>
  );
} 