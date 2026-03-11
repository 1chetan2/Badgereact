import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

const PropertiesPanel = ({ selectedField, onUpdateField }) => {

    if (!selectedField) {
        return (
            <Card className="h-100 border-0 shadow-sm rounded-0">
                <Card.Header className="bg-white border-bottom py-3">
                    <h6 className="mb-0 fw-bold">Properties</h6>
                </Card.Header>
                <Card.Body className="d-flex align-items-center justify-content-center text-center p-4">
                    <div className="text-secondary opacity-75">
                        
                    </div>
                </Card.Body>
            </Card>
        );
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let val = type === 'checkbox' ? checked : value;

        // Handle numeric inputs
        if (['x', 'y', 'width', 'height', 'fontSize'].includes(name)) {
            val = val === '' ? 0 : parseFloat(val);
        }

        onUpdateField(selectedField.id, { [name]: val });
    };

    return (
        <Card className="h-100 border-0 shadow-sm rounded-0 overflow-auto">
            <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center">
                <i className="bi bi-sliders2 me-2 text-primary"></i>
                <h6 className="mb-0 fw-bold">Properties: {selectedField.type}</h6>
            </Card.Header>
            <Card.Body className="p-3">
                <Form>
                    <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <hr className="flex-grow-1 my-0" />
                            <span className="mx-2 small fw-bold text-muted text-uppercase tracking-wider">Dimensions (%)</span>
                            <hr className="flex-grow-1 my-0" />
                        </div>
                        <Row className="g-3 mb-3">
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label className="small text-secondary fw-semibold">X Pos</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="x"
                                        size="sm"
                                        className="bg-light border-0"
                                        value={Math.round(selectedField.x)}
                                        onChange={handleChange}
                                        min={0} max={100}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label className="small text-secondary fw-semibold">Y Pos</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="y"
                                        size="sm"
                                        className="bg-light border-0"
                                        value={Math.round(selectedField.y)}
                                        onChange={handleChange}
                                        min={0} max={100}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="g-3">
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label className="small text-secondary fw-semibold">Width</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="width"
                                        size="sm"
                                        className="bg-light border-0"
                                        value={Math.round(selectedField.width)}
                                        onChange={handleChange}
                                        min={1} max={100}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={6}>
                                <Form.Group>
                                    <Form.Label className="small text-secondary fw-semibold">Height</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="height"
                                        size="sm"
                                        className="bg-light border-0"
                                        value={Math.round(selectedField.height)}
                                        onChange={handleChange}
                                        min={1} max={100}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>

                    {selectedField.type === 'TEXT' && (
                        <div className="animate-fade-in">
                            <div className="d-flex align-items-center mb-3 mt-4">
                                <hr className="flex-grow-1 my-0" />
                                <span className="mx-2 small fw-bold text-muted text-uppercase tracking-wider">Appearance</span>
                                <hr className="flex-grow-1 my-0" />
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-secondary fw-semibold">Sample Text</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="sampleText"
                                    placeholder="Attendee Name"
                                    className="bg-light border-0"
                                    value={selectedField.sampleText || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Row className="g-3 mb-3">
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-secondary fw-semibold">Font Size</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="fontSize"
                                            size="sm"
                                            className="bg-light border-0"
                                            value={selectedField.fontSize || 14}
                                            onChange={handleChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col xs={6}>
                                    <Form.Group>
                                        <Form.Label className="small text-secondary fw-semibold">Color</Form.Label>
                                        <div className="d-flex gap-2">
                                            <Form.Control
                                                type="color"
                                                name="fontColor"
                                                size="sm"
                                                className="bg-light border-0 p-1"
                                                style={{ height: '31px', width: '100%' }}
                                                value={selectedField.fontColor || '#000000'}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label className="small text-secondary fw-semibold">Font Family</Form.Label>
                                <Form.Select
                                    name="fontFamily"
                                    size="sm"
                                    className="bg-light border-0"
                                    value={selectedField.fontFamily || 'Arial, sans-serif'}
                                    onChange={handleChange}
                                >
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="'Times New Roman', serif">Times New Roman</option>
                                    <option value="'Courier New', monospace">Courier New</option>
                                    <option value="'Inter', sans-serif">Inter</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label className="small text-secondary fw-semibold">Alignment</Form.Label>
                                <div className="btn-group w-100" role="group">
                                    {['left', 'center', 'right'].map(align => (
                                        <button
                                            key={align}
                                            type="button"
                                            className={`btn btn-sm ${selectedField.textAlign === align ? 'btn-primary' : 'btn-light border text-muted'}`}
                                            onClick={() => onUpdateField(selectedField.id, { textAlign: align })}
                                        >
                                            <i className={`bi bi-text-${align}`}></i>
                                        </button>
                                    ))}
                                </div>
                            </Form.Group>

                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="switch"
                                    id="bold-switch"
                                    label="Bold"
                                    name="isBold"
                                    className="small fw-semibold text-secondary"
                                    checked={selectedField.isBold || false}
                                    onChange={handleChange}
                                />
                                <Form.Check
                                    type="switch"
                                    id="italic-switch"
                                    label="Italic"
                                    name="isItalic"
                                    className="small fw-semibold text-secondary"
                                    checked={selectedField.isItalic || false}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    )}
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PropertiesPanel;
