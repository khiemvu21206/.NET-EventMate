// // RestaurantList.tsx  

// // RestaurantList.tsx  
// import React from 'react';  

// interface Place {  
//   place_id: string;  
//   name: string;  
//   price_level?: number; // Assuming a price_level property for price filtering  
//   geometry: {  
//     location: {  
//       lat: number;  
//       lng: number;  
//     };  
//   };  
// }  

// interface RestaurantListProps {  
//   restaurants: Place[];  
//   selectedPlace: string | null;  
//   onRestaurantClick: (restaurant: Place) => void;  
//   priceRange: number; // Added prop to specify selected price range  
// }  

// const filterRestaurantsByPrice = (restaurants: Place[], priceRange: number): Place[] => {  
//   return restaurants.filter((restaurant) => {  
//     if (restaurant.price_level === undefined) return false; // Skip if price level is not defined  
//     switch (priceRange) {  
//       case 1:  
//         return restaurant.price_level >= 0 && restaurant.price_level <= 1; // 0 to 200,000 VND  
//       case 2:  
//         return restaurant.price_level > 1 && restaurant.price_level <= 2; // 200,000 VND to 500,000 VND  
//       case 3:  
//         return restaurant.price_level > 2 && restaurant.price_level <= 3; // 500,000 VND to 1,000,000 VND  
//       case 4:  
//         return restaurant.price_level > 3; // 1,000,000 VND and more  
//       default:  
//         return true; // Show all restaurants if no filter is selected  
//     }  
//   });  
// };  

// const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, selectedPlace, onRestaurantClick, priceRange }) => {  
//   const filteredRestaurants = filterRestaurantsByPrice(restaurants, priceRange);  

//   return (  
//     <div style={{ marginTop: '20px' }}> {/* Margin top for spacing */}  
//       <h2>Restaurant List</h2>  
//       <ul>  
//         {filteredRestaurants.map((restaurant) => (  
//           <li  
//             key={restaurant.place_id}  
//             onClick={() => onRestaurantClick(restaurant)}  
//             style={{  
//               cursor: 'pointer',  
//               margin: '5px 0',  
//               padding: '5px',  
//               border: selectedPlace === restaurant.place_id ? '1px solid blue' : '1px solid transparent',  
//             }}  
//           >  
//             {restaurant.name}  
//           </li>  
//         ))}  
//       </ul>  
//     </div>  
//   );  
// };  

// export default RestaurantList;
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

interface RestaurantListProps {
  restaurants: Place[];
  selectedPlace: string | null;
  onRestaurantClick: (restaurant: Place) => void;
  priceRange: number;
  ratingRange: number;
  proximity: number;
  center: { lat: number; lng: number };
  getPhotoUrl: (photoReference: string) => string;
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

const filterRestaurants = (restaurants: Place[], priceRange: number, ratingRange: number, proximity: number, center: { lat: number; lng: number }): Place[] => {
  return restaurants.filter((restaurant) => {
    const priceFilter = priceRange === 0 || (restaurant.price_level && restaurant.price_level === priceRange);
    const ratingFilter = ratingRange === 0 || (restaurant.rating && restaurant.rating >= ratingRange && restaurant.rating < ratingRange + 1);
    const proximityFilter = proximity === 0 || calculateDistance(center.lat, center.lng, restaurant.geometry.location.lat, restaurant.geometry.location.lng) <= proximity;

    return priceFilter && ratingFilter && proximityFilter;
  });
};

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants, selectedPlace, onRestaurantClick, priceRange, ratingRange, proximity, center, getPhotoUrl }) => {
  const filteredRestaurants = filterRestaurants(restaurants, priceRange, ratingRange, proximity, center);

  return (
    <div className="p-4">
      <ul className="divide-y divide-gray-200">
        {filteredRestaurants.map(restaurant => (
          <li
            key={restaurant.place_id}
            onClick={() => onRestaurantClick(restaurant)}
            className={`p-4 transition-all duration-200 rounded-lg cursor-pointer ${selectedPlace === restaurant.place_id ? "bg-gray-200 shadow-md" : "hover:bg-gray-100"
            }`}
          >
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden shadow-sm">
                <img
                  src={restaurant.photos?.[0] ? getPhotoUrl(restaurant.photos[0].photo_reference) : 'https://via.placeholder.com/96'}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
                <div className="flex items-center space-x-1 mt-2">
                  <FaStar className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1 text-base font-medium text-gray-800">{restaurant.rating || "N/A"}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantList;