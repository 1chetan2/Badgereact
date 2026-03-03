import React, { useState, useEffect } from 'react';
import { Layout, Button, Input, Space, Typography, message, Spin, Row, Col, Card } from 'antd';
import { SaveOutlined, ArrowLeftOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import BadgeCanvas from '../../components/designer/BadgeCanvas';
import FieldToolbox from '../../components/designer/FieldToolbox';
import PropertiesPanel from '../../components/designer/PropertiesPanel';
import api from '../../services/api';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const TemplateEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [templateName, setTemplateName] = useState('New Badge Template');
    const [fields, setFields] = useState([]);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    // Mapper: Backend DTO -> Frontend State
    const mapBackendToFrontend = (data) => {
        setTemplateName(data.name || 'Untitled Template');
        setBackgroundImage(data.background || null);

        const mappedFields = (data.fields || []).map(f => {
            let styles = {};
            try {
                styles = f.styleJson ? JSON.parse(f.styleJson) : {};
            } catch (e) {
                console.error("Failed to parse StyleJson", e);
            }

            return {
                id: f.id.toString(),
                type: f.type,
                name: f.key,
                x: parseFloat(f.x),
                y: parseFloat(f.y),
                width: parseFloat(f.width),
                height: parseFloat(f.height),
                ...styles
            };
        });
        setFields(mappedFields);
    };

    // Mapper: Frontend State -> Backend DTO
    const mapFrontendToBackend = () => {
        return {
            name: templateName,
            status: 'Published',
            pageSize: 'A4', // Defaults
            badgesPerPage: 1,
            badgeWidth: 86,
            badgeHeight: 54,
            background: backgroundImage,
            fields: fields.map(f => ({
                type: f.type,
                key: f.name,
                x: f.x,
                y: f.y,
                width: f.width,
                height: f.height,
                styleJson: JSON.stringify({
                    fontSize: f.fontSize,
                    fontColor: f.fontColor,
                    fontFamily: f.fontFamily,
                    textAlign: f.textAlign,
                    isBold: f.isBold,
                    isItalic: f.isItalic,
                    sampleText: f.sampleText
                }),
                isRequired: false,
                defaultValue: ''
            }))
        };
    };

    useEffect(() => {
        if (isEditMode) {
            const fetchTemplate = async () => {
                try {
                    const response = await api.get(`/BadgeTemplates/${id}`);
                    mapBackendToFrontend(response.data);
                } catch (error) {
                    console.error('Failed to fetch template:', error);
                    message.error('Could not load template data.');
                } finally {
                    setLoading(false);
                }
            };
            fetchTemplate();
        }
    }, [id, isEditMode]);

    const handleAddField = (newField) => {
        setFields([...fields, newField]);
        setSelectedFieldId(newField.id);
    };

    const handleUpdateField = (fieldId, updates) => {
        setFields(fields.map(f => f.id === fieldId ? { ...f, ...updates } : f));
    };

    const handleSelectField = (fieldId) => {
        setSelectedFieldId(fieldId);
    };

    const handleSave = async () => {
        if (!templateName.trim()) {
            return message.warning('Please provide a name for your template.');
        }

        setSaving(true);
        try {
            const payload = mapFrontendToBackend();

            if (isEditMode) {
                await api.put(`/BadgeTemplates/${id}`, payload);
                message.success('Template updated successfully!');
            } else {
                await api.post('/BadgeTemplates', payload);
                message.success('Template created successfully!');
            }
            navigate('/templates');
        } catch (error) {
            console.error('Save template error:', error);
            message.error('Failed to save template. Check if your role is OrgAdmin.');
        } finally {
            setSaving(false);
        }
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading template designer..." />
            </div>
        );
    }

    return (
        <Layout style={{ height: 'calc(100vh - 64px)', background: '#f0f2f5' }}>
            <Header style={{
                background: '#fff',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e5e7eb',
                height: '64px'
            }}>
                <Space size="large">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/templates')}
                        type="text"
                    />
                    <Input
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        style={{ width: '300px', fontWeight: 600, fontSize: '16px' }}
                        placeholder="Template Name"
                    />
                </Space>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    size="large"
                    loading={saving}
                    onClick={handleSave}
                >
                    Save Template
                </Button>
            </Header>
            <Layout>
                <Sider width={260} theme="light" style={{ borderRight: '1px solid #e5e7eb' }}>
                    <FieldToolbox onAddField={handleAddField} />
                </Sider>
                <Content style={{ padding: '24px', position: 'relative' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Card
                            style={{ flex: 1, borderRadius: '12px', overflow: 'hidden' }}
                            bodyStyle={{ height: '100%', padding: 0 }}
                        >
                            <BadgeCanvas
                                fields={fields}
                                onUpdateField={handleUpdateField}
                                selectedFieldId={selectedFieldId}
                                onSelectField={handleSelectField}
                                backgroundImage={backgroundImage}
                            />
                        </Card>
                    </div>
                </Content>
                <Sider width={320} theme="light" style={{ borderLeft: '1px solid #e5e7eb' }}>
                    <PropertiesPanel
                        selectedField={selectedField}
                        onUpdateField={handleUpdateField}
                    />
                </Sider>
            </Layout>
        </Layout>
    );
};

export default TemplateEditorPage;
