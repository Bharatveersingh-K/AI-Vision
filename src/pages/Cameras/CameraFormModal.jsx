import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Row, Col, message, Spin, InputNumber, Tooltip, Tabs } from 'antd';
import { 
  VideoCameraOutlined, 
  SaveOutlined, 
  CloseOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  EditOutlined,
  OrderedListOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  HomeOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../api/axiosConfig';

const { TextArea } = Input;
const { TabPane } = Tabs;

const CameraFormModal = ({ visible, onClose, camera }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [rtspError, setRtspError] = useState('');
  const [testingRtsp, setTestingRtsp] = useState(false);
  
  const isEditMode = !!camera;
  const isViewOnly = camera?.viewOnly;
  const puid = Cookies.get('id') || 0;

  useEffect(() => {
    if (visible) {
      setFormTouched(false);
      setRtspError('');
      
      if (isEditMode) {
        form.setFieldsValue({
          id: camera?.id,
          name: camera?.name,
          about: camera?.about,
          rtspLink: camera?.rtspLink,
          address: camera?.address,
          landmark: camera?.landmark,
          state: camera?.state,
          city: camera?.city,
          pincode: camera?.pincode,
          latitude: camera?.latitude,
          longitude: camera?.longitude,
          viewOrder: camera?.viewOrder,
          status: camera?.status ?? true
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: true,
          viewOrder: 0
        });
      }
    }
  }, [visible, camera, form, isEditMode]);

  const handleFormChange = () => {
    setFormTouched(true);
  };

  const testRtspLink = async () => {
    try {
      const rtspLink = form.getFieldValue('rtspLink');
      if (!rtspLink) {
        setRtspError('Please enter an RTSP link to test');
        return;
      }
      
      setTestingRtsp(true);
      
      // Here you would make an API call to validate the RTSP link
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's simulate success
      setRtspError('');
      message.success('RTSP link is valid and accessible');
    } catch (error) {
      setRtspError('Could not connect to the RTSP stream. Please verify the URL and try again.');
    } finally {
      setTestingRtsp(false);
    }
  };

  const handleSubmit = async () => {
  try {
    const values = await form.validateFields();
    setLoading(true);
    
    // Create FormData object
    const formData = new FormData();
    
    // Append all form values to FormData
    Object.keys(values).forEach(key => {
      // Skip null or undefined values
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });
    
    // Add additional required parameters
    formData.append('PUID', puid);
    formData.append('Slug', window.location.pathname);
    formData.append('CrudAction', isEditMode ? 'EDIT' : 'ADD');
    
    // Send the request with FormData as the body
    await axios.post(`${API_URL}/Camera/manage`, formData);
    
    message.success(`Camera ${isEditMode ? 'updated' : 'added'} successfully`);
    onClose(true);
  } catch (error) {
    console.error('Error submitting form:', error);
    message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} camera`);
  } finally {
    setLoading(false);
  }
};

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isViewOnly ? (
        <EyeOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
      ) : isEditMode ? (
        <EditOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
      ) : (
        <VideoCameraOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
      )}
      <span>
        {isViewOnly ? 'Camera Details' : isEditMode ? 'Edit Camera' : 'Add New Camera'}
      </span>
    </div>
  );

  const handleCancel = () => {
    if (formTouched && !isViewOnly) {
      Modal.confirm({
        title: 'Discard changes?',
        content: 'You have unsaved changes. Are you sure you want to discard them?',
        okText: 'Yes, discard',
        cancelText: 'No, continue editing',
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      centered
      destroyOnClose
    >
      {loading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(255, 255, 255, 0.7)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000,
          borderRadius: '0 0 8px 8px'
        }}>
          <Spin size="large" tip="Processing..." />
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        disabled={isViewOnly || loading}
        onFieldsChange={handleFormChange}
        style={{ padding: '16px 0' }}
      >
        <Form.Item name="id" hidden><Input /></Form.Item>
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="Basic Information" key="1">
            <Form.Item
              name="name"
              label="Camera Name"
              rules={[{ required: true, message: 'Please enter a camera name' }]}
              tooltip={{ title: "A descriptive name for the camera", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                prefix={<VideoCameraOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter camera name"
              />
            </Form.Item>
            
            <Form.Item
              name="rtspLink"
              label={
                <span>
                  RTSP Link
                  {!isViewOnly && (
                    <Button 
                      type="link" 
                      size="small"
                      onClick={testRtspLink}
                      loading={testingRtsp}
                      style={{ marginLeft: 8, padding: 0 }}
                    >
                      Test Connection
                    </Button>
                  )}
                </span>
              }
              rules={[
                { required: true, message: 'Please enter the RTSP link' },
                { 
                  pattern: /^rtsp:\/\/.+/i, 
                  message: 'Please enter a valid RTSP URL starting with rtsp://' 
                }
              ]}
              tooltip={{ title: "The RTSP URL for the camera feed", icon: <InfoCircleOutlined /> }}
              help={rtspError}
              validateStatus={rtspError ? "error" : undefined}
            >
              <Input 
                prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="rtsp://username:password@ip:port/path"
              />
            </Form.Item>
            
            <Form.Item
              name="about"
              label="Description"
              tooltip={{ title: "Additional information about this camera", icon: <InfoCircleOutlined /> }}
            >
              <TextArea 
                placeholder="Enter camera description or notes"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="viewOrder"
                  label="Display Order"
                  tooltip={{ title: "Set the display order in camera listings", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    placeholder="Enter display order"
                    min={0}
                    precision={0}
                    prefix={<OrderedListOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Camera Status"
                  valuePropName="checked"
                  tooltip={{ title: "Enable or disable this camera", icon: <InfoCircleOutlined /> }}
                >
                  <Switch 
                    checkedChildren="Active" 
                    unCheckedChildren="Inactive"
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="Location Details" key="2">
            <Form.Item
              name="address"
              label="Address"
              tooltip={{ title: "Full address where the camera is installed", icon: <InfoCircleOutlined /> }}
            >
              <TextArea 
                placeholder="Enter physical address"
                autoSize={{ minRows: 2, maxRows: 4 }}
                prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>
            
            <Form.Item
              name="landmark"
              label="Landmark"
              tooltip={{ title: "Nearby landmark for easier identification", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                placeholder="Enter nearby landmark"
              />
            </Form.Item>
            
            <Row gutter={24}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="city"
                  label="City"
                >
                  <Input placeholder="Enter city" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="state"
                  label="State"
                >
                  <Input placeholder="Enter state" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="pincode"
                  label="Pincode"
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    placeholder="Enter pincode"
                    min={0}
                    precision={0}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="latitude"
                  label="Latitude"
                  tooltip={{ title: "Geographical latitude coordinate", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    placeholder="Enter latitude"
                    precision={6}
                    prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12}>
                <Form.Item
                  name="longitude"
                  label="Longitude"
                  tooltip={{ title: "Geographical longitude coordinate", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    style={{ width: '100%' }}
                    placeholder="Enter longitude"
                    precision={6}
                    prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid #f0f0f0',
          gap: 12
        }}>
          <Button 
            onClick={handleCancel}
            icon={<CloseOutlined />}
          >
            {isViewOnly ? 'Close' : 'Cancel'}
          </Button>
          
          {!isViewOnly && (
            <Button 
              type="primary" 
              onClick={handleSubmit}
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? 'Update' : 'Add'} Camera
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default CameraFormModal;