import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
                organizationName,
            });

            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.message || 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                        <div className="text-center mb-4">
                            <h1 className="fw-bold text-primary display-5 mb-1">BadgeCraft</h1>
                           
                        </div>

                        <Card className="shadow border-0 rounded-4 overflow-hidden">
                            <Card.Body className="p-4 p-md-5">
                                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                                <Form onSubmit={handleRegister}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-semibold text-secondary">Full Name</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-person text-muted"></i>
                                                    </span>
                                                    <Form.Control
                                                        type="text"
                                                        
                                                        className="bg-light border-start-0 ps-0"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label className="small fw-semibold text-secondary">Organization Name</Form.Label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light border-end-0">
                                                        <i className="bi bi-building text-muted"></i>
                                                    </span>
                                                    <Form.Control
                                                        type="text"
                                                      
                                                        className="bg-light border-start-0 ps-0"
                                                        value={organizationName}
                                                        onChange={(e) => setOrganizationName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="small fw-semibold text-secondary">Email Address</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-envelope text-muted"></i>
                                            </span>
                                            <Form.Control
                                                type="email"
                                               
                                                className="bg-light border-start-0 ps-0"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="small fw-semibold text-secondary">Password</Form.Label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0">
                                                <i className="bi bi-lock text-muted"></i>
                                            </span>
                                            <Form.Control
                                                type="password"
                                               
                                                className="bg-light border-start-0 ps-0"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                        <Form.Text className="text-muted small">
                                            Must be at least 6 characters.
                                        </Form.Text>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2 fw-bold shadow-sm rounded-3 mb-3 d-flex align-items-center justify-content-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : 'Create Account'}
                                    </Button>

                                    <div className="text-center">
                                       
                                        <Button
                                            variant="link"
                                            className="p-0 small fw-semibold text-decoration-none"
                                            onClick={() => navigate('/login')}
                                        >
                                            Sign in 
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RegisterPage;
