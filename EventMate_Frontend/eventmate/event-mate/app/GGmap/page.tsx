'use client'
import { useState, useEffect } from 'react';
import { FaSearch, FaStar, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { LoadScript, GoogleMap, Marker, LoadScriptProps, GoogleMapProps } from '@react-google-maps/api';
import Navbar from '@/components/group/Navbar';
import { useRouter } from 'next/navigation';
import { useUserContext } from "@/providers/UserProvider";

// API key của Google Maps
const API_KEY = 'AIzaSyAhuvkbu8iQU3vptKQSbaHQNlTJv0ndTVw';

// Dữ liệu mẫu cho các địa điểm
const SAMPLE_PLACES: Place[] = [
  {
    id: 1,
    type: 'hotel',
    name: 'Grand Hotel Saigon',
    image: '/images/hotels/grand-hotel.jpg',
    rating: 4.5,
    reviews: 128,
    price: '$$',
    distance: 0.5,
    address: '123 Dong Khoi Street, District 1, HCMC',
    description: 'Luxury hotel in the heart of Saigon with modern amenities',
    location: {
      lat: 10.7731,
      lng: 106.7039
    }
  },
  {
    id: 2,
    type: 'restaurant',
    name: 'Pho 2000',
    image: '/images/restaurants/pho-2000.jpg',
    rating: 4.2,
    reviews: 256,
    price: '$',
    distance: 1.2,
    address: '456 Le Thanh Ton Street, District 1, HCMC',
    description: 'Famous traditional Vietnamese pho restaurant',
    location: {
      lat: 10.7721,
      lng: 106.7029
    }
  },
  // Thêm nhiều địa điểm mẫu khác...
];

interface Place {
  id: number;
  type: 'hotel' | 'restaurant';
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: '$' | '$$' | '$$$';
  distance: number;
  address: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
}

type FilterType = 'all' | 'hotel' | 'restaurant';
type RangeType = 'all' | '1km' | '2km' | '5km';
type RatingType = 'all' | '4-5' | '3-4' | '2-3';
type PriceType = 'all' | '$' | '$$' | '$$$';

interface Filters {
  type: FilterType;
  range: RangeType;
  rating: RatingType;
  price: PriceType;
}

// Thêm kiểu dữ liệu cho map container
const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%'
};

  export default function MapPage() {
  const { logout, id: leaderId, email,status } = useUserContext();
  alert('leaderId: '+leaderId);
  const [places, setPlaces] = useState<Place[]>(SAMPLE_PLACES);
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    range: 'all',
    rating: 'all',
    price: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [center, setCenter] = useState({
    lat: 10.7731,
    lng: 106.7039
  });

  const getMarkerIcon = (place: Place) => {
    const isSelected = selectedPlace?.id === place.id;
    const iconUrl = place.type === 'hotel' 
      ? "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";

    return {
      url: isSelected 
        ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" 
        : iconUrl
    };
  };

  // Xử lý lọc địa điểm
  const filterPlaces = () => {
    let filtered = [...SAMPLE_PLACES] as Place[];

    // Lọc theo loại địa điểm
    if (filters.type !== 'all') {
      filtered = filtered.filter(place => place.type === filters.type);
    }

    // Lọc theo khoảng cách
    if (filters.range !== 'all') {
      const ranges: Record<'1km' | '2km' | '5km', number> = {
        '1km': 1,
        '2km': 2,
        '5km': 5
      };
      filtered = filtered.filter(place => place.distance <= ranges[filters.range as '1km' | '2km' | '5km']);
    }

    // Lọc theo đánh giá
    if (filters.rating !== 'all') {
      const ratings: Record<'4-5' | '3-4' | '2-3', number> = {
        '4-5': 4,
        '3-4': 3,
        '2-3': 2
      };
      filtered = filtered.filter(place => place.rating >= ratings[filters.rating as '4-5' | '3-4' | '2-3']);
    }

    // Lọc theo giá
    if (filters.price !== 'all') {
      filtered = filtered.filter(place => place.price === filters.price);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter(place =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setPlaces(filtered);
  };

  useEffect(() => {
    filterPlaces();
  }, [filters, searchQuery]);

  // Xử lý khi chọn một địa điểm
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setCenter(place.location);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 flex">
        {/* Left Panel - Search & Results */}
        <div className="w-[450px] flex flex-col border-r border-gray-200 bg-white">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-4">
              {/* Type Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Type</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.type === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, type: 'hotel' }))}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.type === 'hotel'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Hotels
                  </button>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, type: 'restaurant' }))}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.type === 'restaurant'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Restaurants
                  </button>
                </div>
              </div>

              {/* Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Distance</h3>
                <div className="flex space-x-2">
                  {(['all', '1km', '2km', '5km'] as const).map(range => (
                    <button
                      key={range}
                      onClick={() => setFilters(prev => ({ ...prev, range }))}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.range === range
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range === 'all' ? 'All' : range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
                <div className="flex space-x-2">
                  {(['all', '4-5', '3-4', '2-3'] as const).map(rating => (
                    <button
                      key={rating}
                      onClick={() => setFilters(prev => ({ ...prev, rating }))}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.rating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 'all' ? 'All' : `${rating} ★`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="flex space-x-2">
                  {(['all', '$', '$$', '$$$'] as const).map(price => (
                    <button
                      key={price}
                      onClick={() => setFilters(prev => ({ ...prev, price }))}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.price === price
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {price === 'all' ? 'All' : price}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {places.map(place => (
                <div
                  key={place.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    selectedPlace?.id === place.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handlePlaceSelect(place)}
                >
                  <div className="flex space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/96';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{place.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="flex items-center">
                          <FaStar className="w-4 h-4 text-yellow-400" />
                          <span className="ml-1 text-sm text-gray-700">{place.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({place.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>{place.distance}km away</span>
                        <span>•</span>
                        <span>{place.price}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{place.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map */}
        <div className="flex-1">
          <LoadScript googleMapsApiKey={API_KEY as string}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={{
                styles: [
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]
              }}
            >
              {places.map(place => (
                <Marker
                  key={place.id}
                  position={place.location}
                  title={place.name}
                  onClick={() => handlePlaceSelect(place)}
                  icon={getMarkerIcon(place)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
}