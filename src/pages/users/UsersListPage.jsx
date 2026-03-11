import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Badge, Spinner, Modal, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UsersListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 6;

    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users');
            const filtered = (response.data || [])
                .filter(u => u.email !== currentUser?.email);
            setUsers(filtered);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/users/${selectedUserId}`);
            setUsers(users.filter(u => (u.id || u._id) !== selectedUserId));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Delete user error:', error);
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const emailA = a.email || '';
        const emailB = b.email || '';
        return sortOrder === 'asc'
            ? emailA.localeCompare(emailB)
            : emailB.localeCompare(emailA);
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedUsers.length / RECORDS_PER_PAGE);
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = sortedUsers.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleSortToggle = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark">User Management</h2>
                    <p className="text-secondary">Manage organization users and their roles.</p>
                </div>
                <Button
                    variant="primary"
                    className="rounded-pill px-4"
                    onClick={() => navigate('/users/create')}
                >
                    <i className="bi bi-person-plus me-2"></i> Add User
                </Button>
            </div>

            <Card className="shadow-sm border-0 rounded-4">
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="d-flex justify-content-center align-items-center p-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table hover className="align-middle mb-0">
                                    <thead className="bg-light text-secondary">
                                        <tr>
                                            <th className="px-4 py-3 border-0">Full Name</th>
                                            <th
                                                className="py-3 border-0 cursor-pointer"
                                                onClick={handleSortToggle}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Email <i className={`bi bi-sort-alpha-${sortOrder === 'asc' ? 'down' : 'up'} ms-1`}></i>
                                            </th>
                                            <th className="py-3 border-0">Role</th>
                                            <th className="py-3 border-0 text-center">Access</th>
                                            <th className="py-3 border-0">Created At</th>
                                            <th className="px-4 py-3 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((user) => (
                                            <tr key={user.id || user._id}>
                                                <td className="px-4 py-3 fw-medium">{user.name || 'N/A'}</td>
                                                <td className="py-3 text-secondary">{user.email}</td>
                                                <td className="py-3">
                                                    <Badge bg={user.role === 'OrgAdmin' ? 'info' : 'secondary'} className="rounded-pill">
                                                        {user.role === 'OrgAdmin' ? 'Admin' : 'Member'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <Badge bg={user.isGranted ? 'success' : 'danger'} className="rounded-pill">
                                                        {user.isGranted ? 'Granted' : 'Not Granted'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-secondary small">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <Button
                                                        variant="link"
                                                        className="text-primary p-1 me-2"
                                                        onClick={() => navigate(`/users/edit/${user.id || user._id}`)}
                                                    >
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="text-danger p-1"
                                                        onClick={() => handleDeleteClick(user.id || user._id)}
                                                    >
                                                        <i className="bi bi-trash fs-5"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="text-center py-5 text-secondary">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                    <small className="text-muted">
                                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedUsers.length)} of {sortedUsers.length} records
                                    </small>
                                    <Pagination className="mb-0">
                                        <Pagination.Prev
                                            disabled={currentPage === 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                        />
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <Pagination.Item
                                                key={idx + 1}
                                                active={idx + 1 === currentPage}
                                                onClick={() => handlePageChange(idx + 1)}
                                            >
                                                {idx + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            disabled={currentPage === totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-secondary pb-4">
                    Are you sure you want to delete this user? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-pill px-4">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} className="rounded-pill px-4">
                        Delete User
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


export default UsersListPage;