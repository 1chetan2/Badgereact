import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EditUserPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'User'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);
                setFormData({
                    name: response.data.name,
                    email: response.data.email,
                    role: response.data.role || 'User',
                });
            } catch (error) {
                console.error('Failed to fetch user:', error);
                navigate('/users');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await api.put(`/users/${id}`, formData);
            navigate('/users');
        } catch (error) {
            console.error('Update user error:', error);
            setError(error.response?.data?.message || 'Failed to update user.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 d-flex align-items-center">
                <Button variant="link" className="text-dark p-0 me-3" onClick={() => navigate('/users')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </Button>
                <div>
                    <h2 className="fw-bold text-dark mb-0">Edit User</h2>
                    <p className="text-secondary mb-0">Modify organization member details and roles.</p>
                </div>
            </div>

            <Row className="justify-content-center">
                <Col lg={7}>
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <Form.Control
                                            name="name"
                                            type="text"
                                            placeholder="Enter full name"
                                            className="bg-light border-start-0 ps-0"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <Form.Control
                                            name="email"
                                            type="email"
                                            className="bg-light border-start-0 ps-0"
                                            value={formData.email}
                                            disabled // Email usually can't be changed
                                        />
                                    </div>
                                    <Form.Text className="text-muted small">Email cannot be changed after creation.</Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold text-secondary">User Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        className="bg-light border-0"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                        <option value="OrganizationAdmin">Organization Admin</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2 pt-2">
                                    <Button
                                        variant="light"
                                        className="px-4 rounded-pill fw-semibold"
                                        onClick={() => navigate('/users')}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="px-5 rounded-pill fw-bold shadow-sm"
                                        disabled={saving}
                                    >
                                        {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-check2-circle me-2"></i>}
                                        Save Changes
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditUserPage;