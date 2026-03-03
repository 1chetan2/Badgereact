import React, { useEffect } from 'react';
import { Card, Form, Input, InputNumber, Typography, Divider, Select, Switch, Row, Col } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const PropertiesPanel = ({ selectedField, onUpdateField }) => {
    const [form] = Form.useForm();

    // Re-initialize the form when a different field is clicked on the canvas
    useEffect(() => {
        if (selectedField) {
            form.setFieldsValue({
                x: Math.round(selectedField.x),
                y: Math.round(selectedField.y),
                width: Math.round(selectedField.width),
                height: Math.round(selectedField.height),
                fontSize: selectedField.fontSize || 14,
                fontColor: selectedField.fontColor || '#000000',
                fontFamily: selectedField.fontFamily || 'Arial, sans-serif',
                textAlign: selectedField.textAlign || 'left',
                isBold: selectedField.isBold || false,
                isItalic: selectedField.isItalic || false,
                sampleText: selectedField.sampleText || '',
            });
        } else {
            form.resetFields();
        }
    }, [selectedField, form]);


    const handleValuesChange = (changedValues) => {
        if (selectedField) {
            
            onUpdateField(selectedField.id, changedValues);
        }
    };

    if (!selectedField) {
        return (
            <Card
                title={<Title level={5} style={{ margin: 0 }}>Properties</Title>}
                style={{ height: '100%', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}
                bodyStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 58px)' }}
            >
                <Text type="secondary">Select an element on the canvas to edit its properties.</Text>
            </Card>
        );
    }

    return (
        <Card
            title={<Title level={5} style={{ margin: 0 }}>Properties: {selectedField.name}</Title>}
            style={{
                height: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: 'none',
                overflowY: 'auto'
            }}
            bodyStyle={{ padding: '16px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
                size="middle"
            >
              
                <Divider orientation="left" style={{ marginTop: 0 }}>Dimensions (%)</Divider>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="X Pos" name="x">
                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Y Pos" name="y">
                            <InputNumber min={0} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item label="Width" name="width">
                            <InputNumber min={1} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Height" name="height">
                            <InputNumber min={1} max={100} style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

               
                {selectedField.type === 'TEXT' && (
                    <>
                        <Divider orientation="left">Text Formatting</Divider>
                        <Form.Item label="Sample Text" name="sampleText">
                            <Input placeholder="E.g. Attendee Name" />
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Font Size (px)" name="fontSize">
                                    <InputNumber min={6} max={120} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Color" name="fontColor">
                                    <Input type="color" style={{ width: '100%', padding: '0 4px' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Alignment" name="textAlign">
                            <Select>
                                <Option value="left">Left</Option>
                                <Option value="center">Center</Option>
                                <Option value="right">Right</Option>
                            </Select>
                        </Form.Item>

                        <Row gutter={12}>
                            <Col span={12}>
                                <Form.Item label="Bold" name="isBold" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Italic" name="isItalic" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Font Family" name="fontFamily">
                            <Select>
                                <Option value="Arial, sans-serif">Arial</Option>
                                <Option value="'Times New Roman', serif">Times New Roman</Option>
                                <Option value="'Courier New', monospace">Courier New</Option>
                                <Option value="'Lucida Console', monospace">Lucida Console</Option>
                            </Select>
                        </Form.Item>
                    </>
                )}
            </Form>
        </Card>
    );
};

export default PropertiesPanel;
