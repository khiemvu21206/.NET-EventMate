import axios from 'axios';

export interface Report {
    reportId: string;
    title: string;
    description: string;
    orderId: string;
    userId: string;
    status: number;
    userName: string;
    orderTotalPrice: number;
    orderCreatedAt: string;
}

export interface UpdateReportStatusDTO {
    reportId: string;
    newStatus: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7121/api';

export const ReportRepository = {
    getAllReports: async (): Promise<Report[]> => {
        const response = await axios.get(`${API_URL}/Reports`);
        return response.data;
    },

    getReportById: async (id: string): Promise<Report> => {
        const response = await axios.get(`${API_URL}/Reports/${id}`);
        return response.data;
    },

    updateReportStatus: async (updateDTO: UpdateReportStatusDTO): Promise<Report> => {
        const response = await axios.put(`${API_URL}/Reports/status`, updateDTO);
        return response.data;
    }
};
