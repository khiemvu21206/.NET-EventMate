import { EventType } from "@/components/event/eventDetail/OtherEventComponent";
import createRepository from "@/ultilities/createRepository";
import { getAuthInfo } from "@/ultilities/auth";


import axios from 'axios';

export enum ResponseKeys {
  AccountCreated = 'AccountCreated',
  EventCreationFailed = 'EventCreationFailed',
  InvalidRequest = 'InvalidRequest',
  InvalidEventTime = 'InvalidEventTime',
  ErrorSystem = 'ErrorSystem'
}

export interface RequestList {
  currentPage: number;
  pageSize: number;
  keySearch?: string;
  sortBy?: string;
  ascending?: boolean;
}

export interface Event {
  eventId: string;
  name: string;
  place: string;
  createdAt: string;
  timeStart: string;
  timeEnd: string;
  img?: string;
  description: string;
  type: string;
  status: string;
  organizerName: string;
  organizerLogo?: string;
  organizerDescription: string;
  banner?: string;
}

export interface SimpleEvent {
  eventId: string;
  name: string;
  banner?: string;
}

export interface ApiResponse<T> {
  status: number;
  key: string;
  data: T;
  timestamp: number;
}

export interface EventCreateModel {
  name: string;
  place: string;
  timeStart: string;
  timeEnd: string;
  img?: File;
  description: string;
  type: number;
  organizerName: string;
  organizerLogo?: File;
  organizerDescription: string;
  userId?: string;
  banner?: File;
}

export interface EventUpdateModel {
  TimeStart: string;
  TimeEnd: string;
  banner?: File;
}

export enum BannerStatus {
  Actived = 3,
  Active = 1,
  Inactive = 0
}

export interface EventListResponse {
  totalCount: number;
  currentPage: number;
  data: Event[];
}

export interface BannerDto {
  eventId: string;
  name: string;
  banner?: string;
  bannerStatus: BannerStatus;
}

export interface BannerListResponse {
  totalCount: number;
  currentPage: number;
  data: BannerDto[];
}

const UserRoles = {
  Admin: '28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4',
  Organizer: 'ECEDF9DF-DB0E-46A5-B150-870C634E5DBB'
} as const;

export const EventRepository = createRepository({
  getEventById: async (fetch, eventId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/${eventId}`);
    return response;
  },

  getSimpleEventById: async (fetch, eventId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/${eventId}`);
    return response;
  },

  getSimilarEvents: async (fetch, eventType: EventType) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/similar/${Number(eventType)}`);
    return response;
  },

getListEvents: async (fetch, params: RequestList) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/events_list`, {
      method: 'POST',
      data: params,
    });
    return response;
  },

  getBannerList: async (fetch, params: RequestList) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/banners`, {
      method: 'POST',
      data: params,
    });
    return response;
  },

  getEventsByUser: async (fetch, userId: string, params: RequestList) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/user/${userId}`, {
      method: 'POST',
      data: params,
    });
    return response;
  },

  changeEventStatus: async (fetch, eventId: string, newStatus: number) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/change-status/${eventId}`, {
      method: 'PUT',
      data: newStatus,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  changeBannerStatus: async (fetch, eventId: string, newStatus: BannerStatus) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/change-banner-status/${eventId}`, {
      method: 'PUT',
      data: newStatus,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  },

  getEventsByOrganizer: async (fetch, params: RequestList) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/organizer`, {
      method: 'POST',
      data: params,
    });
    return response;
  },

  updateEvent: async (fetch, eventId: string, eventData: EventUpdateModel) => {
    const formData = new FormData();

    const timeStart = new Date(eventData.TimeStart).toISOString().replace('T', ' ').slice(0, 19) + '.0000000';
    const timeEnd = new Date(eventData.TimeEnd).toISOString().replace('T', ' ').slice(0, 19) + '.0000000';
    formData.append('TimeStart', timeStart);
    formData.append('TimeEnd', timeEnd);

    if (eventData.banner && eventData.banner instanceof File) {
      formData.append('Banner', eventData.banner, eventData.banner.name);
    } else {
      console.warn('Banner không phải File:', eventData.banner);
    }

    console.log('FormData trước khi gửi:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/${eventId}`, formData);

    if (response.status === 200) {
      console.log('Response từ server:', response.data);
      return response.data;
    } else {
      console.error('Lỗi từ server:', response.status, response.data);
      throw new Error('Có lỗi xảy ra khi cập nhật sự kiện');
    }
  },

  createEvent: async (fetch, eventData: EventCreateModel): Promise<ApiResponse<Event>> => {
    const authInfo = getAuthInfo();
    if (!authInfo?.user?.token) {
      throw new Error('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
    }

    if (!authInfo.user.id) {
      throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
    }

    eventData.userId = authInfo.user.id;

    const status = authInfo.user.role === UserRoles.Admin ? 1 : 
                   authInfo.user.role === UserRoles.Organizer ? 0 : 
                   1; // mặc định là 1 nếu không phải admin hoặc organizer

    const validationErrors: string[] = [];
    
    if (!eventData.name || eventData.name.trim().length === 0) {
      validationErrors.push('Tên sự kiện không được bỏ trống');
    }

    if (!eventData.place || eventData.place.trim().length === 0) {
      validationErrors.push('Địa điểm không được bỏ trống');
    }

    if (!eventData.description || eventData.description.trim().length === 0) {
      validationErrors.push('Mô tả không được bỏ trống');
    }

    if (!eventData.organizerName || eventData.organizerName.trim().length === 0) {
      validationErrors.push('Tên người tổ chức không được bỏ trống');
    }

    if (!eventData.organizerDescription || eventData.organizerDescription.trim().length === 0) {
      validationErrors.push('Mô tả người tổ chức không được bỏ trống');
    }

    if (!eventData.timeStart || !eventData.timeEnd) {
      validationErrors.push('Thời gian bắt đầu và kết thúc không được bỏ trống');
    } else {
      const startDate = new Date(eventData.timeStart);
      const endDate = new Date(eventData.timeEnd);
      if (startDate >= endDate) {
        validationErrors.push('Thời gian kết thúc phải sau thời gian bắt đầu');
      }
    }

    if (!eventData.img) {
      validationErrors.push('Ảnh sự kiện là bắt buộc');
    } else {
      if (eventData.img.size > 5 * 1024 * 1024) {
        validationErrors.push('Kích thước ảnh sự kiện không được vượt quá 5MB');
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(eventData.img.type)) {
        validationErrors.push('Định dạng ảnh sự kiện phải là JPG hoặc PNG');
      }
    }

    if (!eventData.organizerLogo) {
      validationErrors.push('Logo người tổ chức là bắt buộc');
    } else {
      if (eventData.organizerLogo.size > 2 * 1024 * 1024) {
        validationErrors.push('Kích thước logo không được vượt quá 2MB');
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(eventData.organizerLogo.type)) {
        validationErrors.push('Định dạng logo phải là JPG hoặc PNG');
      }
    }

    if (eventData.banner) {
      if (eventData.banner.size > 5 * 1024 * 1024) {
        validationErrors.push('Kích thước ảnh banner không được vượt quá 5MB');
      }
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validImageTypes.includes(eventData.banner.type)) {
        validationErrors.push('Định dạng ảnh banner phải là JPG hoặc PNG');
      }
    }

    if (validationErrors.length > 0) {
      throw new Error('Vui lòng kiểm tra lại thông tin:\n' + validationErrors.join('\n'));
    }

    const formData = new FormData();
    
    formData.append('Name', eventData.name.trim());
    formData.append('Place', eventData.place.trim());
    formData.append('TimeStart', eventData.timeStart);
    formData.append('TimeEnd', eventData.timeEnd);
    formData.append('Description', eventData.description.trim());
    formData.append('Type', eventData.type.toString());
    formData.append('OrganizerName', eventData.organizerName.trim());
    formData.append('OrganizerDescription', eventData.organizerDescription.trim());
    formData.append('Status', status.toString());
    if (eventData.userId) {
      formData.append('UserId', eventData.userId);
    }

    if (eventData.img) {
      formData.append('Img', eventData.img, eventData.img.name);
    }
    if (eventData.organizerLogo) {
      formData.append('OrganizerLogo', eventData.organizerLogo, eventData.organizerLogo.name);
    }
    if (eventData.banner) {
      formData.append('banner', eventData.banner, eventData.banner.name);
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/Event`,
      formData,
      {
        headers: {

          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const responseData = response.data;
    
    if (response.status === 201) {
      return responseData;
    }

    switch (responseData.key) {
      case ResponseKeys.EventCreationFailed:
        throw new Error('Không thể tạo sự kiện. Vui lòng kiểm tra lại thông tin và thử lại.');
      case ResponseKeys.InvalidRequest:
        throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
      case ResponseKeys.InvalidEventTime:
        throw new Error('Thời gian bắt đầu phải trước thời gian kết thúc.');
      case ResponseKeys.ErrorSystem:
        throw new Error('Lỗi hệ thống: ' + responseData.data);
      default:
        throw new Error(responseData.message || responseData.data || 'Lỗi tạo sự kiện');
    }
  },
});

export const getEventById = async (eventId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error fetching event');
    }
    throw new Error('Error fetching event');
  }
};

export const EventRepository1 = createRepository({
  getListEvents: async (fetch, data: RequestList) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Event/events_list`, {
      method: "POST",
      data,
    });
    return response;
  },
});

