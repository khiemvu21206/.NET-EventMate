'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

interface ItemFormData {
  name: string;
  price: number;
  description: string;
  time_start: string;
  time_end: string;
  quantity: number;
  status: string;
  image?: File;
}

interface EventData {
  eventId: string;
  name: string;
  place: string;
  timeStart: string;
  timeEnd: string;
  img: string | null;
  description: string | null;
  status: number;
}

export default function CreateItemPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    price: 0,
    description: '',
    time_start: '',
    time_end: '',
    quantity: 1,
    status: 'active'
  });

  useEffect(() => {
    // TODO: Fetch event data
    const fetchEvent = async () => {
      try {
        // Mô phỏng API call
        const mockEventData: EventData = {
          eventId: "sample-event-id",
          name: "Summer Music Festival 2024",
          place: "Central Park, New York",
          timeStart: "2024-07-01",
          timeEnd: "2024-07-03",
          img: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg",
          description: "Annual summer music festival",
          status: 1
        };
        setEventData(mockEventData);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };
    fetchEvent();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement API call
      console.log(formData);
      router.push('/items'); // Redirect after success
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Item</h1>
            <p className="mt-1 text-sm text-gray-500">Fill in the details about your item</p>
          </div>

          <div className="flex gap-8">
            {/* Left Column - Event Details */}
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={eventData?.img || "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg"}
                        alt={eventData?.name || "Event"}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-base font-semibold text-gray-900 line-clamp-2">
                        {eventData?.name || "Loading..."}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{eventData?.timeStart} - {eventData?.timeEnd}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaMapMarkerAlt className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{eventData?.place}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaUsers className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="text-sm">{eventData?.status === 1 ? "Live" : "Upcoming"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advertisement Banner */}
                <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg"
                      alt="Advertisement"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">Sponsored</h3>
                    <p className="mt-1 text-sm text-gray-500">Discover more events in your area</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Create Item Form */}
            <div className="flex-1">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image Upload Section */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Item Image</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative w-full h-64">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-full object-cover rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFormData(prev => ({ ...prev, image: undefined }));
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="text-gray-600">
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                                  <span>Upload a file</span>
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            className="block w-full pl-7 pr-12 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Time</label>
                          <input
                            type="datetime-local"
                            value={formData.time_start}
                            onChange={(e) => setFormData(prev => ({ ...prev, time_start: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Time</label>
                          <input
                            type="datetime-local"
                            value={formData.time_end}
                            onChange={(e) => setFormData(prev => ({ ...prev, time_end: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.quantity}
                          onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end space-x-4 pt-4">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Creating...' : 'Create Item'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
