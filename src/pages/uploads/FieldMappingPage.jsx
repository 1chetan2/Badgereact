import React, { useState, useEffect } from 'react';
import {
    Card, Typography, Select, Button,
    message, Row, Col, Space, Divider, Spin
} from 'antd';
import {
    CheckCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

const FieldMappingPage = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Derived from the backend payload (assuming typically { columns: [], templateFields: [] } or similar)
    const [csvColumns, setCsvColumns] = useState([]);
    const [templateFields, setTemplateFields] = useState([]);

    // Represents our user's mapping dictionary: { "fieldId": "CsvColumnName" }
    const [mapping, setMapping] = useState({});

    useEffect(() => {
        const fetchMappingData = async () => {
            try {
                // 0. Ping the server to verify controller is alive
                try {
                    const pingRes = await api.get('/Csv/ping');
                    console.log("CSV Controller Ping:", pingRes.data);
                } catch (pingErr) {
                    console.error("CSV Controller Ping FAILED:", pingErr);
                }

                // 1. Fetch Job and associated Template info
                console.log("Fetching job info for ID:", jobId);
                const jobRes = await api.get(`/Csv/job-info/${jobId}`);
                const job = jobRes.data;
                console.log("Job data received:", job);

                // 2. Fetch CSV Preview to get column names
                const previewRes = await api.get(`/Csv/${jobId}/preview`);
                let columns = [];
                if (previewRes.data && previewRes.data.length > 0) {
                    columns = Object.keys(previewRes.data[0]);
                }
                setCsvColumns(columns);

                // 3. Map Backend Fields to Designer structure
                const template = job.template || job.Template;
                const backendFields = template?.fields || template?.Fields || [];

                const mappedFields = backendFields.map(f => {
                    let styles = {};
                    const styleJson = f.styleJson || f.StyleJson;
                    try {
                        styles = styleJson ? JSON.parse(styleJson) : {};
                    } catch (e) {
                        console.error("Failed to parse field styleJson", e);
                    }
                    return {
                        id: (f.id || f.Id).toString(),
                        type: (f.type || f.Type || "").toUpperCase(),
                        name: f.key || f.Key, // backend 'Key' is the field name
                        ...styles
                    };
                });

                // Only map fields that actually need dynamic data (TEXT, IMAGE, QR)
                const templateFields = mappedFields.filter(f =>
                    f.type === 'TEXT' || f.type === 'IMAGE' || f.type === 'QR'
                );
                setTemplateFields(templateFields);

                // 4. Auto-map where names match exactly (case insensitive)
                const initialMapping = {};
                templateFields.forEach(field => {
                    const exactMatch = columns.find(c => c.toLowerCase() === field.name.toLowerCase());
                    if (exactMatch) {
                        initialMapping[field.id] = exactMatch;
                    }
                });
                setMapping(initialMapping);

            } catch (error) {
                console.error('Failed to load mapping data:', error);
                const status = error.response?.status;
                const errorData = error.response?.data;

                // Detailed diagnostic message
                if (status === 404) {
                    const serverMsg = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
                    message.error(`Job ID ${jobId} not found. Server says: ${serverMsg} (Status: 404)`);
                } else {
                    const errorMsg = error.response?.data?.message || (typeof errorData === 'string' ? errorData : '') || error.message || 'Failed to load job data.';
                    message.error(`${errorMsg} (Status: ${status})`);
                }
            } finally {
                setLoading(false);
            }
        };

        if (jobId) {
            fetchMappingData();
        }
    }, [jobId]);

    const handleMapChange = (fieldId, csvColumnName) => {
        setMapping(prev => ({
            ...prev,
            [fieldId]: csvColumnName
        }));
    };

    const handleSaveMapping = async () => {
        setSaving(true);
        try {
            // Backend expects mapping where:
            // key is the Field ID (unique) and value is the CSV Column Name
            const finalMapping = {};
            Object.keys(mapping).forEach(fieldId => {
                const csvColumn = mapping[fieldId];
                if (csvColumn) {
                    finalMapping[fieldId] = csvColumn;
                }
            });

            await api.post(`/Csv/${jobId}/mapping`, finalMapping);
            message.success('Fields mapped successfully! Ready to generate.');
            navigate(`/jobs/${jobId}/generate`);
        } catch (error) {
            console.error('Mapping save error:', error);
            message.error(error.response?.data?.message || 'Failed to save field mapping.');
        } finally {
            setSaving(false);
        }
    };

    // Calculate if all required fields are mapped to disable the generate button
    // Often Text fields without static text are required, but your spec says only disable if "required fields not mapped"
    // So we'll assume all TEXT/QR fields need a map unless they have a fallback or are not mandated
    const isReadyToGenerate = () => {
        if (templateFields.length === 0) return false;

        // Example check: Ensure every TEXT or QR field has a selection
        const requiredFields = templateFields.filter(f => f.type === 'TEXT' || f.type === 'QR' || f.type === 'IMAGE');
        const unmappedFields = requiredFields.filter(f => !mapping[f.id]);

        return unmappedFields.length === 0;
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    const unmappedCount = templateFields.filter(f => (f.type === 'TEXT' || f.type === 'QR' || f.type === 'IMAGE') && !mapping[f.id]).length;

    return (
        <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100%' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/uploads/csv')}
                        style={{ marginRight: 16 }}
                    />
                    <div>
                        <Title level={2} style={{ margin: 0, color: '#1f2937' }}>Map Columns</Title>
                        <Text type="secondary">Connect your CSV columns to the design template fields.</Text>
                    </div>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card
                        title={<><SettingOutlined style={{ marginRight: 8 }} /> Template Fields</>}
                        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}
                    >
                        {templateFields.filter(f => f.type === 'TEXT' || f.type === 'QR' || f.type === 'IMAGE').map((field) => (
                            <div key={field.id} style={{ marginBottom: 24 }}>
                                <Row align="middle" gutter={16}>
                                    <Col span={10}>
                                        <Text strong>{field.name}</Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: '12px' }}>
                                            Type: {field.type}
                                        </Text>
                                    </Col>
                                    <Col span={2} style={{ textAlign: 'center' }}>
                                        <ArrowRightOutlined style={{ color: '#bfbfbf' }} />
                                    </Col>
                                    <Col span={12}>
                                        <Select
                                            style={{ width: '100%' }}
                                            placeholder="Select CSV Column"
                                            value={mapping[field.id]}
                                            onChange={(val) => handleMapChange(field.id, val)}
                                            allowClear
                                            status={!mapping[field.id] ? 'error' : ''}
                                        >
                                            {csvColumns.map(col => (
                                                <Option key={col} value={col}>{col}</Option>
                                            ))}
                                        </Select>
                                        {!mapping[field.id] && (
                                            <Text type="danger" style={{ fontSize: '12px' }}>This field requires mapping.</Text>
                                        )}
                                    </Col>
                                </Row>
                                <Divider style={{ margin: '16px 0 0 0' }} />
                            </div>
                        ))}

                        {templateFields.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
                                This template has no mappable fields.
                            </div>
                        )}
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none', position: 'sticky', top: 24 }}>
                        <Title level={4}>Action Ready</Title>

                        <div style={{ margin: '24px 0' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Total Template Fields:</Text>
                                    <Text strong>{templateFields.filter(f => f.type === 'TEXT' || f.type === 'QR' || f.type === 'IMAGE').length}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text type="secondary">Unmapped Fields:</Text>
                                    <Text strong type={unmappedCount > 0 ? "danger" : "success"}>
                                        {unmappedCount}
                                    </Text>
                                </div>
                            </Space>
                        </div>

                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            size="large"
                            block
                            loading={saving}
                            onClick={handleSaveMapping}
                            disabled={!isReadyToGenerate()}
                            style={{ borderRadius: '6px' }}
                        >
                            Confirm Mapping
                        </Button>

                        {!isReadyToGenerate() && (
                            <Text type="secondary" style={{ display: 'block', marginTop: 16, textAlign: 'center', fontSize: '13px' }}>
                                Please map all fields before continuing.
                            </Text>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default FieldMappingPage;
