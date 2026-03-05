import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Badge, Spinner, Modal, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const TemplateListPage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 6;
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await api.get('/BadgeTemplates');
            setTemplates(response.data || []);
        } catch (error) {
            console.error('Failed to fetch templates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/BadgeTemplates/${selectedId}`);
            setTemplates(templates.filter(t => t.id !== selectedId));
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Delete template error:', error);
        }
    };

    const sortedTemplates = [...templates].sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return sortOrder === 'asc'
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedTemplates.length / RECORDS_PER_PAGE);
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = sortedTemplates.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleSortToggle = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark">Badge Templates</h2>
                    <p className="text-secondary">Manage and organize your badge designs.</p>
                </div>
                <Button
                    variant="primary"
                    className="rounded-pill px-4"
                    onClick={() => navigate('/templates/create')}
                >
                    <i className="bi bi-plus-lg me-2"></i> Create Template
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
                                            <th
                                                className="px-4 py-3 border-0 cursor-pointer"
                                                onClick={handleSortToggle}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Template Name <i className={`bi bi-sort-alpha-${sortOrder === 'asc' ? 'down' : 'up'} ms-1`}></i>
                                            </th>
                                            <th className="py-3 border-0">Status</th>
                                            <th className="py-3 border-0">Created At</th>
                                            <th className="px-4 py-3 border-0 text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((t) => (
                                            <tr key={t.id}>
                                                <td className="px-4 py-3 fw-semibold text-primary">{t.name}</td>
                                                <td className="py-3">
                                                    <Badge bg={t.status === 'Published' ? 'success' : 'warning'} className="rounded-pill">
                                                        {t.status || 'Draft'}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 text-secondary">
                                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <Button
                                                        variant="link"
                                                        className="text-primary p-1 me-2"
                                                        onClick={() => navigate(`/templates/edit/${t.id}`)}
                                                    >
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </Button>
                                                    <Button
                                                        variant="link"
                                                        className="text-danger p-1"
                                                        onClick={() => handleDeleteClick(t.id)}
                                                    >
                                                        <i className="bi bi-trash fs-5"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {templates.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-5 text-secondary">
                                                    No templates found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                    <small className="text-muted">
                                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedTemplates.length)} of {sortedTemplates.length} records
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
                    <Modal.Title className="fw-bold text-danger">Delete Template?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-secondary pb-4">
                    Are you sure you want to delete this template? This will not affect already generated badges but will prevent creating new jobs with this template.
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="light" onClick={() => setShowDeleteModal(false)} className="rounded-pill px-4">
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete} className="rounded-pill px-4">
                        Yes, Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};


export default TemplateListPage;
