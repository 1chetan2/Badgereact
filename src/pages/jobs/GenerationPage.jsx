import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Container, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const GenerationPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // Status: 'Idle', 'Processing', 'Completed', 'Failed'
    const [status, setStatus] = useState('Idle');
    const [jobDetails, setJobDetails] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (!jobId) {
            navigate('/dashboard');
            return;
        }

        const fetchInitialStatus = async () => {
            try {
                const res = await api.get(`/Csv/job-info/${jobId}`);
                setJobDetails(res.data);

                if (['PdfGenerated', 'Completed'].includes(res.data.status)) {
                    setStatus('Completed');
                    setPdfUrl(`/api/Csv/${jobId}/download`);
                } else if (res.data.status === 'Failed') {
                    setStatus('Failed');
                    setErrorMsg(res.data.errorMessage || 'An unknown error occurred during generation.');
                } else if (res.data.status === 'Processing') {
                    setStatus('Processing');
                }
            } catch (error) {
                console.error('Failed to load job details:', error);
            }
        };

        fetchInitialStatus();
    }, [jobId, navigate]);

    // Polling
    useEffect(() => {
        let intervalId;
        if (status === 'Processing') {
            intervalId = setInterval(async () => {
                try {
                    const res = await api.get(`/Csv/job-info/${jobId}`);
                    const newStatus = res.data.status;
                    setJobDetails(res.data);

                    if (['PdfGenerated', 'Completed'].includes(newStatus)) {
                        setStatus('Completed');
                        setPdfUrl(`/api/Csv/${jobId}/download`);
                        clearInterval(intervalId);
                    } else if (newStatus === 'Failed') {
                        setStatus('Failed');
                        setErrorMsg(res.data.errorMessage || 'An error occurred during generation.');
                        clearInterval(intervalId);
                    }
                } catch (error) {
                    console.error('Polling error:', error);
                }
            }, 3000);
        }
        return () => intervalId && clearInterval(intervalId);
    }, [status, jobId]);

    const handleGenerate = async () => {
        try {
            setStatus('Processing');
            await api.post(`/Csv/${jobId}/generate`);
        } catch (error) {
            console.error('Generation trigger failed:', error);
            setStatus('Failed');
            setErrorMsg(error.response?.data?.message || error.message);
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            const baseUrl = api.defaults.baseURL.replace('/api', '');
            window.open(`${baseUrl}${pdfUrl}`, '_blank');
        }
    };

    const getProgressValue = () => {
        if (status === 'Idle') return 33;
        if (status === 'Processing') return 66;
        if (status === 'Completed') return 100;
        return 100;
    };

    return (
        <div>
            <div className="mb-4">
                <h2 className="fw-bold text-dark">Generate Badges</h2>
                <p className="text-secondary">Review and generate your layout combined with your data.</p>
            </div>

            <Card className="shadow-sm border-0 rounded-4 mb-4">
                <Card.Body className="p-4">
                    <div className="mb-3 d-flex justify-content-between">
                        <span className="small fw-semibold text-secondary text-uppercase">Generation Progress</span>
                        <span className="small fw-bold text-primary">{getProgressValue()}%</span>
                    </div>
                    <ProgressBar
                        animated={status === 'Processing'}
                        now={getProgressValue()}
                        variant={status === 'Failed' ? 'danger' : 'primary'}
                        className="rounded-pill"
                        style={{ height: '10px' }}
                    />
                    <Row className="mt-3 text-center small text-secondary">
                        <Col>Mapped</Col>
                        <Col>Generating</Col>
                        <Col>Complete</Col>
                    </Row>
                </Card.Body>
            </Card>

            {status === 'Idle' && (
                <Card className="shadow-sm border-0 rounded-4 text-center p-5">
                    <div className="mb-4">
                        <i className="bi bi-play-circle text-primary opacity-50" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h3 className="fw-bold">Ready to Generate</h3>
                    <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '500px' }}>
                        Your CSV data ({jobDetails?.totalRecords || 'pending'} records) has been mapped to your template successfully.
                        Click below to begin the bulk PDF compilation.
                    </p>
                    <div className="d-flex justify-content-center">
                        <Button
                            variant="primary"
                            size="lg"
                            className="rounded-pill px-5 py-3 fw-bold shadow-sm"
                            onClick={handleGenerate}
                        >
                            <i className="bi bi-gear-fill me-2 spin-slow"></i> Start Generation
                        </Button>
                    </div>
                </Card>
            )}

            {status === 'Processing' && (
                <Card className="shadow-sm border-0 rounded-4 text-center p-5">
                    <div className="mb-4">
                        <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                    </div>
                    <h3 className="fw-bold text-primary">Building your PDF...</h3>
                    <p className="text-secondary mx-auto mb-0" style={{ maxWidth: '500px' }}>
                        Please wait while QuestPDF compiles your badges. This may take a minute depending on the size of your data.
                    </p>
                </Card>
            )}

            {status === 'Failed' && (
                <Card className="shadow-sm border-0 rounded-4 text-center p-5 border-top border-4 border-danger">
                    <div className="mb-4">
                        <i className="bi bi-exclamation-triangle-fill text-danger display-1"></i>
                    </div>
                    <h3 className="fw-bold">Generation Failed</h3>
                    <Alert variant="danger" className="mx-auto mb-4 small" style={{ maxWidth: '600px' }}>
                        {errorMsg || "An unexpected error occurred while building your files."}
                    </Alert>
                    <div className="d-flex justify-content-center gap-3">
                        <Button variant="outline-danger" className="rounded-pill px-4" onClick={handleGenerate}>
                            Try Again
                        </Button>
                        <Button variant="light" className="rounded-pill px-4" onClick={() => navigate('/dashboard')}>
                            Back to Dashboard
                        </Button>
                    </div>
                </Card>
            )}

            {status === 'Completed' && (
                <div className="animate-fade-in">
                    <Card className="shadow-sm border-0 rounded-4 text-center p-5 mb-4 bg-success bg-opacity-10 border border-success border-opacity-25">
                        <div className="mb-3">
                            <i className="bi bi-patch-check-fill text-success" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h2 className="fw-bold text-success mb-2">Success!</h2>
                        <h4 className="fw-bold text-dark mb-4">Your Badges are Ready</h4>
                        <div className="d-flex justify-content-center gap-3">
                            <Button variant="success" size="lg" className="rounded-pill px-4 fw-bold shadow-sm" onClick={handleDownload}>
                                <i className="bi bi-download me-2"></i> Download PDF
                            </Button>
                            <Button variant="outline-primary" size="lg" className="rounded-pill px-4 fw-bold" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                                <i className="bi bi-eye me-2"></i> Preview Below
                            </Button>
                        </div>
                    </Card>

                    <Card className="shadow-sm border-0 rounded-4 overflow-hidden mt-5">
                        <Card.Header className="bg-white py-3 px-4 border-bottom d-flex align-items-center justify-content-between">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-file-pdf me-2 text-danger"></i> PDF Preview</h5>
                            <Button variant="link" className="text-decoration-none p-0" onClick={handleDownload}>
                                Open in New Tab <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                            </Button>
                        </Card.Header>
                        <Card.Body className="p-0 bg-light" style={{ height: '700px' }}>
                            <iframe
                                src={pdfUrl ? `${api.defaults.baseURL.replace('/api', '')}${pdfUrl}${pdfUrl.includes('?') ? '&' : '?'}inline=true` : ''}
                                width="100%"
                                height="100%"
                                title="PDF Preview"
                                className="border-0 shadow-lg"
                            />
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default GenerationPage;
