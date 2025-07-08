import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Space, Badge, message, Input, Tooltip, Menu, Dropdown, 
  Switch, Upload, Modal, Form, Typography, Tag, Divider, Select
} from 'antd';
import { 
  UserOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  PhoneOutlined,
  MailOutlined,
  WhatsAppOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  TeamOutlined,
  PaperClipOutlined,
  BellOutlined,
  CloudUploadOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/axiosConfig';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Dragger } = Upload;

// Empty state component
const EmptyStateIllustration = () => (
  <div style={{ textAlign: 'center', padding: '24px' }}>
    <TeamOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <h3>No Clients Found</h3>
    <p style={{ color: '#8c8c8c' }}>
      Create your first client to start managing client information.
    </p>
  </div>
);

// Status component
const ClientStatus = ({ status }) => (
  <Badge
    status={status ? "success" : "error"}
    text={status ? "Active" : "Inactive"}
  />
);

// Notification methods component
const NotificationMethods = ({ sendSMS, sendWhatsapp, sendEmail }) => {
  const methods = [];
  
  if (sendSMS) {
    methods.push(
      <Tag icon={<PhoneOutlined />} color="purple" key="sms">
        SMS
      </Tag>
    );
  }
  
  if (sendWhatsapp) {
    methods.push(
      <Tag icon={<WhatsAppOutlined />} color="green" key="whatsapp">
        WhatsApp
      </Tag>
    );
  }
  
  if (sendEmail) {
    methods.push(
      <Tag icon={<MailOutlined />} color="blue" key="email">
        Email
      </Tag>
    );
  }
  
  if (methods.length === 0) {
    return (
      <Tag icon={<BellOutlined />} color="orange">
        None
      </Tag>
    );
  }
  
  return <Space size={4}>{methods}</Space>;
};

// Main component
const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const puid = Cookies.get('id') || 0;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('PUID', puid);
      formData.append('Slug', window.location.pathname);
      formData.append('CrudAction', 'VIEW');
      formData.append('PageNo', pagination.current);
      formData.append('PageSize', pagination.pageSize);
      formData.append('Search', searchText);
      
      const response = await axios.post(`${API_URL}/Clients/manage`, formData);
      
      const data = response.data.data || [];
      setClients(data);
      setPagination({
        ...pagination,
        total: response.data.totalCount || 0
      });
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, puid]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients, refreshKey]);

  const debouncedSearch = debounce(value => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 500);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination
    });
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setFileList([]);
    setModalVisible(true);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setFileList([]);
    setModalVisible(true);
  };

  const handleViewClient = (client) => {
    setSelectedClient({...client, viewOnly: true});
    setFileList([]);
    setModalVisible(true);
  };

  const handleDeleteClient = (client) => {
    setSelectedClient(client);
    setDeleteModalVisible(true);
  };

  // Updated to properly reset state
  const handleModalClose = (refresh = false) => {
    setModalVisible(false);
    setSelectedClient(null);
    setFileList([]);
    
    if (refresh) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleDeleteModalClose = (refresh = false) => {
    setDeleteModalVisible(false);
    setSelectedClient(null);
    
    if (refresh) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const ActionMenu = ({ record }) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewClient(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditClient(record)}>
        Edit Client
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteClient(record)}>
        Delete Client
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (text, record, index) => index + 1 + (pagination.current - 1) * pagination.pageSize,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 40, 
            width: 40, 
            borderRadius: '50%', 
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12
          }}>
            <UserOutlined style={{ color: '#1890ff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.email}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 150,
      render: mobile => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PhoneOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {mobile || 'N/A'}
        </div>
      )
    },
    {
      title: 'Notification Preferences',
      key: 'notifications',
      width: 200,
      render: (_, record) => (
        <NotificationMethods
          sendSMS={record.sendSMS}
          sendWhatsapp={record.sendWhatsapp}
          sendEmail={record.sendEmail}
        />
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => <ClientStatus status={status} />
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Dropdown overlay={<ActionMenu record={record} />} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewClient(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClient(record)}
          />
        </Space>
      ),
    },
  ];

  // Form for adding/editing clients
  const ClientFormModal = ({ visible, onClose, client }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formTouched, setFormTouched] = useState(false);
    const [loadingCameras, setLoadingCameras] = useState(false);
    const [cameras, setCameras] = useState([]);
    
    const isEditMode = !!client && !client.viewOnly;
    const isViewOnly = client?.viewOnly;

    // Fetch cameras when modal becomes visible
    useEffect(() => {
      if (visible) {
        fetchCameras();
      }
    }, [visible]);
    
    // Set form values when client changes
    useEffect(() => {
      if (visible) {
        // Reset form touched state
        setFormTouched(false);
        
        // Use setTimeout to ensure form is properly reset
        setTimeout(() => {
          if (client) {
            form.setFieldsValue({
              id: client?.id,
              cameraId: client?.cameraId,
              name: client?.name,
              email: client?.email,
              mobile: client?.mobile,
              sendSMS: client?.sendSMS ?? false,
              sendWhatsapp: client?.sendWhatsapp ?? false,
              sendEmail: client?.sendEmail ?? false,
              status: client?.status ?? true
            });
          } else {
            form.resetFields();
            form.setFieldsValue({
              status: true,
              sendSMS: false,
              sendWhatsapp: false,
              sendEmail: false
            });
          }
        }, 100);
      }
    }, [visible, client, form]);
  
    const handleFormChange = () => {
      setFormTouched(true);
    };

    const fetchCameras = async () => {
      setLoadingCameras(true);
      try {
        const formData = new FormData();
        formData.append('PUID', puid);
        formData.append('Slug', window.location.pathname);
        formData.append('CrudAction', 'VIEW');
        formData.append('PageSize', 100);
        
        const response = await axios.post(`${API_URL}/Camera/manage`, formData);
        
        const data = response.data.data || [];
        setCameras(data);
      } catch (error) {
        console.error('Error fetching cameras:', error);
        message.error('Failed to load cameras');
      } finally {
        setLoadingCameras(false);
      }
    };
  
    const uploadProps = {
      name: 'files',
      multiple: true,
      fileList: fileList,
      beforeUpload: (file) => {
        setFileList(prev => [...prev, file]);
        return false;
      },
      onRemove: (file) => {
        setFileList(prev => prev.filter(item => item.uid !== file.uid));
      },
    };
  
    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        setLoading(true);
        
        const formData = new FormData();
        
        // Add form values to FormData
        Object.keys(values).forEach(key => {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        });
        
        // Add additional parameters
        formData.append('PUID', puid);
        formData.append('Slug', window.location.pathname);
        formData.append('CrudAction', isEditMode ? 'EDIT' : 'ADD');
        
        // Add files to FormData if any
        fileList.forEach(file => {
          formData.append('files', file);
        });
        
        // Send request with FormData
        await axios.post(`${API_URL}/Clients/manage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        message.success(`Client ${isEditMode ? 'updated' : 'added'} successfully`);
        onClose(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} client`);
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
          <UserOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
        )}
        <span>
          {isViewOnly ? 'Client Details' : isEditMode ? 'Edit Client' : 'Create New Client'}
        </span>
      </div>
    );

    // Simplified handleCancel function - directly close without confirmation
    const handleCancel = () => {
      onClose();
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
        maskClosable={false}
        keyboard={false}
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
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: 8 }}>
                <SyncOutlined spin style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>Processing...</div>
            </div>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
          disabled={isViewOnly || loading}
          onFieldsChange={handleFormChange}
          style={{ padding: '16px 0' }}
          preserve={false}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Client Name"
            rules={[{ required: true, message: 'Please enter a client name' }]}
            tooltip={{ title: "Full name of the client", icon: <InfoCircleOutlined /> }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter client name"
            />
          </Form.Item>

          <Form.Item
            name="cameraId"
            label="Associated Camera"
            tooltip={{ title: "Camera that this client will receive notifications for", icon: <InfoCircleOutlined /> }}
          >
            <Select
              placeholder="Select a camera"
              loading={loadingCameras}
              allowClear
              showSearch
              filterOption={(input, option) => {
                // Safe access to option text for filtering
                const text = option?.children?.props?.children?.[1]?.props?.children || '';
                return text.toString().toLowerCase().includes(input.toLowerCase());
              }}
            >
              {cameras.map(camera => (
                <Select.Option key={camera.id} value={camera.id}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#1890ff',
                      marginRight: 8
                    }}>
                      <VideoCameraOutlined style={{ color: 'white', fontSize: 12 }} />
                    </span>
                    {camera.name}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16,
            marginBottom: 16
          }}>
                       <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { type: 'email', message: 'Please enter a valid email address' },
                { required: true, message: 'Please enter an email address' }
              ]}
              tooltip={{ title: "Email address for notifications", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter email address"
              />
            </Form.Item>
            
            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[{ required: true, message: 'Please enter a mobile number' }]}
              tooltip={{ title: "Mobile number for SMS and WhatsApp notifications", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter mobile number"
              />
            </Form.Item>
          </div>
          
          <div style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16 
          }}>
            <div style={{ marginBottom: 12, fontWeight: 500 }}>Notification Preferences</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Form.Item
                name="sendEmail"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 12,
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: '#e6f7ff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: 12
                    }}>
                      <MailOutlined style={{ color: '#1890ff' }} />
                    </div>
                    <div>
                      <div>Email</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
              
              <Form.Item
                name="sendSMS"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 12,
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: '#f9f0ff', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: 12
                    }}>
                      <PhoneOutlined style={{ color: '#722ed1' }} />
                    </div>
                    <div>
                      <div>SMS</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
              
              <Form.Item
                name="sendWhatsapp"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: 12,
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #f0f0f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      background: '#f6ffed', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginRight: 12
                    }}>
                      <WhatsAppOutlined style={{ color: '#52c41a' }} />
                    </div>
                    <div>
                      <div>WhatsApp</div>
                    </div>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </div>
          </div>
          
          <Form.Item label="Attachments">
            <Dragger {...uploadProps}>
              <p style={{ padding: '16px 0 8px' }}>
                <CloudUploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </p>
              <p>Click or drag files to this area to upload</p>
              <p style={{ fontSize: 12, color: '#8c8c8c' }}>
                Support for single or bulk upload. Attach relevant client documents.
              </p>
            </Dragger>
            {fileList.length > 0 && (
              <div style={{ marginTop: 8, color: '#1890ff', fontSize: 13 }}>
                <PaperClipOutlined /> {fileList.length} file(s) attached
              </div>
            )}
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Client Status"
            valuePropName="checked"
            tooltip={{ title: "Enable or disable this client", icon: <InfoCircleOutlined /> }}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
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
                {isEditMode ? 'Update' : 'Create'} Client
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    );
  };

  // Delete confirmation modal
  const DeleteClientModal = ({ visible, onClose, client }) => {
    const [loading, setLoading] = useState(false);
    
    const handleDelete = async () => {
      if (!client || !client.id) return;
      
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('Id', client.id);
        formData.append('PUID', puid);
        formData.append('Slug', window.location.pathname);
        formData.append('CrudAction', 'DELETE');
        
        await axios.post(`${API_URL}/Clients/manage`, formData);
        
        message.success('Client deleted successfully');
        onClose(true);
      } catch (error) {
        console.error('Error deleting client:', error);
        message.error(error.response?.data?.message || 'Failed to delete client');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            <span>Delete Client</span>
          </div>
        }
        open={visible}
        onCancel={() => onClose()}
        footer={null}
        centered
        width={400}
        maskClosable={false}
        keyboard={false}
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <Text>
              Are you sure you want to delete this client? This action cannot be undone.
            </Text>
            
            {client && (
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
                  background: '#fff1f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  border: '1px solid #ffccc7'
                }}>
                  <UserOutlined style={{ color: '#ff4d4f' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 500 }}>{client.name}</div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#8c8c8c',
                    maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {client.email} · {client.mobile || 'No mobile'}
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

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        marginBottom: 24, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 16 
      }}>
        <div>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            marginBottom: 8, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <TeamOutlined style={{ marginRight: 12, color: '#1890ff' }} /> Client Management
          </h1>
          <p style={{ color: '#8c8c8c' }}>
            Create and manage client information and notification preferences
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search clients..." 
            prefix={<SearchOutlined />}
            onChange={e => debouncedSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: 8, 
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' 
      }}>
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TeamOutlined />
            <span style={{ fontWeight: 500 }}>Clients List</span>
            <Badge 
              count={pagination.total} 
              showZero
              style={{ backgroundColor: '#1890ff' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Refresh">
              <Button 
                icon={<SyncOutlined />}
                onClick={handleRefresh}
              />
            </Tooltip>
            <Tooltip title="Filter">
              <Button 
                icon={<FilterOutlined />}
              />
            </Tooltip>
          </div>
        </div>
        
        <Table
          columns={columns}
          dataSource={clients}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} clients`
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <EmptyStateIllustration />
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <ClientFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        client={selectedClient}
      />
      
      <DeleteClientModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        client={selectedClient}
      />
    </div>
  );
};

export default ClientManagement;