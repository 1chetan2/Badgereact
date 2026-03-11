import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const CsvUploadPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [jobId, setJobId] = useState(null);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/BadgeTemplates');
                setTemplates(response.data || []);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                setError('Please select a CSV file.');
                setFile(null);
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB.');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedTemplateId || !file) {
            setError('Please select both a template and a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('templateId', selectedTemplateId);

        setUploading(true);
        setError('');
        try {
            const response = await api.post('/Csv/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newJobId = response.data.jobId || response.data.id;
            setJobId(newJobId);
            fetchPreview(newJobId);
        } catch (error) {
            console.error('Upload error:', error);
            setError('Failed to upload CSV. Please try again.');
            setUploading(false);
        }
    };

    const fetchPreview = async (id) => {
        try {
            const response = await api.get(`/Csv/${id}/preview`);
            if (response.data && response.data.length > 0) {
                const columns = Object.keys(response.data[0]);
                setPreviewData({ columns, rows: response.data });
            } else {
                setPreviewData({ columns: [], rows: [] });
            }
        } catch (error) {
            setError('Could not load preview.');
        } finally {
            setUploading(false);
        }
    };

    if (previewData && jobId) {
        return (
            <div>
                <div className="text-center mb-5 py-4 bg-white rounded-4 shadow-sm border">
                    <div className="mb-3">
                        <i className="bi bi-check-circle-fill text-success display-4"></i>
                    </div>
                    <h2 className="fw-bold">Upload Successful!</h2>
                    <p className="text-secondary mb-4">Review the parsed CSV data below before proceeding.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="light" onClick={() => { setPreviewData(null); setJobId(null); setFile(null); }} className="rounded-pill px-4">
                            Start Over
                        </Button>
                        <Button variant="primary" onClick={() => navigate(`/uploads/mapping/${jobId}`)} className="rounded-pill px-4">
                            Proceed to Mapping <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                    </div>
                </div>

                <Card className="shadow-sm border-0 rounded-4 overflow-hidden">
                    <Card.Header className="bg-white border-bottom py-3 px-4">
                        <h5 className="mb-0 fw-bold"><i className="bi bi-table me-2 text-primary"></i> Data Preview</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="table-responsive">
                            <Table hover className="mb-0 small align-middle">
                                <thead className="bg-light text-secondary">
                                    <tr>
                                        {previewData.columns.map(col => <th key={col} className="px-4 py-3 border-0">{col}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.rows.map((row, idx) => (
                                        <tr key={idx}>
                                            {previewData.columns.map(col => <td key={col} className="px-4 py-3 border-bottom-0 text-secondary">{row[col]}</td>)}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Upload Attendees</h2>
                <p className="text-secondary">Select a template and securely upload your CSV attendee list.</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4 p-md-5">
                            {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold text-dark mb-2">1. Select Badge Template</Form.Label>
                                <Form.Select
                                    size="lg"
                                    className="bg-light border-0 rounded-3"
                                    value={selectedTemplateId}
                                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                                >
                                    <option value="">Choose a template...</option>
                                    {templates.filter(t => t.status === 'Published').map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-5">
                                <Form.Label className="fw-semibold text-dark mb-2">2. Upload CSV File</Form.Label>
                                <div
                                    className="border-2 border-dashed rounded-4 p-5 text-center bg-light cursor-pointer hover-bg-light-plus"
                                    style={{ borderStyle: 'dashed', borderColor: '#dee2e6' }}
                                    onClick={() => document.getElementById('csvFileInput').click()}
                                >
                                    <input
                                        type="file"
                                        id="csvFileInput"
                                        className="d-none"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                    />
                                    <i className="bi bi-cloud-arrow-up display-3 text-primary opacity-50 mb-3"></i>
                                    {file ? (
                                        <div className="fw-bold text-primary">{file.name}</div>
                                    ) : (
                                        <>
                                            <p className="mb-1 fw-medium text-dark">Click to browse or drag and drop</p>
                                            <p className="text-muted small mb-0">Only CSV files supported (Max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </Form.Group>

                            <Button
                                variant="primary"
                                size="lg"
                                className="w-100 py-3 fw-bold rounded-3 shadow-sm border-0"
                                onClick={handleUpload}
                                disabled={uploading || !file || !selectedTemplateId}
                            >
                                {uploading ? (
                                    <><Spinner animation="border" size="sm" className="me-2" /> Processing...</>
                                ) : 'Next: Parse & Preview'}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CsvUploadPage;
