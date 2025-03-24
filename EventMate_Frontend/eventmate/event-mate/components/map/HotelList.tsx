import React from 'react';
import { FaStar } from 'react-icons/fa';

interface Place {
  place_id: string;
  name: string;
  price_level?: number; // Price level for hotels
  rating?: number; // Rating for hotels
  photos?: { photo_reference: string }[]; // Optional array of photos
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface HotelListProps {
  hotels: Place[];
  selectedPlace: string | null;
  onHotelClick: (hotel: Place) => void;
  priceRange: number;
  ratingRange: number; // Hotel-specific rating range
  proximity: number; // Proximity in meters
  center: { lat: number; lng: number }; // Current center location
  getPhotoUrl: (photoReference: string) => string; // Function to get image URL
}

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

const filterHotels = (hotels: Place[], ratingRange: number, proximity: number, center: { lat: number; lng: number }): Place[] => {
  return hotels.filter((hotel) => {
    const ratingFilter = ratingRange === 0 || (hotel.rating && hotel.rating >= ratingRange && hotel.rating < ratingRange + 1);
    const proximityFilter = proximity === 0 || calculateDistance(center.lat, center.lng, hotel.geometry.location.lat, hotel.geometry.location.lng) <= proximity;

    return ratingFilter && proximityFilter;
  });
};

const HotelList: React.FC<HotelListProps> = ({ hotels, selectedPlace, onHotelClick, ratingRange, proximity, center, getPhotoUrl }) => {
  const filteredHotels = filterHotels(hotels, ratingRange, proximity, center);

  return (
    <div className="p-4">
      <ul className="divide-y divide-gray-300">
        {filteredHotels.map((hotel) => (
          <li
            key={hotel.place_id}
            onClick={() => onHotelClick(hotel)}
            className={`p-4 transition-all duration-200 rounded-lg cursor-pointer ${selectedPlace === hotel.place_id ? "bg-gray-200 shadow-md" : "hover:bg-gray-100"
              }`}
          >
            <div className="flex space-x-4">
              {/* Hình ảnh khách sạn */}
              <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={hotel.photos?.[0] ? getPhotoUrl(hotel.photos[0].photo_reference) : "https://via.placeholder.com/96"}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Thông tin khách sạn */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{hotel.name}</h3>
                <div className="flex items-center space-x-1 mt-2">
                  <FaStar className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1 text-base font-medium text-gray-800">{hotel.rating || "N/A"}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;