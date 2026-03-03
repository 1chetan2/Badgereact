import React from 'react';
import { Card, Button, Typography, Space, Divider } from 'antd';
import {
    FontSizeOutlined,
    PictureOutlined,
    QrcodeOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

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

    return (
        <Card
            title={<Title level={5} style={{ margin: 0 }}>Toolbox</Title>}
            style={{
                height: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: 'none',
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16, fontSize: '13px' }}>
                Click to add fields to your badge.
            </Text>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button
                    type="dashed"
                    icon={<FontSizeOutlined />}
                    block
                    style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                    onClick={() => handleAddField('TEXT')}
                >
                    Add Text
                </Button>

                <Button
                    type="dashed"
                    icon={<PictureOutlined />}
                    block
                    style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                    onClick={() => handleAddField('IMAGE')}
                >
                    Add Image
                </Button>

                <Button
                    type="dashed"
                    icon={<QrcodeOutlined />}
                    block
                    style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}
                    onClick={() => handleAddField('QR')}
                >
                    Add QR Code
                </Button>
            </Space>

            <Divider style={{ margin: '24px 0' }} />

           
        </Card>
    );
};

export default FieldToolbox;
