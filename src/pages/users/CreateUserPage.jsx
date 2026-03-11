import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CreateUserPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'OrgUser',
        isGranted: true
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'radio' ? value === 'true' : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/users', formData);
            navigate('/users');
        } catch (error) {
            console.error('Create user error:', error);
            setError(error.response?.data?.message || 'Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-4 d-flex align-items-center">
                <Button variant="link" className="text-dark p-0 me-3" onClick={() => navigate('/users')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </Button>
                <div>
                    <h2 className="fw-bold text-dark mb-0">Create User</h2>
                    <p className="text-secondary mb-0">Add a new member to your organization.</p>
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
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-semibold text-secondary">Temporary Password</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="bi bi-lock"></i>
                                        </span>
                                        <Form.Control
                                            name="password"
                                            type="password"
                                           
                                            className="bg-light border-start-0 ps-0"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold text-secondary">User Role</Form.Label>
                                    <Form.Select
                                        name="role"
                                        className="bg-light border-0"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="OrgUser">Organization User</option>
                                        <option value="OrgAdmin">Organization Admin</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="small fw-semibold text-secondary d-block">User Status</Form.Label>
                                    <div className="d-flex gap-3 mt-2">
                                        <div
                                            className={`flex-fill p-3 rounded-4 border-2 cursor-pointer text-center transition-all ${formData.isGranted ? 'border-primary bg-primary bg-opacity-10 text-primary fw-bold' : 'border-light bg-light text-secondary'}`}
                                            onClick={() => setFormData({ ...formData, isGranted: true })}
                                            style={{ transition: 'all 0.2s' }}
                                        >
                                             Active
                                        </div>
                                        <div
                                            className={`flex-fill p-3 rounded-4 border-2 cursor-pointer text-center transition-all ${!formData.isGranted ? 'border-danger bg-danger bg-opacity-10 text-danger fw-bold' : 'border-light bg-light text-secondary'}`}
                                            onClick={() => setFormData({ ...formData, isGranted: false })}
                                            style={{ transition: 'all 0.2s' }}
                                        >
                                            Inactive
                                        </div>
                                    </div>
                                    
                                </Form.Group>

                                <div className="d-flex justify-content-end gap-2 pt-2">
                                    <Button
                                        variant="light"
                                        className="px-4 rounded-pill fw-semibold"
                                        onClick={() => navigate('/users')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="px-4 rounded-pill fw-bold shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-plus-lg me-2"></i>}
                                        Create User
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

export default CreateUserPage;
