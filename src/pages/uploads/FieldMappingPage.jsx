import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Spinner, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const FieldMappingPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [csvColumns, setCsvColumns] = useState([]);
    const [templateFields, setTemplateFields] = useState([]);
    const [mapping, setMapping] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMappingData = async () => {
            try {
                const jobRes = await api.get(`/Csv/job-info/${jobId}`);
                const job = jobRes.data;

                const previewRes = await api.get(`/Csv/${jobId}/preview`);
                const columns = previewRes.data && previewRes.data.length > 0 ? Object.keys(previewRes.data[0]) : [];
                setCsvColumns(columns);

                const template = job.template || job.Template;
                const backendFields = template?.fields || template?.Fields || [];

                const dynamicFields = backendFields
                    .filter(f => ['TEXT', 'IMAGE', 'QR'].includes((f.type || f.Type || '').toUpperCase()))
                    .map(f => ({
                        id: (f.id || f.Id).toString(),
                        type: (f.type || f.Type || '').toUpperCase(),
                        name: f.key || f.Key
                    }));

                setTemplateFields(dynamicFields);

                // Auto-map
                const initialMapping = {};
                dynamicFields.forEach(field => {
                    const match = columns.find(c => c.toLowerCase() === field.name.toLowerCase());
                    if (match) initialMapping[field.id] = match;
                });
                setMapping(initialMapping);

            } catch (error) {
                console.error('Mapping load error:', error);
                setError('Failed to load job mapping data.');
            } finally {
                setLoading(false);
            }
        };

        if (jobId) fetchMappingData();
    }, [jobId]);

    const handleMapChange = (fieldId, val) => {
        setMapping(prev => ({ ...prev, [fieldId]: val }));
    };

    const handleSaveMapping = async () => {
        setSaving(true);
        try {
            const finalMapping = {};
            Object.keys(mapping).forEach(fieldId => {
                if (mapping[fieldId]) finalMapping[fieldId] = mapping[fieldId];
            });

            await api.post(`/Csv/${jobId}/mapping`, finalMapping);
            navigate(`/jobs/${jobId}/generate`); // Updated to navigate to generate page
        } catch (error) {
            setError('Failed to save mapping.');
        } finally {
            setSaving(false);
        }
    };

    const unmappedCount = templateFields.filter(f => !mapping[f.id]).length;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 d-flex align-items-center">
                <Button variant="link" className="text-dark p-0 me-3" onClick={() => navigate('/uploads/csv')}>
                    <i className="bi bi-arrow-left fs-4"></i>
                </Button>
                <div>
                    <h2 className="fw-bold text-dark mb-0">Map Columns</h2>
                    <p className="text-secondary mb-0">Connect your CSV columns to the design template fields.</p>
                </div>
            </div>

            {error && <Alert variant="danger" className="mb-4 small">{error}</Alert>}

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Header className="bg-white border-bottom py-3 px-4">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-link-45deg me-2 text-primary"></i> Template Fields</h5>
                        </Card.Header>
                        <Card.Body className="p-4 px-md-5">
                            {templateFields.map((field, idx) => (
                                <div key={field.id} className={`${idx !== templateFields.length - 1 ? 'mb-4 pb-4 border-bottom' : ''}`}>
                                    <Row className="align-items-center">
                                        <Col md={5}>
                                            <div className="fw-bold text-dark">{field.name}</div>
                                            <div className="small text-muted">Type: {field.type}</div>
                                        </Col>
                                        <Col md={1} className="text-center d-none d-md-block text-muted">
                                            <i className="bi bi-chevron-right"></i>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Select
                                                className={`bg-light border-0 ${!mapping[field.id] ? 'is-invalid' : 'is-valid'}`}
                                                value={mapping[field.id] || ''}
                                                onChange={(e) => handleMapChange(field.id, e.target.value)}
                                            >
                                                <option value="">Select CSV Column...</option>
                                                {csvColumns.map(col => <option key={col} value={col}>{col}</option>)}
                                            </Form.Select>
                                            {!mapping[field.id] && <div className="invalid-feedback small">Required mapping</div>}
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                            {templateFields.length === 0 && (
                                <div className="text-center py-5 text-muted">
                                    No mappable fields found in this template.
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm border-0 rounded-4 border-top border-4 border-primary position-sticky" style={{ top: '88px' }}>
                        <Card.Body className="p-4">
                            <h5 className="fw-bold mb-4">Summary</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-secondary">Mappable Fields:</span>
                                <span className="fw-bold">{templateFields.length}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="text-secondary">Unmapped:</span>
                                <span className={`fw-bold ${unmappedCount > 0 ? 'text-danger' : 'text-success'}`}>{unmappedCount}</span>
                            </div>

                            <Button
                                variant="primary"
                                className="w-100 py-2 fw-bold rounded-pill shadow-sm"
                                disabled={unmappedCount > 0 || saving}
                                onClick={handleSaveMapping}
                            >
                                {saving ? <Spinner animation="border" size="sm" className="me-1" /> : <i className="bi bi-check2-circle me-1"></i>}
                                Confirm & Proceed
                            </Button>

                            {unmappedCount > 0 && (
                                <p className="text-center text-muted small mt-3">
                                    Please map all fields to continue.
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FieldMappingPage;
