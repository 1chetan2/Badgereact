import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';

const FieldToolbox = ({ onAddField }) => {
    const handleAddField = (type) => {
        const newField = {
            id: `field_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            type: type,
            name: `New ${type}`,
            x: 10,
            y: 10,
            width: type === 'TEXT' ? 40 : 25,
            height: type === 'TEXT' ? 15 : 25,
            fontFamily: 'Arial, sans-serif',
            fontSize: 14,
            fontColor: '#000000',
            textAlign: 'left',
            isBold: false,
            isItalic: false,
            sampleText: type === 'TEXT' ? 'Sample Text' : '',
            columnMapping: ''
        };
        onAddField(newField);
    };

    const tools = [
        { type: 'TEXT', label: 'Add Text', icon: 'bi-fonts' },
        { type: 'IMAGE', label: 'Add Image', icon: 'bi-image' },
        { type: 'QR', label: 'Add QR Code', icon: 'bi-qr-code' }
    ];

    return (
        <Card className="h-100 border-0 shadow-sm rounded-0">
            <Card.Header className="bg-white border-bottom py-3">
                <h6 className="mb-0 fw-bold">Toolbox</h6>
            </Card.Header>
            <Card.Body className="p-3">
                <p className="text-secondary small mb-4">Click to add fields to your badge design.</p>
                <div className="d-grid gap-3">
                    {tools.map(tool => (
                        <Button
                            key={tool.type}
                            variant="light"
                            className="text-start py-3 px-3 d-flex align-items-center border hover-bg-light transition-all"
                            onClick={() => handleAddField(tool.type)}
                        >
                            <i className={`bi ${tool.icon} me-3 text-primary fs-5`}></i>
                            <span className="fw-semibold small">{tool.label}</span>
                        </Button>
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default FieldToolbox;
