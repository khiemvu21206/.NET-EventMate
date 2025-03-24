'use client';

import { useEffect, useState } from 'react';
import { ReportRepository, Report, UpdateReportStatusDTO } from '@/repositories/ReportRepository';
import ReportDetailComponent from '@/components/reportDetails/ReportDetailComponent';

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const [report, setReport] = useState<Report | null>(null);
    const reportId = params.id;

    useEffect(() => {
        const fetchReport = async () => {
            if (reportId) {
                try {
                    const data = await ReportRepository.getReportById(reportId);
                    setReport(data);
                } catch (error) {
                    console.error('Error loading report:', error);
                }
            }
        };

        fetchReport();
    }, [reportId]);

    const handleStatusUpdate = async (updateDTO: UpdateReportStatusDTO) => {
        try {
            const updatedReport = await ReportRepository.updateReportStatus(updateDTO);
            setReport(updatedReport);
        } catch (error) {
            console.error('Error updating report status:', error);
            throw error;
        }
    };

    if (!report) {
        return <div>Loading...</div>;
    }

    return <ReportDetailComponent report={report} onStatusUpdate={handleStatusUpdate} />;
} 