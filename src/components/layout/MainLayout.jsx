import React, { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const { Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar collapsed={collapsed} />
            <Layout style={{
                marginLeft: collapsed ? 80 : 200,
                transition: 'all 0.2s ease-in-out',
                background: '#f8fafc',
                minHeight: '100vh'
            }}>
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <Content style={{
                    padding: '0',
                    minHeight: 'calc(100vh - 64px)',
                    overflow: 'initial'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
