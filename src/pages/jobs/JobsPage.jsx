import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Badge, Spinner, Pagination } from 'react-bootstrap';
import api from '../../services/api';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // Toggle sort
    const [currentPage, setCurrentPage] = useState(1);
    const RECORDS_PER_PAGE = 6;

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/jobs');
            setJobs(response.data || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDownload = (job) => {
        const jobId = job.id || job._id;
        const fullUrl = `${api.defaults.baseURL}/jobs/${jobId}/download`;
        window.open(fullUrl, '_blank');
    };

    const sortedJobs = [...jobs].sort((a, b) => {
        const idA = a.id || a._id;
        const idB = b.id || b._id;
        return sortOrder === 'asc' ? idA - idB : idB - idA;
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedJobs.length / RECORDS_PER_PAGE);
    const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
    const currentRecords = sortedJobs.slice(indexOfFirstRecord, indexOfLastRecord);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleSortToggle = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setCurrentPage(1); // Reset to first page on sort
    };

    const StatusBadge = ({ status }) => {
        let variant = 'secondary';
        let label = status || 'Unknown';

        if (status === 'Completed' || status === 'PdfGenerated') {
            variant = 'success';
            label = 'Completed';
        } else if (status === 'Processing') {
            variant = 'info';
        } else if (status === 'Failed') {
            variant = 'danger';
        }

        return <Badge bg={variant} className="rounded-pill fw-medium">{label}</Badge>;
    };

    return (
        <div>
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-bold text-dark">Job History</h2>
                    <p className="text-secondary">Track and download your badge generation jobs.</p>
                </div>
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
                                                Job ID <i className={`bi bi-sort-numeric-${sortOrder === 'asc' ? 'up' : 'down'} ms-1`}></i>
                                            </th>
                                            <th className="py-3 border-0">Template Name</th>
                                            <th className="py-3 border-0">Status</th>
                                            <th className="py-3 border-0">Created At</th>
                                            <th className="px-4 py-3 border-0 text-end">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentRecords.map((job) => (
                                            <tr key={job.id || job._id}>
                                                <td className="px-4 py-3 fw-semibold">#{job.id || job._id}</td>
                                                <td className="py-3 text-secondary">{job.templateName || 'Unknown'}</td>
                                                <td className="py-3">
                                                    <StatusBadge status={job.status} />
                                                </td>
                                                <td className="py-3 text-secondary">
                                                    {job.createdAt ? new Date(job.createdAt).toLocaleString() : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        disabled={job.status !== 'Completed' && job.status !== 'PdfGenerated'}
                                                        onClick={() => handleDownload(job)}
                                                        className="rounded-pill"
                                                    >
                                                        <i className="bi bi-download me-1"></i> Download
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {jobs.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="text-center py-5 text-secondary">
                                                    No jobs found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-between align-items-center p-3 border-top">
                                    <small className="text-muted">
                                        Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, sortedJobs.length)} of {sortedJobs.length} records
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
        </div>
    );
};


export default JobsPage;
