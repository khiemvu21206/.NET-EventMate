import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import HotelList from './HotelList';
import RestaurantList from './RestaurantList';
import AllList from './AllList';
import { GlobeAltIcon, BuildingOfficeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { FaStar } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { GroupRepository } from '@/repositories/GroupRepository';

interface Place {
  place_id: string;
  name: string;
  price_level?: number;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GeocodeResult {
  results: [
    {
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
    }
  ];
}

interface GroupData {  
    groupId: string;  
    img: string;  
    groupName: string;  
    createdAt: string;  
    eventId: string;  
    totalMember: number;  
    leader: string;  
    description: string | null;  
    visibility: number;  
    status: number;  
    events: any | null;  
    user: any | null;  
    plans: any | null;  
    conversation: any | null;  
    requests: any | null;  
    user_Groups: any | null;  
    multimedia: any | null;  
    place: string;
}

const API_KEY = 'AIzaSyAhuvkbu8iQU3vptKQSbaHQNlTJv0ndTVw';  // Replace with your API key  
const URL = 'https://localhost:7121';  // Replace with your URL  

const MapContainer: React.FC = () => {
  const { groupId } = useParams();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hotels, setHotels] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [locationType, setLocationType] = useState<'user' | 'event'>('user');
  const [location, setLocation] = useState<string>('');
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 37.7749, lng: -122.4194 });
  const [hotelPriceRange, setHotelPriceRange] = useState<number>(0);
  const [hotelRatingRange, setHotelRatingRange] = useState<number>(0);
  const [restaurantPriceRange, setRestaurantPriceRange] = useState<number>(0);
  const [restaurantRatingRange, setRestaurantRatingRange] = useState<number>(0);
  const [hotelProximity, setHotelProximity] = useState<number>(0);
  const [restaurantProximity, setRestaurantProximity] = useState<number>(0);
  const [filterType, setFilterType] = useState<string>('all');
  const [PriceRange, setPriceRange] = useState<number>(0);
  const [RatingRange, setRatingRange] = useState<number>(0);
  const [Proximity, setProximity] = useState<number>(0);

  const fetchGroupDetails = async () => {
    try {
      const groupResponse = await GroupRepository.findGroup(groupId as string);
      if (groupResponse.status === 200) {
        const groupDetails = groupResponse.data as GroupData;
        setGroupData(groupDetails);
        if (locationType === 'event' && groupDetails.place) {
          goToLocation(groupDetails.place);
        }
      }
    } catch (error) {
      console.error("Failed to fetch group data:", error);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId]);

  useEffect(() => {
    if (locationType === 'user') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(userLocation);
        },
        (error) => {
          console.error("Error getting user location:", error);
          alert("Could not get your location. Please check your browser settings.");
        }
      );
    } else if (locationType === 'event' && groupData?.place) {
      goToLocation(groupData.place);
    }
  }, [locationType, groupData]);

  useEffect(() => {
    fetchHotels(center.lat, center.lng);
    fetchRestaurants(center.lat, center.lng);
  }, [center]);

  const fetchHotels = async (lat: number, lng: number) => {
    const response = await fetch(URL + `/api/Map/hotels?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    setHotels(data.results);
  };

  const fetchRestaurants = async (lat: number, lng: number) => {
    const response = await fetch(URL + `/api/Map/restaurants?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    setRestaurants(data.results);
  };

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleHotelClick = (hotel: Place) => {
    setSelectedPlace(hotel.place_id);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: hotel.geometry.location.lat,
        lng: hotel.geometry.location.lng,
      });
    }
  };

  const handleRestaurantClick = (restaurant: Place) => {
    setSelectedPlace(restaurant.place_id);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: restaurant.geometry.location.lat,
        lng: restaurant.geometry.location.lng,
      });
    }
  };

  const goToLocation = async (location: string) => {
    if (location) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`
      );
      const data: GeocodeResult = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        setCenter({ lat, lng });
        setLocation('');
      } else {
        alert('Location not found. Please try again.');
      }
    }
  };

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
  };

  return (
    <div className="flex w-full h-screen">
      {/* Cột bên trái */}
      <div className="flex flex-col w-[30%] p-4 space-y-4">
        {/* Search Input and Button */}
        <div className="space-y-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search for places..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            onClick={() => goToLocation(location)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Search
          </button>
        </div>

        {/* Location Type Selection */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              locationType === 'user' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setLocationType('user')}
          >
            My Location
          </button>
          <button
            className={`px-3 py-1 rounded-full text-sm ${
              locationType === 'event' 
                ? 'bg-gray-800 text-white' 
                : 'bg-white border border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setLocationType('event')}
          >
            Event Location
          </button>
        </div>

        {/* Filter Type Buttons */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => setFilterType('all')}
            className={`flex items-center px-2 py-1 text-sm rounded 
      ${filterType === 'all'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800 border border-gray-800'
              }`}
          >
            <GlobeAltIcon className="h-5 w-5 mr-1" />
            All
          </button>
          <button
            onClick={() => setFilterType('hotels')}
            className={`flex items-center px-2 py-1 text-sm rounded 
      ${filterType === 'hotels'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800 border border-gray-800'
              }`}
          >
            <BuildingOfficeIcon className="h-5 w-5 mr-1" />
            Hotels
          </button>
          <button
            onClick={() => setFilterType('restaurants')}
            className={`flex items-center px-2 py-1 text-sm rounded 
      ${filterType === 'restaurants'
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-800 border border-gray-800'
              }`}
          >
            <BuildingStorefrontIcon className="h-5 w-5 mr-1" />
            Restaurants
          </button>
        </div>

        {/* Proximity Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Proximity:</h3>
          <div className="flex flex-wrap gap-2 text-gray-800">
            {filterType === 'hotels' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelProximity === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelProximity(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelProximity === 500 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelProximity(500)}
                >
                  500m
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelProximity === 1000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelProximity(1000)}
                >
                  1km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelProximity === 2000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelProximity(2000)}
                >
                  2km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelProximity === 5000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelProximity(5000)}
                >
                  5km
                </button>
              </div>
            )}
            {filterType === 'restaurants' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantProximity === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantProximity(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantProximity === 500 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantProximity(500)}
                >
                  500m
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantProximity === 1000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantProximity(1000)}
                >
                  1km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantProximity === 2000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantProximity(2000)}
                >
                  2km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantProximity === 5000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantProximity(5000)}
                >
                  5km
                </button>
              </div>
            )}
            {filterType === 'all' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${Proximity === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setProximity(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${Proximity === 500 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setProximity(500)}
                >
                  500m
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${Proximity === 1000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setProximity(1000)}
                >
                  1km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${Proximity === 2000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setProximity(2000)}
                >
                  2km
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${Proximity === 5000 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setProximity(5000)}
                >
                  5km
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price Range Filters */}
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Range:</h3>
          <div className="flex flex-col gap-2 text-gray-800">
            {filterType === 'hotels' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelPriceRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelPriceRange(0)}
                >
                  Tất cả giá
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelPriceRange === 1 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelPriceRange(1)}
                >
                  0 - 200K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelPriceRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelPriceRange(2)}
                >
                  200K - 500K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelPriceRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelPriceRange(3)}
                >
                  500K - 1M
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelPriceRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelPriceRange(4)}
                >
                  Trên 1M
                </button>
              </div>
            )}
            {filterType === 'restaurants' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantPriceRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantPriceRange(0)}
                >
                  Tất cả giá
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantPriceRange === 1 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantPriceRange(1)}
                >
                  0 - 200K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantPriceRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantPriceRange(2)}
                >
                  200K - 500K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantPriceRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantPriceRange(3)}
                >
                  500K - 1M
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantPriceRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantPriceRange(4)}
                >
                  Trên 1M
                </button>
              </div>
            )}
            {filterType === 'all' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${PriceRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPriceRange(0)}
                >
                  Tất cả giá
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${PriceRange === 1 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPriceRange(1)}
                >
                  0 - 200K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${PriceRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPriceRange(2)}
                >
                  200K - 500K
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${PriceRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPriceRange(3)}
                >
                  500K - 1M
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${PriceRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setPriceRange(4)}
                >
                  Trên 1M
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rating Filters */}
          <div>
          <h3 className="text-sm font-medium text-gray-800 mb-2">Rating:</h3>
          <div className="flex flex-col gap-2 text-gray-800">
            {filterType === 'hotels' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${hotelRatingRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelRatingRange(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${hotelRatingRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelRatingRange(2)}
                >
                  2-3 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${hotelRatingRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelRatingRange(3)}
                >
                  3-4 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${hotelRatingRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setHotelRatingRange(4)}
                >
                  4-5 <FaStar className="ml-1 text-yellow-400" />
                </button>
              </div>
            )}
            {filterType === 'restaurants' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${restaurantRatingRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantRatingRange(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${restaurantRatingRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantRatingRange(2)}
                >
                  2-3 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${restaurantRatingRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantRatingRange(3)}
                >
                  3-4 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${restaurantRatingRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRestaurantRatingRange(4)}
                >
                  4-5 <FaStar className="ml-1 text-yellow-400" />
                </button>
              </div>
            )}
            {filterType === 'all' && (
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${RatingRange === 0 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRatingRange(0)}
                >
                  Tất cả
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${RatingRange === 2 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRatingRange(2)}
                >
                  2-3 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${RatingRange === 3 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRatingRange(3)}
                >
                  3-4 <FaStar className="ml-1 text-yellow-400" />
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${RatingRange === 4 ? 'bg-gray-800 text-white' : 'bg-white border border-gray-300 hover:bg-gray-100'}`}
                  onClick={() => setRatingRange(4)}
                >
                  4-5 <FaStar className="ml-1 text-yellow-400" />
                </button>
              </div>
            )}
          </div>
          </div>

        {/* List Container */}
        <div className="w-[100%] h-[600px] overflow-y-scroll border border-gray-300 p-5 rounded">
          {filterType === 'all' && (
            <AllList
              hotels={hotels}
              restaurants={restaurants}
              selectedPlace={selectedPlace}
              onPlaceClick={(place: Place) => {
                if (place.place_id.startsWith('hotel')) {
                  handleHotelClick(place);
                } else {
                  handleRestaurantClick(place);
                }
              }}
              center={center}
              getPhotoUrl={getPhotoUrl}
              priceRange={PriceRange}
              ratingRange={RatingRange}
              proximity={Proximity}
            />
          )}
          {filterType !== 'restaurants' && (
          <HotelList
            hotels={hotels}
            selectedPlace={selectedPlace}
            onHotelClick={handleHotelClick}
            ratingRange={hotelRatingRange}
              proximity={hotelProximity}
            center={center}
              getPhotoUrl={getPhotoUrl}
              priceRange={0}
            />
          )}
          {filterType !== 'hotels' && (
          <RestaurantList
            restaurants={restaurants}
            selectedPlace={selectedPlace}
            onRestaurantClick={handleRestaurantClick}
            priceRange={restaurantPriceRange}
            ratingRange={restaurantRatingRange}
              proximity={restaurantProximity}
            center={center}
              getPhotoUrl={getPhotoUrl}
          />
          )}
        </div>
      </div>

      {/* Google Map */}
      <div className="w-[70%]">
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          onLoad={onLoad}
            mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={14}
        >
          {hotels.map((hotel) => (
            <Marker
              key={hotel.place_id}
              position={{
                lat: hotel.geometry.location.lat,
                lng: hotel.geometry.location.lng,
              }}
              title={hotel.name}
              onClick={() => handleHotelClick(hotel)}
              icon={{
                  url:
                    selectedPlace === hotel.place_id
                      ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          ))}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.place_id}
              position={{
                lat: restaurant.geometry.location.lat,
                lng: restaurant.geometry.location.lng,
              }}
              title={restaurant.name}
              onClick={() => handleRestaurantClick(restaurant)}
              icon={{
                  url:
                    selectedPlace === restaurant.place_id
                      ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                      : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      </div>
    </div>
  );
};

export default MapContainer;  
