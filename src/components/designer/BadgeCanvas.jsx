import React, { useRef, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

// Default standard ID card ratio: ~3.375 x 2.125 inches (CR80)
// Landscape orientation standard for event badges
const BADGE_WIDTH_MM = 86;
const BADGE_HEIGHT_MM = 54;
const MM_TO_PX_RATIO = 4; // Scale factor for canvas view

const CANVAS_WIDTH = BADGE_WIDTH_MM * MM_TO_PX_RATIO;
const CANVAS_HEIGHT = BADGE_HEIGHT_MM * MM_TO_PX_RATIO;

const BadgeCanvas = ({
    fields,
    onUpdateField,
    selectedFieldId,
    onSelectField,
    backgroundImage
}) => {
    const canvasRef = useRef(null);

    // Coordinate conversion utilities
    // The canvas operates in pixels for React-RND, but we save data in relative 
    // percentages (0-100) or mm so it renders perfectly on the backend PDF generator regardless of monitor dpi

    const pxToPercentX = (px) => (px / CANVAS_WIDTH) * 100;
    const pxToPercentY = (px) => (px / CANVAS_HEIGHT) * 100;
    const percentToPxX = (pct) => (pct / 100) * CANVAS_WIDTH;
    const percentToPxY = (pct) => (pct / 100) * CANVAS_HEIGHT;

    const handleDragStop = (id, e, d) => {
        onUpdateField(id, {
            x: pxToPercentX(d.x),
            y: pxToPercentY(d.y)
        });
    };

    const handleResizeStop = (id, e, direction, ref, delta, position) => {
        onUpdateField(id, {
            width: pxToPercentX(parseFloat(ref.style.width)),
            height: pxToPercentY(parseFloat(ref.style.height)),
            x: pxToPercentX(position.x),
            y: pxToPercentY(position.y)
        });
    };

    // Calculate dynamic styles for the RND element to reflect formatting props
    const getFieldStyle = (field, isSelected) => {
        return {
            border: isSelected ? '2px dashed #1890ff' : '1px dashed transparent',
            fontFamily: field.fontFamily || 'Arial, sans-serif',
            fontSize: `${field.fontSize || 14}px`,
            color: field.fontColor || '#000000',
            fontWeight: field.isBold ? 'bold' : 'normal',
            fontStyle: field.isItalic ? 'italic' : 'normal',
            textAlign: field.textAlign || 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: field.textAlign === 'center' ? 'center' :
                field.textAlign === 'right' ? 'flex-end' : 'flex-start',
            cursor: 'move',
            userSelect: 'none',
            overflow: 'hidden', // Prevent text from escaping boundaries
            backgroundColor: isSelected ? 'rgba(24, 144, 255, 0.1)' : 'transparent',
            padding: '2px'
        };
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            backgroundColor: '#e5e7eb',
            borderRadius: '8px',
            overflow: 'auto',
            height: '100%',
            minHeight: '400px'
        }}>
            <div
                ref={canvasRef}
                style={{
                    width: `${CANVAS_WIDTH}px`,
                    height: `${CANVAS_HEIGHT}px`,
                    backgroundColor: '#ffffff',
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #d1d5db',
                }}
                onClick={() => onSelectField(null)} // Deselect when clicking canvas background
            >
                {fields.map((field) => (
                    <Rnd
                        key={field.id}
                        size={{
                            width: percentToPxX(field.width || 20),
                            height: percentToPxY(field.height || 10)
                        }}
                        position={{
                            x: percentToPxX(field.x || 0),
                            y: percentToPxY(field.y || 0)
                        }}
                        onDragStop={(e, d) => handleDragStop(field.id, e, d)}
                        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop(field.id, e, direction, ref, delta, position)}
                        bounds="parent" // Prevents dragging outside the badge boundary
                        style={getFieldStyle(field, selectedFieldId === field.id)}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent canvas background click
                            onSelectField(field.id);
                        }}
                    >
                        {/* Display sample text if available, otherwise just the field name so the user knows what it maps to */}
                        {field.sampleText || `[${field.name}]`}
                    </Rnd>
                ))}
            </div>
        </div>
    );
};

export default BadgeCanvas;
