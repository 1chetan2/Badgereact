import React from 'react';
import { Navbar as BootNavbar, Container, Dropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <BootNavbar bg="white" className="border-bottom shadow-sm py-2 sticky-top" style={{ height: '64px' }}>
            <Container fluid className="px-3">
                <Button
                    variant="link"
                    className="text-dark p-0 me-3"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <i className={`bi ${collapsed ? 'bi-text-indent-left' : 'bi-text-indent-right'} fs-4`}></i>
                </Button>

                <div className="ms-auto d-flex align-items-center">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="link"
                            id="dropdown-user"
                            className="d-flex align-items-center text-decoration-none text-dark p-1 rounded hover-bg-light border-0 shadow-none"
                        >
                            <div
                                className="bg-primary text-white d-flex align-items-center justify-content-center rounded-circle me-2"
                                style={{ width: '32px', height: '32px', fontSize: '14px' }}
                            >
                                <i className="bi bi-person"></i>
                            </div>
                            <span className="fw-semibold d-none d-sm-inline">
                                {user?.name || user?.email?.split('@')[0] || 'User'}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow border-0 mt-2">
                            <Dropdown.Item onClick={handleLogout} className="text-danger d-flex align-items-center py-2">
                                <i className="bi bi-box-arrow-right me-2"></i> Logout
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </BootNavbar>
    );
};

export default Navbar;
