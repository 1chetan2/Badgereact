import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, message } from 'antd';
import {
    FileImageOutlined,
    AppstoreOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined
} from '@ant-design/icons';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalTemplates: 0,
        totalJobs: 0,
        completedJobs: 0,
        failedJobs: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);
    
    const { hasRole } = useAuth();
    
    const isAdmin = hasRole('Admin') || hasRole('OrganizationAdmin') || hasRole('OrgAdmin');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats({
                    totalTemplates: response.data.totalTemplates || 0,
                    totalJobs: response.data.totalJobs || 0,
                    completedJobs: response.data.completedJobs || 0,
                    failedJobs: response.data.failedJobs || 0,
                    totalUsers: response.data.totalUsers || 0,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
                message.error("Could not load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const activeCardStyle = {
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: 'none',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Dashboard</Title>
                <Text type="secondary">Overview of your BadgeCraft jobs and templates.</Text>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                    <Spin size="large" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Top Row: Jobs Statistics */}
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={8}>
                            <Card style={activeCardStyle} hoverable bodyStyle={{ padding: '24px' }}>
                                <Statistic
                                    title={<Text strong style={{ color: '#6b7280', fontSize: '14px' }}>Total Jobs</Text>}
                                    value={stats.totalJobs}
                                    prefix={<AppstoreOutlined style={{ color: '#722ed1', marginRight: '8px' }} />}
                                    valueStyle={{ color: '#111827', fontWeight: 600, fontSize: '28px', marginTop: '12px' }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Card style={activeCardStyle} hoverable bodyStyle={{ padding: '24px' }}>
                                <Statistic
                                    title={<Text strong style={{ color: '#6b7280', fontSize: '14px' }}>Completed Jobs</Text>}
                                    value={stats.completedJobs}
                                    prefix={<CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />}
                                    valueStyle={{ color: '#52c41a', fontWeight: 600, fontSize: '28px', marginTop: '12px' }}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Card style={activeCardStyle} hoverable bodyStyle={{ padding: '24px' }}>
                                <Statistic
                                    title={<Text strong style={{ color: '#6b7280', fontSize: '14px' }}>Failed Jobs</Text>}
                                    value={stats.failedJobs}
                                    prefix={<CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: '8px' }} />}
                                    valueStyle={{ color: '#ff4d4f', fontWeight: 600, fontSize: '28px', marginTop: '12px' }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Bottom Row: Templates and Users */}
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                            <Card
                                style={activeCardStyle}
                                hoverable
                                bodyStyle={{ padding: '24px' }}
                            >
                                <Statistic
                                    title={<Text strong style={{ color: '#6b7280', fontSize: '14px' }}>Total Templates</Text>}
                                    value={stats.totalTemplates}
                                    prefix={<FileImageOutlined style={{ color: '#1890ff', marginRight: '8px' }} />}
                                    valueStyle={{ color: '#111827', fontWeight: 600, fontSize: '28px', marginTop: '12px' }}
                                />
                            </Card>
                        </Col>

                        {isAdmin && (
                            <Col xs={24} md={12}>
                                <Card style={activeCardStyle} hoverable bodyStyle={{ padding: '24px' }}>
                                    <Statistic
                                        title={<Text strong style={{ color: '#6b7280', fontSize: '14px' }}>Total Users</Text>}
                                        value={stats.totalUsers}
                                        prefix={<UserOutlined style={{ color: '#fa8c16', marginRight: '8px' }} />}
                                        valueStyle={{ color: '#111827', fontWeight: 600, fontSize: '28px', marginTop: '12px' }}
                                    />
                                </Card>
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
