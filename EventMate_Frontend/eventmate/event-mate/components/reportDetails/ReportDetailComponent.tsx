'use client';
import React, { useState } from 'react';
import { Button, Input, Select, message } from 'antd';
import styles from '@/styles/ReportDetail.module.css';
import { Report, UpdateReportStatusDTO } from '@/repositories/ReportRepository';
import { format } from 'date-fns';

interface ReportDetailProps {
    report: Report;
    onStatusUpdate: (updateDTO: UpdateReportStatusDTO) => Promise<void>;
}

const ReportDetailComponent: React.FC<ReportDetailProps> = ({ report, onStatusUpdate }) => {
    const [internalNote, setInternalNote] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<number>(Number(report.status));

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

    const getStatusBadgeClass = (status: number): string => {
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

    const handleStatusChange = (newStatus: number) => {
        setSelectedStatus(newStatus);
    };

    const handleResolveComplaint = async () => {
        try {
            await onStatusUpdate({
                reportId: report.reportId,
                newStatus: selectedStatus
            });
            message.success('Report status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Failed to update report status');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Button type="link" href="/reportList">← Transaction Complaint List</Button>
                </div>
                <div className={styles.headerRight}>
                    <Button danger>Mark as Urgent</Button>
                    <Button type="primary" onClick={handleResolveComplaint} style={{ backgroundColor: '#10B981', borderColor: '#10B981' }}>Resolve Complaint</Button>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.mainContent}>
                    <div className={styles.complaintHeader}>
                        <h2>Complaint #{report.reportId.slice(0, 8)}</h2>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(Number(report.status))}`}>
                            {getStatusText(Number(report.status))}
                        </span>
                    </div>

                    <div className={styles.customerInfo}>
                        <div className={styles.avatar}>
                            {report.userName.charAt(0)}
                        </div>
                        <div className={styles.userDetails}>
                            <h3>{report.userName}</h3>
                            <p>Submitted on {format(new Date(report.orderCreatedAt), 'MMM dd, yyyy at HH:mm')}</p>
                        </div>
                    </div>

                    <div className={styles.issueDescription}>
                        <h3>Issue Description</h3>
                        <p>{report.description}</p>
                    </div>

                    <div className={styles.transactionDetails}>
                        <h3>Order Details</h3>
                        <div className={styles.detailsGrid}>
                            <div className={styles.detailItem}>
                                <label>Order ID</label>
                                <p><a href={`/orders/${report.orderId}`} className={styles.orderLink}>{report.orderId.slice(0, 8)}</a></p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Order Date</label>
                                <p>{format(new Date(report.orderCreatedAt), 'MMM dd, yyyy')}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <label>Amount</label>
                                <p>${report.orderTotalPrice}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h3>Staff Actions</h3>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Update Report Status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            options={[
                                { value: 0, label: 'Open' },
                                { value: 1, label: 'In Progress' },
                                { value: 2, label: 'Resolved' },
                                { value: 3, label: 'Closed' }
                            ]}
                        />
                    </div>

                    <div className={styles.sidebarSection}>
                        <h3>Internal Notes</h3>
                        <Input.TextArea
                            value={internalNote}
                            onChange={(e) => setInternalNote(e.target.value)}
                            placeholder="Add internal notes here..."
                            rows={4}
                        />
                        <Button type="primary" block style={{ 
                            marginTop: '10px', 
                            backgroundColor: '#000000', 
                            borderColor: '#000000',
                            fontWeight: 600 
                        }}>
                            Add Note
                        </Button>
                    </div>

                    <div className={styles.sidebarSection}>
                        <h3>Customer Communication</h3>
                        <Button block style={{ 
                            backgroundColor: '#000000', 
                            borderColor: '#000000',
                            fontWeight: 600,
                            color: '#ffffff'
                        }}>
                            ✉️ Send Email
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailComponent;