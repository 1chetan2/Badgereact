import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon, color, textColor = 'text-dark' }) => (
        <Card className="shadow-sm border-0 h-100 rounded-3">
            <Card.Body className="d-flex align-items-center p-4">
                <div
                    className={`rounded-3 d-flex align-items-center justify-content-center me-4 bg-light`}
                    style={{ width: '60px', height: '60px', color: color }}
                >
                    <i className={`bi ${icon} fs-2`}></i>
                </div>
                <div>
                    <h6 className="text-secondary fw-semibold mb-1">{title}</h6>
                    <h2 className={`fw-bold mb-0 ${textColor}`}>{value}</h2>
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Dashboard</h2>
                <p className="text-secondary">Overview of your BadgeCraft jobs and templates.</p>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="g-4 flex-column">
                    <Row className="g-4 mb-4">
                        <Col xs={12} md={4}>
                            <StatCard
                                title="Total Jobs"
                                value={stats.totalJobs}
                                icon="bi-stack"
                                color="#6f42c1"
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <StatCard
                                title="Completed Jobs"
                                value={stats.completedJobs}
                                icon="bi-check-circle"
                                color="#198754"
                                textColor="text-success"
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <StatCard
                                title="Failed Jobs"
                                value={stats.failedJobs}
                                icon="bi-x-circle"
                                color="#dc3545"
                                textColor="text-danger"
                            />
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col xs={12} md={isAdmin ? 6 : 12}>
                            <StatCard
                                title="Total Templates"
                                value={stats.totalTemplates}
                                icon="bi-file-earmark-image"
                                color="#0d6efd"
                            />
                        </Col>
                        {isAdmin && (
                            <Col xs={12} md={6}>
                                <StatCard
                                    title="Total Users"
                                    value={stats.totalUsers}
                                    icon="bi-people"
                                    color="#fd7e14"
                                />
                            </Col>
                        )}
                    </Row>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
