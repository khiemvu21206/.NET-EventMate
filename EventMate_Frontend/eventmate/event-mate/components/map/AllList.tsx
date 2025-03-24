import React from 'react';
import { FaStar } from 'react-icons/fa';

interface Place {
  place_id: string;
  name: string;
  price_level?: number;
  rating?: number;
  photos?: { photo_reference: string }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface AllListProps {
  hotels: Place[];
  restaurants: Place[];
  selectedPlace: string | null;
  onPlaceClick: (place: Place) => void;
  center: { lat: number; lng: number };
  getPhotoUrl: (photoReference: string) => string;
  priceRange: number;
  ratingRange: number;
  proximity: number;
}

const filterAllPlaces = (places: Place[], priceRange: number, ratingRange: number, proximity: number, center: { lat: number; lng: number }): Place[] => {
  return places.filter((place) => {
    const priceFilter = priceRange === 0 || (place.price_level && place.price_level === priceRange);
    const ratingFilter = ratingRange === 0 || (place.rating && place.rating >= ratingRange && place.rating < ratingRange + 1);
    const proximityFilter = proximity === 0 || calculateDistance(center.lat, center.lng, place.geometry.location.lat, place.geometry.location.lng) <= proximity;

    return priceFilter && ratingFilter && proximityFilter;
  });
};

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

const AllList: React.FC<AllListProps> = ({ hotels, restaurants, selectedPlace, onPlaceClick, center, getPhotoUrl, priceRange, ratingRange, proximity }) => {
  const allPlaces = filterAllPlaces([...hotels, ...restaurants], priceRange, ratingRange, proximity, center);

  return (
    <div className="p-4">
      <ul className="divide-y divide-gray-200">
        {allPlaces.map(place => (
          <li
            key={place.place_id}
            onClick={() => onPlaceClick(place)}
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              selectedPlace === place.place_id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={place.photos?.[0] ? getPhotoUrl(place.photos[0].photo_reference) : 'https://via.placeholder.com/96'}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{place.name}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-700">{place.rating || 'N/A'}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllList; 