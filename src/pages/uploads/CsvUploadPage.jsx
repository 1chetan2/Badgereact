import React, { useState, useEffect } from 'react';
import {
    Card, Typography, Select, Upload, Button,
    message, Table, Steps, Result, Space
} from 'antd';
import {
    InboxOutlined,
    FileTextOutlined,
    ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

const CsvUploadPage = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Preview states
    const [previewData, setPreviewData] = useState(null); // { columns: [], rows: [] }
    const [jobId, setJobId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch published templates to populate the dropdown
        const fetchTemplates = async () => {
            try {
                const response = await api.get('/BadgeTemplates');
                setTemplates(response.data || []);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
                message.error('Could not load templates.');
            }
        };

        fetchTemplates();
    }, []);

    // File selection config and validation
    const uploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
            if (!isCSV) {
                message.error('You can only upload CSV files!');
                return Upload.LIST_IGNORE;
            }

            // Validate size < 5MB
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error('CSV must smaller than 5MB!');
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            return false; // Prevent Ant's default immediate POST upload
        },
        maxCount: 1,
        fileList,
    };

    const handleUpload = async () => {
        if (!selectedTemplateId) {
            message.warning('Please select a template first.');
            return;
        }

        if (fileList.length === 0) {
            message.warning('Please select a CSV file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileList[0]);
        formData.append('templateId', selectedTemplateId);

        setUploading(true);
        try {
            // Send the multipart/form-data request
            const uploadResponse = await api.post('/Csv/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            message.success('CSV uploaded successfully!');
            const newJobId = uploadResponse.data.jobId || uploadResponse.data.id;
            setJobId(newJobId);

            // Immediately fetch the preview for mapping
            fetchPreview(newJobId);

        } catch (error) {
            console.error('CSV upload error:', error);
            const errorMsg = error.response?.data?.message || 'Failed to upload CSV file.';
            message.error(errorMsg);
            setUploading(false); // Only set false on error to prevent re-clicks during preview load
        }
    };

    const fetchPreview = async (id) => {
        try {
            const previewResponse = await api.get(`/Csv/${id}/preview`);

            // Backend returns List<Dictionary<string, string>>
            // previewResponse.data = [{"Column1": "Val1", "Column2": "Val2"}, ...]

            if (previewResponse.data && previewResponse.data.length > 0) {
                const firstRow = previewResponse.data[0];
                const columnKeys = Object.keys(firstRow);

                const columns = columnKeys.map((key) => ({
                    title: key,
                    dataIndex: key,
                    key: key,
                }));

                const rows = previewResponse.data.map((row, idx) => ({
                    ...row,
                    key: `row_${idx}`
                }));

                setPreviewData({ columns, rows });
            } else {
                setPreviewData({ columns: [], rows: [] });
            }
        } catch (error) {
            console.error('Failed to fetch preview:', error);
            message.error('Could not load CSV preview.');
        } finally {
            setUploading(false);
        }
    };

    // If preview exists, show the mapping/preview screen
    if (previewData && jobId) {
        return (
            <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
                <Result
                    status="success"
                    title={<span style={{ color: '#1f2937' }}>Upload processing complete!</span>}
                    subTitle="Review the parsed CSV data below. Next, you'll map these columns to your template fields."
                    extra={[
                        <Button
                            key="cancel"
                            onClick={() => {
                                setPreviewData(null);
                                setJobId(null);
                                setFileList([]);
                            }}
                        >
                            Start Over
                        </Button>,
                        <Button
                            type="primary"
                            key="map"
                            icon={<ArrowRightOutlined />}
                            onClick={() => navigate(`/uploads/mapping/${jobId}`)}
                        >
                            Proceed to Column Mapping
                        </Button>,
                    ]}
                />

                <Card title={<><FileTextOutlined style={{ marginRight: 8 }} /> CSV Data Preview (Top 5 rows)</>} style={{ marginTop: 24, borderRadius: '8px' }}>
                    <Table
                        dataSource={previewData.rows}
                        columns={previewData.columns}
                        pagination={false}
                        scroll={{ x: true }}
                        size="small"
                        bordered
                    />
                </Card>
            </div>
        );
    }

    // Default Upload Screen
    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>

            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Upload Data</Title>
                <Text type="secondary">Select a template and securely upload your CSV attendee list.</Text>
            </div>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ marginBottom: 24 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>1. Select Badge Template</Text>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Choose the desired layout template"
                        size="large"
                        onChange={setSelectedTemplateId}
                        value={selectedTemplateId}
                    >
                        {templates.map(tpl => (
                            <Option key={tpl.id} value={tpl.id}>
                                {tpl.name} {tpl.status === 'Draft' ? '(Draft)' : ''}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: 32 }}>
                    <Text strong style={{ display: 'block', marginBottom: 8 }}>2. Upload CSV File</Text>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text">Click or drag CSV file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Strictly prohibit from uploading company data or other band files.
                            Maximum size is 5MB.
                        </p>
                    </Dragger>
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    loading={uploading}
                    onClick={handleUpload}
                    disabled={fileList.length === 0 || !selectedTemplateId}
                    style={{ borderRadius: '6px' }}
                >
                    {uploading ? 'Processing Data...' : 'Upload & Preview'}
                </Button>
            </Card>
        </div>
    );
};

export default CsvUploadPage;
