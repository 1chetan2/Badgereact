// import React, { useState, useEffect } from 'react';
// import { Table, Button, Space, Typography, Tag, Modal, message, Card } from 'antd';
// import {
//     EditOutlined,
//     DeleteOutlined,
//     PlusOutlined,
//     ExclamationCircleOutlined
// } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';
// import api from '../../services/api';

// const { Title, Text } = Typography;
// const { confirm } = Modal;

// const UsersListPage = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/users');
          
//             const dataWithKeys = (response.data || []).map(user => ({
//                 ...user,
//                 key: user.id || user._id
//             }));
//             setUsers(dataWithKeys);
//         } catch (error) {
//             console.error('Failed to fetch users:', error);
//             message.error('Could not load users. You might not have permission.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const handleDelete = (id) => {
//         confirm({
//             title: 'Are you sure you want to delete this user?',
//             icon: <ExclamationCircleOutlined />,
//             content: 'This action cannot be undone.',
//             okText: 'Yes, Delete',
//             okType: 'danger',
//             cancelText: 'Cancel',
//             onOk: async () => {
//                 try {
//                     await api.delete(`/users/${id}`);
//                     message.success('User deleted successfully');
                    
//                     setUsers(users.filter(user => (user.id || user._id) !== id));
//                 } catch (error) {
//                     console.error('Delete user error:', error);
//                     message.error('Failed to delete user');
//                 }
//             }
//         });
//     };

//     const columns = [
//         {
//             title: 'Email',
//             dataIndex: 'email',
//             key: 'email',
//         },
//         {
//             title: 'Role',
//             dataIndex: 'role',
//             key: 'role',
//             render: (role) => {
//                 const isAdmin = role === 'Admin' || role === 'OrganizationAdmin';
//                 return (
//                     <Tag color={isAdmin ? 'purple' : 'blue'}>
//                         {role || 'User'}
//                     </Tag>
//                 );
//             }
//         },
       
//         {
//             title: 'Actions',
//             key: 'actions',
//             render: (_, record) => (
//                 <Space size="middle">
//                     <Button
//                         type="text"
//                         icon={<EditOutlined style={{ color: '#1890ff' }} />}
//                         onClick={() => navigate(`/users/edit/${record.id || record._id}`)}
//                     />
//                     <Button
//                         type="text"
//                         danger
//                         icon={<DeleteOutlined />}
//                         onClick={() => handleDelete(record.id || record._id)}
//                     />
//                 </Space>
//             ),
//         },
//     ];

//     return (
//         <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
//                 <div>
//                     <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Users Management</Title>
//                     {/*<Text type="secondary">Manage members within your organization.</Text>*/}
//                 </div>
//                 <Button
//                     type="primary"
//                     icon={<PlusOutlined />}
//                     size="large"
//                     onClick={() => navigate('/users/create')}
//                     style={{ borderRadius: '6px' }}
//                 >
//                     Add User
//                 </Button>
//             </div>

//             <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
//                 <Table
//                     columns={columns}
//                     dataSource={users}
//                     loading={loading}
//                     pagination={{ pageSize: 10 }}
//                     scroll={{ x: true }}
//                 />
//             </Card>
//         </div>
//     );
// };

// export default UsersListPage;

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, Tag, Modal, message, Card } from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title } = Typography;
const { confirm } = Modal;

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            const dataWithKeys = (response.data || []).map(user => ({
                ...user,
                key: user.id || user._id
            }));

            setUsers(dataWithKeys);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            message.error('Could not load users. You might not have permission.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (id) => {
        confirm({
            title: 'Are you sure you want to delete this user?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await api.delete(`/users/${id}`);
                    message.success('User deleted successfully');

                    setUsers(prev =>
                        prev.filter(user => (user.id || user._id) !== id)
                    );
                } catch (error) {
                    console.error('Delete user error:', error);
                    message.error('Failed to delete user');
                }
            }
        });
    };

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                const isAdmin =
                    role === 'Admin' || role === 'OrganizationAdmin';
                return (
                    <Tag color={isAdmin ? 'purple' : 'blue'}>
                        {role || 'User'}
                    </Tag>
                );
            }
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="text"
                        icon={<EditOutlined style={{ color: '#1890ff' }} />}
                        onClick={() =>
                            navigate(`/users/edit/${record.id || record._id}`)
                        }
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() =>
                            handleDelete(record.id || record._id)
                        }
                    />
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 24
                }}
            >
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>
                    Users Management
                </Title>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate('/users/create')}
                    style={{ borderRadius: '6px' }}
                >
                    Add User
                </Button>
            </div>

            <Card
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: 'none'
                }}
            >
                <Table
                    rowKey={(record) => record.id || record._id}   // ✅ Important Fix
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        showTotal: (total) => `Total ${total} users`
                    }}
                    scroll={{ x: true }}
                />
            </Card>
        </div>
    );
};

export default UsersListPage;