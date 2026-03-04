import React, { useState, useEffect } from 'react';
import {
    Card, Typography, Button, message,
    Steps, Spin, Result, Divider, Space
} from 'antd';
import {
    PlayCircleOutlined,
    DownloadOutlined,
    LoadingOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const GenerationPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    // Status can be: 'Idle', 'Processing', 'Completed', 'Failed'
    const [status, setStatus] = useState('Idle');
    const [jobDetails, setJobDetails] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Initial load: check if the job is already done or processing
    useEffect(() => {
        if (!jobId) {
            navigate('/dashboard');
            return;
        }

        const fetchInitialStatus = async () => {
            try {
                const res = await api.get(`/Csv/${jobId}`);
                setJobDetails(res.data);

                if (res.data.status === 'PdfGenerated' || res.data.status === 'Completed') {
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
                message.error('Could not load job details.');
            }
        };

        fetchInitialStatus();
    }, [jobId, navigate]);

    // Polling effect
    useEffect(() => {
        let intervalId;

        if (status === 'Processing') {
            intervalId = setInterval(async () => {
                try {
                    const res = await api.get(`/Csv/${jobId}`);
                    const newStatus = res.data.status;

                    setJobDetails(res.data);

                    if (newStatus === 'PdfGenerated' || newStatus === 'Completed') {
                        setStatus('Completed');
                        setPdfUrl(`/api/Csv/${jobId}/download`);
                        clearInterval(intervalId);
                        message.success('Badges generated successfully!');
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

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [status, jobId]);

    const handleGenerate = async () => {
        try {
            setStatus('Processing');
            message.info('Generation started. This might take a moment depending on the number of records.');

            await api.post(`/Csv/${jobId}/generate`);
        } catch (error) {
            console.error('Generation trigger failed:', error);
            setStatus('Failed');
            const detail = error.response?.data?.message || error.response?.data || error.message;
            setErrorMsg(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            // pdfUrl is already /api/Csv/${jobId}/download
            const baseUrl = api.defaults.baseURL.replace('/api', '');
            window.open(`${baseUrl}${pdfUrl}`, '_blank');
        }
    };

    // Determine stepper progression
    let currentStep = 0;
    if (status === 'Processing') currentStep = 1;
    if (status === 'Completed' || status === 'Failed') currentStep = 2; // Finished

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Generate Badges</Title>
                <Text type="secondary">Review and generate your layout combined with your data.</Text>
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none', marginBottom: 24 }}>
                <Steps
                    current={currentStep}
                    items={[
                        { title: 'Mapped & Ready', description: 'Data is locked in.' },
                        {
                            title: 'Generating',
                            description: 'Processing PDF...',
                            icon: status === 'Processing' ? <LoadingOutlined /> : undefined
                        },
                        {
                            title: status === 'Failed' ? 'Failed' : 'Complete',
                            description: status === 'Failed' ? 'Generation error' : 'Ready to print',
                            status: status === 'Failed' ? 'error' : (status === 'Completed' ? 'finish' : 'wait')
                        }
                    ]}
                />
            </Card>

            {status === 'Idle' && (
                <Card style={{ borderRadius: '12px', textAlign: 'center', padding: '40px 0', border: 'none' }}>
                    <PlayCircleOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
                    <Title level={4}>Ready to Generate</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                        Your CSV data ({jobDetails?.totalRecords || 'pending'} records) has been mapped to your template successfully.
                        Click below to begin the bulk PDF compilation.
                    </Text>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlayCircleOutlined />}
                        onClick={handleGenerate}
                        style={{ borderRadius: '6px', minWidth: '200px' }}
                    >
                        Start Generation
                    </Button>
                </Card>
            )}

            {status === 'Processing' && (
                <Card style={{ borderRadius: '12px', textAlign: 'center', padding: '60px 0', border: 'none' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                    <br /><br />
                    <Title level={4}>Building your PDF...</Title>
                    <Text type="secondary">
                        Please wait while QuestPDF compiles your badges. We are constantly checking the server for completion.
                    </Text>
                </Card>
            )}

            {status === 'Failed' && (
                <Result
                    status="error"
                    title="Generation Failed"
                    subTitle={errorMsg || "We encountered+ an unexpected error while building your files."}
                    extra={[
                        <Button
                            type="primary"
                            key="retry"
                            onClick={handleGenerate}
                        >
                            Try Again
                        </Button>,
                        <Button
                            key="dashboard"
                            onClick={() => navigate('/dashboard')}
                        >
                            Return to Dashboard
                        </Button>
                    ]}
                />
            )}

            {status === 'Completed' && (
                <Card style={{ borderRadius: '12px', border: 'none', display: 'flex', flexDirection: 'column' }}>
                    <Result
                        status="success"
                        title="Your Badges are Ready!"
                        subTitle="The PDF has been compiled successfully and is ready for download or preview."
                        extra={[
                            <Button
                                type="primary"
                                size="large"
                                icon={<DownloadOutlined />}
                                onClick={handleDownload}
                                key="download"
                            >
                                Download PDF
                            </Button>
                        ]}
                    />

                    <Divider />

                    <div style={{ marginTop: 24 }}>
                        <Title level={5}><EyeOutlined /> PDF Preview</Title>
                        <div style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            height: '600px',
                            backgroundColor: '#e6e8eb'
                        }}>
                            {/* IFRAME Rendering the PDF Blob / URL */}
                            <iframe
                                src={pdfUrl ? `${api.defaults.baseURL.replace('/api', '')}${pdfUrl}${pdfUrl.includes('?') ? '&' : '?'}inline=true` : ''}
                                width="100%"
                                height="100%"
                                title="PDF Preview"
                                style={{ border: 'none' }}
                            />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default GenerationPage;
