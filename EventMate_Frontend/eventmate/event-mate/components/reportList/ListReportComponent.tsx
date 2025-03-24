'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/ReportComponent.module.css';
import { Report, ReportRepository, UpdateReportStatusDTO } from '@/repositories/ReportRepository';
import { format } from 'date-fns';
import Image from 'next/image';
import { Select, DatePicker, Input, Button } from 'antd';
import Link from 'next/link';

interface ListReportComponentProps {
    reports: Report[];
    onStatusUpdate: (updateDTO: UpdateReportStatusDTO) => Promise<void>;
}

const ListReportComponent: React.FC<ListReportComponentProps> = ({ reports = [], onStatusUpdate }) => {
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const reportsPerPage = 10;

    // Thêm hàm chuyển đổi status text sang số
    const getStatusNumber = (statusText: string): number => {
        switch (statusText) {
            case 'Open':
                return 0;
            case 'InProgress':
                return 1;
            case 'Resolved':
                return 2;
            case 'Closed':
                return 3;
            default:
                return -1;
        }
    };

    useEffect(() => {
        if (!reports) return;
        
        let filtered = [...reports];
        if (statusFilter !== 'All') {
            console.log('Status Filter:', statusFilter);
            console.log('Status Number:', getStatusNumber(statusFilter));
            filtered = filtered.filter(report => {
                console.log('Report Status:', report.status);
                return Number(report.status) === getStatusNumber(statusFilter);
            });
        }

        if (dateRange[0] && dateRange[1]) {
            filtered = filtered.filter(report => {
                const reportDate = new Date(report.orderCreatedAt);
                return reportDate >= dateRange[0]! && reportDate <= dateRange[1]!;
            });
        }

        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.userName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReports(filtered);
    }, [reports, statusFilter, dateRange, searchTerm]);

    const getPriorityClass = (title: string): string => {
        if (title.toLowerCase().includes('payment')) return styles.priorityHigh;
        if (title.toLowerCase().includes('charge')) return styles.priorityMedium;
        return styles.priorityLow;
    };

    const getPriorityText = (title: string): string => {
        if (title.toLowerCase().includes('payment')) return 'High';
        if (title.toLowerCase().includes('charge')) return 'Medium';
        return 'Low';
    };

    const getStatusText = (status: number): string => {
        switch (status) {
            case 0:
                return 'Open';
            case 1:
                return 'In Progress';
            case 2:
                return 'Resolved';
            case 3:
                return 'Closed';
            default:
                return 'Unknown';
        }
    };

    const getStatusClass = (status: number): string => {
        switch (status) {
            case 0:
                return styles.statusOpen;
            case 1:
                return styles.statusInProgress;
            case 2:
                return styles.statusResolved;
            case 3:
                return styles.statusClosed;
            default:
                return '';
        }
    };

    // Pagination
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

    if (!reports) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    Transaction Complaints
                    <span className={styles.activeCount}>{filteredReports.length} Active Cases</span>
                </div>
                <Button type="primary">Export</Button>
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <span>Status:</span>
                    <Select
                        defaultValue="All"
                        style={{ width: 120 }}
                        onChange={value => setStatusFilter(value)}
                        options={[
                            { value: 'All', label: 'All Status' },
                            { value: 'Open', label: 'Open' },
                            { value: 'InProgress', label: 'In Progress' },
                            { value: 'Resolved', label: 'Resolved' },
                            { value: 'Closed', label: 'Closed' }
                        ]}
                    />
                </div>
                <div className={styles.filterGroup}>
                    <span>Date Range:</span>
                    <DatePicker.RangePicker
                        onChange={(dates) => {
                            if (dates) {
                                setDateRange([dates[0]?.toDate() || null, dates[1]?.toDate() || null]);
                            } else {
                                setDateRange([null, null]);
                            }
                        }}
                    />
                </div>
                <Input.Search
                    placeholder="Search complaints..."
                    style={{ width: 250 }}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.tableHeader}>ID</th>
                        <th className={styles.tableHeader}>Customer</th>
                        <th className={styles.tableHeader}>Issue</th>
                        <th className={styles.tableHeader}>Status</th>
                        <th className={styles.tableHeader}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReports.map((report) => (
                        <tr key={report.reportId} className={styles.tableRow}>
                            <td className={styles.tableCell}>#{report.reportId.slice(0, 4)}</td>
                            <td className={styles.tableCell}>{report.userName}</td>
                            <td className={styles.tableCell}>{report.title}</td>
                            <td className={styles.tableCell}>
                                <span className={`${styles.statusText} ${getStatusClass(Number(report.status))}`}>
                                    {getStatusText(Number(report.status))}
                                </span>
                            </td>
                            <td className={styles.tableCell}>
                                <Link href={`/reportDetails/${report.reportId}`}>
                                    <Button type="primary" size="small">
                                        View Details
                                    </Button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <div className={styles.paginationInfo}>
                    Showing {indexOfFirstReport + 1} to {Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} entries
                </div>
                <div className={styles.paginationControls}>
                    <Button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                            key={page}
                            type={currentPage === page ? "primary" : "default"}
                            onClick={() => setCurrentPage(page)}
                        >
                            {page}
                        </Button>
                    ))}
                    <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ListReportComponent;
