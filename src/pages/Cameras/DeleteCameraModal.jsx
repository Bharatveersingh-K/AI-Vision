// DeleteCameraModal 
import React, { useState } from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, CloseOutlined, VideoCameraOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../api/axiosConfig';

const { Text } = Typography;

const DeleteCameraModal = ({ visible, onClose, camera }) => {
  const [loading, setLoading] = useState(false);
  const puid = Cookies.get('id') || 0;

  const handleDelete = async () => {
  if (!camera || !camera.id) return;
  
  setLoading(true);
  try {
    // Create FormData object
    const formData = new FormData();
    
    // Append all required parameters
    formData.append('Id', camera.id);
    formData.append('PUID', puid);
    formData.append('Slug', window.location.pathname);
    formData.append('CrudAction', 'DELETE');
    
    // Send the request with FormData as the body
    await axios.post(`${API_URL}/Camera/manage`, formData);
    
    message.success('Camera deleted successfully');
    onClose(true);
  } catch (error) {
    console.error('Error deleting camera:', error);
    message.error(error.response?.data?.message || 'Failed to delete camera');
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          <span>Delete Camera</span>
        </div>
      }
      open={visible}
      onCancel={() => onClose()}
      footer={null}
      centered
      width={400}
      transitionName="" // बिंक को रोकने के लिए transition को हटा दिया
      maskTransitionName="" // मास्क transition को भी हटा दिया
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Text>
            Are you sure you want to delete this camera? This action cannot be undone.
          </Text>
          
          {camera && (
            <div style={{ 
              marginTop: 16, 
              padding: '12px 16px',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div style={{ 
                height: 40, 
                width: 40, 
                borderRadius: '50%', 
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12
              }}>
                <VideoCameraOutlined style={{ color: '#1890ff' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500 }}>{camera.name}</div>
                <div style={{ 
                  fontSize: 12, 
                  color: '#8c8c8c',
                  maxWidth: 250,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {camera.rtspLink || 'No RTSP link'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Space size="middle">
          <Button
            onClick={() => onClose()}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          
          <Button
            type="primary"
            danger
            loading={loading}
            onClick={handleDelete}
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteCameraModal;