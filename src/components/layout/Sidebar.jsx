import React from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hasRole } = useAuth();

    const isAdmin = hasRole('Admin') || hasRole('OrganizationAdmin') || hasRole('OrgAdmin');

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
        ...(isAdmin ? [{ path: '/templates', label: 'Templates', icon: 'bi-file-earmark-image' }] : []),
        { path: '/generate', label: 'Generate', icon: 'bi-plus-square' },
        { path: '/jobs', label: 'Jobs', icon: 'bi-list-ul' },
        ...(isAdmin ? [{ path: '/users', label: 'Users', icon: 'bi-people' }] : []),
    ];

    return (
        <div
            className="bg-white border-end shadow-sm flex-shrink-0"
            style={{
                width: collapsed ? '80px' : '250px',
                height: '100vh',
                position: 'fixed',
                transition: 'width 0.3s ease',
                zIndex: 1000,
                overflowX: 'hidden'
            }}
        >
            <div className="d-flex align-items-center justify-content-center p-3 mb-3 border-bottom" style={{ height: '64px' }}>
                <span className="h5 mb-0 fw-bold text-primary">
                    {collapsed ? 'BC' : 'BadgeCraft'}
                </span>
            </div>

            <Nav className="flex-column px-2">
                {menuItems.map((item) => (
                    <Nav.Link
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`d-flex align-items-center mb-1 rounded p-2 ${location.pathname === item.path ? 'bg-primary text-white shadow-sm' : 'text-dark hover-bg-light'
                            }`}
                        style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                        <i className={`bi ${item.icon} ${collapsed ? 'mx-auto fs-4' : 'me-3 fs-5'}`}></i>
                        {!collapsed && <span>{item.label}</span>}
                    </Nav.Link>
                ))}
            </Nav>
        </div>
    );
};

export default Sidebar;
