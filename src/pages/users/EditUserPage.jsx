// import React, { useState, useEffect } from 'react';
// import { Form, Input, Button, Card, Typography, message, Select, Row, Col, Spin } from 'antd';
// import {
//     UserOutlined,
//     MailOutlined,
//     ArrowLeftOutlined
// } from '@ant-design/icons';
// import { useNavigate, useParams } from 'react-router-dom';
// import api from '../../services/api';

// const { Title, Text } = Typography;
// const { Option } = Select;

// const EditUserPage = () => {
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [form] = Form.useForm();
//     const navigate = useNavigate();
//     const { id } = useParams();

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await api.get(`/users/${id}`);
//                 form.setFieldsValue({
//                     name: response.data.name,
//                     email: response.data.email,
//                     role: response.data.role || 'User',
//                 });
//             } catch (error) {
//                 console.error('Failed to fetch user:', error);
//                 message.error('Could not load user details.');
//                 navigate('/users');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (id) {
//             fetchUser();
//         }
//     }, [id, form, navigate]);

//     const onFinish = async (values) => {
//         setSaving(true);
//         try {
//             await api.put(`/users/${id}`, {
//                 name: values.name,
//                 email: values.email,
//                 role: values.role,
//             });

//             message.success('User updated successfully!');
//             navigate('/users');

//         } catch (error) {
//             console.error('Update user error:', error);
//             const errorMsg = error.response?.data?.message ||
//                 (typeof error.response?.data === 'string' ? error.response.data : undefined) ||
//                 'Failed to update user. Please check the details.';

//             message.error(errorMsg);
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px', background: '#f5f7fa' }}>
//                 <Spin size="large" />
//             </div>
//         );
//     }

//     return (
//         <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
//             <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
//                 <Button
//                     type="text"
//                     icon={<ArrowLeftOutlined />}
//                     onClick={() => navigate('/users')}
//                     style={{ marginRight: 16 }}
//                 />
//                 <div>
//                     <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Edit User</Title>
//                     <Text type="secondary">Modify organization member details and roles.</Text>
//                 </div>
//             </div>

//             <Row justify="center">
//                 <Col xs={24} sm={20} md={16} lg={12}>
//                     <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
//                         <Form
//                             form={form}
//                             name="edit_user_form"
//                             layout="vertical"
//                             onFinish={onFinish}
//                             size="large"
//                         >
//                             <Form.Item
//                                 name="name"
//                                 label="Full Name"
//                                 rules={[{ required: true, message: 'Please input the full name!' }]}
//                             >
//                                 <Input
//                                     prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
//                                     placeholder="Jane Doe"
//                                     disabled={saving}
//                                 />
//                             </Form.Item>

//                             <Form.Item
//                                 name="email"
//                                 label="Email Address"
//                                 rules={[
//                                     { required: true, message: 'Please input the email address!' },
//                                     { type: 'email', message: 'Please enter a valid email format!' }
//                                 ]}
//                             >
//                                 <Input
//                                     prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
//                                     placeholder="jane@example.com"
//                                     disabled={true} // Usually email is disabled in edit pages to prevent ID changes
//                                 />
//                             </Form.Item>

//                             <Form.Item
//                                 name="role"
//                                 label="User Role"
//                                 rules={[{ required: true, message: 'Please select a role!' }]}
//                             >
//                                 <Select disabled={saving} placeholder="Select a role">
//                                     <Option value="User">User</Option>
//                                     <Option value="Admin">Admin</Option>
//                                     <Option value="OrganizationAdmin">Organization Admin</Option>
//                                 </Select>
//                             </Form.Item>

//                             <Form.Item style={{ marginTop: 32, marginBottom: 0, textAlign: 'right' }}>
//                                 <Button
//                                     onClick={() => navigate('/users')}
//                                     style={{ marginRight: 16 }}
//                                     disabled={saving}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button
//                                     type="primary"
//                                     htmlType="submit"
//                                     loading={saving}
//                                     style={{ borderRadius: 6 }}
//                                 >
//                                     Save Changes
//                                 </Button>
//                             </Form.Item>
//                         </Form>
//                     </Card>
//                 </Col>
//             </Row>
//         </div>
//     );
// };

// export default EditUserPage;


import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    message,
    Select,
    Row,
    Col,
    Spin
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const EditUserPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {

        if (!id) {
            message.error("Invalid user ID");
            navigate('/users');
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}`);

                form.setFieldsValue({
                    name: response.data?.name,
                    email: response.data?.email,
                    role: response.data?.role || "User"
                });

            } catch (error) {
                console.error("Fetch user error:", error);
                message.error("Could not load user details.");
                navigate("/users");
            } finally {
                setLoading(false);   // ✅ important fix
            }
        };

        fetchUser();

    }, [id, navigate, form]);

    const onFinish = async (values) => {
        setSaving(true);
        try {

            await api.put(`/users/${id}`, {
                name: values.name,
                email: values.email,
                role: values.role
            });

            message.success("User updated successfully!");
            navigate("/users");

        } catch (error) {

            console.error("Update user error:", error);

            const errorMsg =
                error.response?.data?.message ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : null) ||
                "Failed to update user.";

            message.error(errorMsg);

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px"
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, display: "flex", alignItems: "center" }}>
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/users")}
                    style={{ marginRight: 16 }}
                />
                <div>
                    <Title level={2} style={{ margin: 0 }}>Edit User</Title>
                    <Text type="secondary">
                        Modify organization member details and roles.
                    </Text>
                </div>
            </div>

            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12}>
                    <Card>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[
                                    { required: true, message: "Please enter full name" }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    disabled={saving}
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true },
                                    { type: "email", message: "Invalid email format" }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    disabled
                                />
                            </Form.Item>

                            <Form.Item
                                name="role"
                                label="User Role"
                                rules={[
                                    { required: true, message: "Please select role" }
                                ]}
                            >
                                <Select disabled={saving}>
                                    <Option value="User">User</Option>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="OrganizationAdmin">
                                        Organization Admin
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item style={{ marginTop: 24, textAlign: "right" }}>
                                <Button
                                    onClick={() => navigate("/users")}
                                    style={{ marginRight: 12 }}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={saving}
                                >
                                    Save Changes
                                </Button>
                            </Form.Item>

                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default EditUserPage;