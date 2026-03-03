import React from 'react';
import { Layout, Dropdown, Menu, Avatar, Typography, Button, Space } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#ff4d4f' }} />,
            label: <span style={{ color: '#ff4d4f' }}>Logout</span>,
            onClick: handleLogout,
        },
    ];

    return (
        <Header
            style={{
                padding: '0 24px',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,21,41,.08)',
                zIndex: 1
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                        marginLeft: -24,
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                    <div style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        transition: 'background 0.3s'
                    }}
                        className="avatar-dropdown-trigger"
                    >
                        <Avatar
                            style={{ backgroundColor: '#1890ff' }}
                            icon={<UserOutlined />}
                        />
                        <Space style={{ marginLeft: 8 }} className="user-name-text">
                            <Text strong>{user?.name || user?.email || 'User'}</Text>
                        </Space>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
};

export default Navbar;
