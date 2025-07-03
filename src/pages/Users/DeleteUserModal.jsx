import React, { useState } from 'react';
import { Modal, Button, Typography, Space, message } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../api/axiosConfig';

const { Text } = Typography;

const DeleteUserModal = ({ visible, onClose, user }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user || !user.id) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/User/manage`, null, {
        params: {
          Id: user.id,
          PUID: Cookies.get('userId') || 0,
          Slug: window.location.pathname,
          CrudAction: 'DELETE'
        }
      });
      
      message.success('User deleted successfully');
      onClose(true);
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          <span>Delete User</span>
        </div>
      }
      open={visible}
      onCancel={() => onClose()}
      footer={null}
      centered
      width={400}
      transitionName="" // Remove transition animation
      maskTransitionName="" // Remove mask transition animation
    >
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <Text>
            Are you sure you want to delete this user? This action cannot be undone.
          </Text>
          
          {user && (
            <div style={{ 
              marginTop: 16, 
              padding: '12px 16px',
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                height: 36, 
                width: 36, 
                borderRadius: '50%', 
                background: '#ff4d4f', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginRight: 12,
                color: 'white',
                fontWeight: 500 
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : <UserOutlined />}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>{user.email}</div>
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

export default DeleteUserModal;