import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: values.email,
                password: values.password,
            });

            const token = response.data?.token || response.data?.accessToken || (typeof response.data === 'string' ? response.data : null);

            if (token) {
                login(token);
                message.success('Login successful!');
                navigate('/dashboard');
            } else {
                message.error('Token not found in response.');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : undefined) ||
                'Login failed. Please check your credentials and try again.';

            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <Card
                className="auth-card"
                style={{ width: '100%', maxWidth: 420, borderRadius: '16px' }}
                bodyStyle={{ padding: '40px 32px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2} style={{ color: '#4f46e5', margin: 0, fontWeight: 800 }}>BadgeCraft</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>Sign in to your account</Text>
                </div>

                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                            placeholder="name@company.com"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        style={{ marginBottom: 8 }}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                            placeholder="••••••••"
                            style={{ borderRadius: '8px' }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderRadius: '8px',
                                background: '#4f46e5',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.4)',
                                marginTop: '24px'
                            }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text type="secondary">Don't have an account? </Text>
                        <Button type="link" onClick={() => navigate('/register')} style={{ padding: 0 }}>
                            Create account
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
