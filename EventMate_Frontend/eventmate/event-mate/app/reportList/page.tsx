'use client';

import React, { useEffect, useState } from 'react';
import ListReportComponent from '@/components/reportList/ListReportComponent';
import { Report, ReportRepository, UpdateReportStatusDTO } from '@/repositories/ReportRepository';
import { message } from 'antd';

const ReportListPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const data = await ReportRepository.getAllReports();
            setReports(data);
        } catch (error) {
            message.error('Failed to fetch reports');
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (updateDTO: UpdateReportStatusDTO) => {
        try {
            const updatedReport = await ReportRepository.updateReportStatus(updateDTO);
            setReports(prevReports =>
                prevReports.map(report =>
                    report.reportId === updatedReport.reportId ? updatedReport : report
                )
            );
            message.success('Status updated successfully');
        } catch (error) {
            message.error('Failed to update status');
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ListReportComponent
            reports={reports}
            onStatusUpdate={handleStatusUpdate}
        />
    );
};

export default ReportListPage;
