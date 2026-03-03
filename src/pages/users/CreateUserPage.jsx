import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Row, Col } from 'antd';
import {
    UserOutlined,
    MailOutlined,
    LockOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const CreateUserPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            // Posting to backend User creation endpoint
            await api.post('/users', {
                name: values.name,
                email: values.email,
                password: values.password,
                role: values.role,
            });

            message.success('User created successfully!');
            navigate('/users');

        } catch (error) {
            console.error('Create user error:', error);
            const errorMsg = error.response?.data?.message ||
                (typeof error.response?.data === 'string' ? error.response.data : undefined) ||
                'Failed to create user. Please check the details.';

            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/users')}
                    style={{ marginRight: 16 }}
                />
                <div>
                    <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Create User</Title>
                    {/* <Text type="secondary">Add a new member to your organization.</Text> */}
                </div>
            </div>

            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
                        <Form
                            name="create_user_form"
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                            initialValues={{ role: 'User' }} // Set a default appropriate behavior
                        >
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[{ required: true, message: 'Please input the full name!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Enter full name"
                                    disabled={loading}
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: 'Please input the email address!' },
                                    { type: 'email', message: 'Please enter a valid email format!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="xyz@example.com"
                                    disabled={loading}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Temporary Password"
                                rules={[
                                    { required: true, message: 'Please input a password!' },
                                    { min: 6, message: 'Password must be at least 6 characters!' }
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                                    placeholder="Enter a secure password"
                                    disabled={loading}
                                />
                            </Form.Item>

                            <Form.Item
                                name="role"
                                label="User Role"
                                rules={[{ required: true, message: 'Please select a role!' }]}
                            >
                                <Select disabled={loading} placeholder="Select a role">
                                    <Option value="User">User</Option>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="OrganizationAdmin">Organization Admin</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item style={{ marginTop: 32, marginBottom: 0, textAlign: 'right' }}>
                                <Button
                                    onClick={() => navigate('/users')}
                                    style={{ marginRight: 16 }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    style={{ borderRadius: 6 }}
                                >
                                    Create User
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateUserPage;
