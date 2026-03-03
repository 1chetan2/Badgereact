import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await api.post('/auth/register', {
                name: values.name,
                email: values.email,
                password: values.password,
                organizationName: values.organizationName,
            });

            message.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : undefined) ||
                'Registration failed. Please check your details and try again.';

            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <Card
                className="auth-card"
                style={{ width: '100%', maxWidth: 480, borderRadius: '16px' }}
                bodyStyle={{ padding: '40px 32px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <Title level={2} style={{ color: '#4f46e5', margin: 0, fontWeight: 800 }}>Join BadgeCraft</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>Create your account to start designing</Text>
                </div>

                <Form
                    name="register_form"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    size="large"
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="John Doe" style={{ borderRadius: '8px' }} disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        label="Organization Name"
                        name="organizationName"
                        rules={[{ required: true, message: 'Please input your organization!' }]}
                    >
                        <Input prefix={<BankOutlined style={{ color: '#94a3b8' }} />} placeholder="Acme Corp" style={{ borderRadius: '8px' }} disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="name@company.com" style={{ borderRadius: '8px' }} disabled={loading} />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' }
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="••••••••" style={{ borderRadius: '8px' }} disabled={loading} />
                    </Form.Item>

                    <Form.Item style={{ marginTop: 8 }}>
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
                            Create Account
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text type="secondary">Already have an account? </Text>
                        <Button type="link" onClick={() => navigate('/login')} style={{ padding: 0 }}>
                            Sign in instead
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;
