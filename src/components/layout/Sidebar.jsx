import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    DashboardOutlined,
    FileImageOutlined,
    AppstoreAddOutlined,
    ProfileOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hasRole } = useAuth();

    const { token } = theme.useToken();

    // In a real multi-tenant app, you might have specific role naming
    // e.g. "OrganizationAdmin", "Admin", "User", "OrganizationUser"
    // I am using "Admin" checking strictly what was requested
    // Adjust 'Admin' to your actual claim if it differs
    const isAdmin = hasRole('Admin') || hasRole('OrganizationAdmin') || hasRole('OrgAdmin');

    const getMenuItems = () => {
        // Base items for all authenticated users
        const items = [
            {
                key: '/dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
            },
        ];

        // Admin-only template management
        if (isAdmin) {
            items.push({
                key: '/templates',
                icon: <FileImageOutlined />,
                label: 'Templates',
            });
        }

        // Generate and Jobs for everyone
        items.push({
            key: '/generate',
            icon: <AppstoreAddOutlined />,
            label: 'Generate',
        });
        items.push({
            key: '/jobs',
            icon: <ProfileOutlined />,
            label: 'Jobs',
        });

        // Admin-only user management
        if (isAdmin) {
            items.push({
                key: '/users',
                icon: <TeamOutlined />,
                label: 'Users',
            });
        }

        return items;
    };

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="light"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
            }}
        >
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '16px',
                background: 'rgba(0, 0, 0, 0.04)',
                borderRadius: token.borderRadiusLG,
                overflow: 'hidden'
            }}>
                <span style={{
                    color: token.colorPrimary,
                    fontWeight: 700,
                    fontSize: collapsed ? '12px' : '18px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                }}>
                    {collapsed ? 'BC' : 'BadgeCraft'}
                </span>
            </div>

            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={getMenuItems()}
                onClick={({ key }) => navigate(key)}
                style={{ borderRight: 0 }}
            />
        </Sider>
    );
};

export default Sidebar;
