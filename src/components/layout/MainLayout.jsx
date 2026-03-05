import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="d-flex" style={{ minHeight: '100vh', background: '#f8fafc' }}>
            {/* Sidebar */}
            <Sidebar collapsed={collapsed} />

            {/* Main Content Area */}
            <div
                className="flex-grow-1 d-flex flex-column"
                style={{
                    marginLeft: collapsed ? '80px' : '250px',
                    transition: 'margin-left 0.3s ease',
                    minWidth: 0 // Prevent content from overflowing flex parent
                }}
            >
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
                <main className="p-4 flex-grow-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
