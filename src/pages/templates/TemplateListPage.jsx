import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, Modal, message, Card } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { confirm } = Modal;

const TemplateListPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await api.get('/BadgeTemplates');
            const dataWithKeys = (response.data || []).map(template => ({
                ...template,
                key: template.id
            }));
            setTemplates(dataWithKeys);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
            message.error('Could not load templates.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = (id) => {
        confirm({
            title: 'Delete Template?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this template? Any jobs referencing it may be affected.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await api.delete(`/BadgeTemplates/${id}`);
                    message.success('Template deleted successfully');
                    setTemplates(templates.filter(t => t.id !== id));
                } catch (error) {
                    console.error('Delete template error:', error);
                    message.error('Failed to delete template');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Template Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const isPublished = status === 'Published';
                return (
                    <Tag color={isPublished ? 'success' : 'warning'}>
                        {status || 'Draft'}
                    </Tag>
                );
            },
            filters: [
                { text: 'Draft', value: 'Draft' },
                { text: 'Published', value: 'Published' },
            ],
            onFilter: (value, record) => record.status === value || (!record.status && value === 'Draft'),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#1890ff' }} />}
                        onClick={() => navigate(`/templates/edit/${record.id}`)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Badge Templates</Title>
                    {/*<Text type="secondary">Manage and organize your badge designs.</Text>*/}
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate('/templates/create')}
                    style={{ borderRadius: '6px' }}
                >
                    Create Template
                </Button>
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
                <Table
                    columns={columns}
                    dataSource={templates}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default TemplateListPage;
