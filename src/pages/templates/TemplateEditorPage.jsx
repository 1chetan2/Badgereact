import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Row, Col, Card, Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import BadgeCanvas from '../../components/designer/BadgeCanvas';
import FieldToolbox from '../../components/designer/FieldToolbox';
import PropertiesPanel from '../../components/designer/PropertiesPanel';
import api from '../../services/api';

const TemplateEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [templateName, setTemplateName] = useState('New Badge Template');
    const [templateStatus, setTemplateStatus] = useState('Draft');
    const [fields, setFields] = useState([]);
    const [selectedFieldId, setSelectedFieldId] = useState(null);
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);

    // Mapper: Backend DTO -> Frontend State
    const mapBackendToFrontend = (data) => {
        setTemplateName(data.name || 'Untitled Template');
        setTemplateStatus(data.status || 'Draft');
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
            status: templateStatus,
            pageSize: 'A4',
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
            return alert('Please provide a name for your template.');
        }

        setSaving(true);
        try {
            const payload = mapFrontendToBackend();
            if (isEditMode) {
                await api.put(`/BadgeTemplates/${id}`, payload);
            } else {
                await api.post('/BadgeTemplates', payload);
            }
            navigate('/templates');
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save template. Check your permissions.');
        } finally {
            setSaving(false);
        }
    };

    const selectedField = fields.find(f => f.id === selectedFieldId);

    if (loading) {
        return (
            <div className="vh-100 d-flex flex-column align-items-center justify-content-center bg-light">
                <Spinner animation="border" variant="primary" className="mb-3" />
                <h5 className="text-secondary fw-bold">Loading Designer...</h5>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column" style={{ height: 'calc(100vh - 72px)', margin: '-24px -24px -24px -24px' }}>
            {/* Editor Toolbar */}
            <Navbar bg="white" className="border-bottom px-4 py-2 sticky-top shadow-sm">
                <Button
                    variant="link"
                    className="text-dark p-0 me-4"
                    onClick={() => navigate('/templates')}
                >
                    <i className="bi bi-arrow-left fs-4"></i>
                </Button>

                <Form.Control
                    type="text"
                    className="border-0 fw-bold fs-5 p-0 bg-transparent flex-grow-1 mx-2"
                    style={{ maxWidth: '400px', outline: 'none', boxShadow: 'none' }}
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name..."
                />

                <Nav className="ms-auto d-flex align-items-center gap-3">
                    <div className="btn-group bg-light p-1 rounded-pill" style={{ border: '1px solid #dee2e6' }}>
                        <Button
                            variant={templateStatus === 'Published' ? 'success' : 'light'}
                            className={`rounded-pill px-3 py-1 fw-bold border-0 ${templateStatus === 'Published' ? 'shadow-sm' : 'text-secondary'}`}
                            onClick={() => setTemplateStatus('Published')}
                            size="sm"
                        >
                             Published
                        </Button>
                        <Button
                            variant={templateStatus === 'Draft' ? 'warning' : 'light'}
                            className={`rounded-pill px-3 py-1 fw-bold border-0 ${templateStatus === 'Draft' ? 'shadow-sm' : 'text-secondary'}`}
                            onClick={() => setTemplateStatus('Draft')}
                            size="sm"
                        >
                             Draft
                        </Button>
                    </div>

                    <div className="vr mx-2 text-muted opacity-25" style={{ height: '30px' }}></div>

                    <Button
                        variant="primary"
                        className="rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? <Spinner animation="border" size="sm" className="me-2" /> : <i className="bi bi-cloud-arrow-up me-2"></i>}
                        Save Template
                    </Button>
                </Nav>
            </Navbar>

            {/* Main Designer Area */}
            <div className="d-flex flex-grow-1 overflow-hidden h-100">
                {/* Left Sidebar: Toolbox */}
                <div className="border-end bg-white overflow-auto h-100" style={{ width: '280px', flexShrink: 0 }}>
                    <FieldToolbox onAddField={handleAddField} />
                </div>

                {/* Center: Canvas Area */}
                <div className="flex-grow-1 bg-light h-100 position-relative p-4 overflow-auto d-flex justify-content-center">
                    <div style={{ width: 'fit-content' }}>
                        <Card className="shadow-lg border-0 rounded-4 overflow-hidden mb-4">
                            <Card.Body className="p-0 bg-secondary bg-opacity-10">
                                <BadgeCanvas
                                    fields={fields}
                                    onUpdateField={handleUpdateField}
                                    selectedFieldId={selectedFieldId}
                                    onSelectField={handleSelectField}
                                    backgroundImage={backgroundImage}
                                />
                            </Card.Body>
                        </Card>
                        <div className="text-center text-muted small opacity-75">
                            <i className="bi bi-info-circle me-1"></i> Drag and resize elements on the canvas
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Properties */}
                <div className="border-start bg-white overflow-auto h-100" style={{ width: '320px', flexShrink: 0 }}>
                    <PropertiesPanel
                        selectedField={selectedField}
                        onUpdateField={handleUpdateField}
                    />
                </div>
            </div>
        </div>
    );
};

export default TemplateEditorPage;
