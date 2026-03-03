import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, Button, Card, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/jobs');
            const dataWithKeys = (response.data || []).map(job => ({
                ...job,
                key: job.id || job._id
            }));
            setJobs(dataWithKeys);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            message.error('Could not load jobs history.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDownload = (job) => {
        const jobId = job.id || job._id;
        if (job.downloadUrl) {
            window.open(job.downloadUrl, '_blank');
        } else {
            const fullUrl = `${api.defaults.baseURL}/jobs/${jobId}/download`;
            window.open(fullUrl, '_blank');
        }
    };

    const columns = [
        {
            title: 'Job ID',
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => <Text strong>{record.id || record._id}</Text>,
        },
        {
            title: 'Template Name',
            dataIndex: 'templateName',
            key: 'templateName',
            render: (text) => text || 'Unknown Template',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'Completed' || status === 'PdfGenerated') color = 'success';
                if (status === 'Processing') color = 'processing';
                if (status === 'Failed') color = 'error';

                return (
                    <Tag color={color}>
                        {status === 'PdfGenerated' ? 'Completed' : (status || 'Unknown')}
                    </Tag>
                );
            },
            filters: [
                { text: 'Completed', value: 'Completed' },
                { text: 'PdfGenerated', value: 'PdfGenerated' },
                { text: 'Processing', value: 'Processing' },
                { text: 'Failed', value: 'Failed' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleString() : 'N/A',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    disabled={record.status !== 'Completed' && record.status !== 'PdfGenerated'}
                    onClick={() => handleDownload(record)}
                >
                    Download
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Job History</Title>
                {/*<Text type="secondary">View and download your previously generated badges.</Text>*/}
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
                <Table
                    columns={columns}
                    dataSource={jobs}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default JobsPage;
