import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data?.token || response.data?.accessToken || (typeof response.data === 'string' ? response.data : null);

            if (token) {
                login(token);
                navigate('/dashboard');
            } else {
                setError('Authentication failed: Token not provided');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex align-items-center">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={5} xl={4}>
                        <div className="text-center mb-4">
                            <h1 className="fw-bold text-primary display-5 mb-1">BadgeCraft</h1>
                            
                        </div>

                        <Card className="shadow border-0 rounded-4 overflow-hidden">
                            <Card.Body className="p-4 p-md-5">
                                {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
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

                                    <Form.Group className="mb-4" controlId="formBasicPassword">
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
                                            />
                                        </div>
                                    </Form.Group>

                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2 fw-bold shadow-sm rounded-3 mb-3 d-flex align-items-center justify-content-center"
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner animation="border" size="sm" className="me-2" /> : 'Sign In'}
                                    </Button>

                                    <div className="text-center">
                                        <span className="text-secondary small">Don't have an account? </span>
                                        <Button
                                            variant="link"
                                            className="p-0 small fw-semibold text-decoration-none"
                                            onClick={() => navigate('/register')}
                                        >
                                            Create account
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

export default LoginPage;
