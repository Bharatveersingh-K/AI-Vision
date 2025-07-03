import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Space, Badge, message, Input, Tooltip, Menu, Dropdown, 
  Select, Modal, Form, Typography, Tag, Divider, InputNumber, Switch
} from 'antd';
import { 
  CreditCardOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  BellOutlined,
  AppstoreOutlined,
  WarningOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/axiosConfig';
import 'react-quill/dist/quill.snow.css';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

// Empty state component
const EmptyStateIllustration = () => (
  <div style={{ textAlign: 'center', padding: '24px' }}>
    <CreditCardOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <h3>No Subscription Plans</h3>
    <p style={{ color: '#8c8c8c' }}>
      Create subscription plans to offer different tiers of service with varying features and limits.
    </p>
  </div>
);

// Status badge component
const SubscriptionStatus = ({ status }) => (
  <Badge
    status={status ? "success" : "error"}
    text={status ? "Active" : "Inactive"}
  />
);

// Feature limit display component
const FeatureLimit = ({ icon, value, label, color }) => {
  const colors = {
    indigo: { bg: '#f0f5ff', icon: '#2f54eb' },
    cyan: { bg: '#e6fffb', icon: '#13c2c2' },
    amber: { bg: '#fff7e6', icon: '#fa8c16' },
    emerald: { bg: '#e6f7ff', icon: '#1890ff' }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      background: colors[color]?.bg || '#f0f5ff',
      borderRadius: 8, 
      padding: 12,
      border: '1px solid #f0f0f0'
    }}>
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: '50%', 
        background: colors[color]?.icon || '#2f54eb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white',
        marginBottom: 8
      }}>
        {icon}
      </div>
      <div style={{ fontSize: 18, fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</div>
    </div>
  );
};

// Main component for Subscription management
const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const navigate = useNavigate();
  const puid = Cookies.get('id') || 0;

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/Subscription/manage`, null, {
        params: {
          PUID: puid,
          Slug: window.location.pathname,
          CrudAction: 'VIEW',
          PageNo: pagination.current,
          PageSize: pagination.pageSize,
          Search: searchText
        }
      });
      
      const data = response.data.data || [];
      setSubscriptions(data);
      setPagination({
        ...pagination,
        total: response.data.totalCount || 0
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      message.error('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, puid]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions, refreshKey]);

  // Debounced search for performance
  const debouncedSearch = debounce(value => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 500);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination
    });
  };

  const handleAddSubscription = () => {
    setSelectedSubscription(null);
    setModalVisible(true);
  };

  const handleEditSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setModalVisible(true);
  };

  const handleViewSubscription = (subscription) => {
    setSelectedSubscription({...subscription, viewOnly: true});
    setModalVisible(true);
  };

  const handleDeleteSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setDeleteModalVisible(true);
  };

  const handleModalClose = (refresh = false) => {
    setModalVisible(false);
    if (refresh) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleDeleteModalClose = (refresh = false) => {
    setDeleteModalVisible(false);
    if (refresh) {
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const ActionMenu = ({ record }) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewSubscription(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditSubscription(record)}>
        Edit Subscription
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteSubscription(record)}>
        Delete Subscription
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Plan Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 40, 
            width: 40, 
            borderRadius: '50%', 
            background: '#722ed1', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 12, 
            color: 'white' 
          }}>
            <CreditCardOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.days} Days
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Features',
      key: 'features',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Tag color="blue" style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', borderRadius: 16 }}>
            <VideoCameraOutlined style={{ marginRight: 4 }} /> {record.camera} Cameras
          </Tag>
          <Tag color="purple" style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', borderRadius: 16 }}>
            <AppstoreOutlined style={{ marginRight: 4 }} /> {record.promptPerCamera} Prompts
          </Tag>
          <Tag color="orange" style={{ display: 'flex', alignItems: 'center', padding: '4px 8px', borderRadius: 16 }}>
            <BellOutlined style={{ marginRight: 4 }} /> {record.alertPerDay} Alerts/day
          </Tag>
        </div>
      )
    },
    {
      title: 'Duration',
      key: 'days',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
          <span>{record.days} Days</span>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => <SubscriptionStatus status={status} />
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
            onClick={() => handleViewSubscription(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditSubscription(record)}
          />
        </Space>
      ),
    },
  ];

  // Form for adding/editing subscriptions
  const SubscriptionFormModal = ({ visible, onClose, subscription }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formTouched, setFormTouched] = useState(false);
    
    const isEditMode = !!subscription && !subscription.viewOnly;
    const isViewOnly = subscription?.viewOnly;
    
    useEffect(() => {
      if (visible) {
        setFormTouched(false);
        
        if (subscription) {
          form.setFieldsValue({
            id: subscription?.id,
            name: subscription?.name,
            about: subscription?.about,
            days: subscription?.days,
            camera: subscription?.camera,
            promptPerCamera: subscription?.promptPerCamera,
            alertPerDay: subscription?.alertPerDay,
            status: subscription?.status ?? true
          });
        } else {
          form.resetFields();
          form.setFieldsValue({
            status: true,
            days: 30,
            camera: 1,
            promptPerCamera: 1,
            alertPerDay: 10
          });
        }
      }
    }, [visible, subscription, form]);
  
    const handleFormChange = () => {
      setFormTouched(true);
    };
  
    const handleSubmit = async () => {
      try {
        const values = await form.validateFields();
        setLoading(true);
        
        const params = {
          ...values,
          PUID: puid,
          Slug: window.location.pathname,
          CrudAction: isEditMode ? 'EDIT' : 'ADD'
        };
        
        await axios.post(`${API_URL}/Subscription/manage`, null, { params });
        
        message.success(`Subscription plan ${isEditMode ? 'updated' : 'added'} successfully`);
        onClose(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} subscription plan`);
      } finally {
        setLoading(false);
      }
    };
    
    const modalTitle = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isViewOnly ? (
          <EyeOutlined style={{ fontSize: 20, marginRight: 8, color: '#722ed1' }} />
        ) : isEditMode ? (
          <EditOutlined style={{ fontSize: 20, marginRight: 8, color: '#722ed1' }} />
        ) : (
          <CreditCardOutlined style={{ fontSize: 20, marginRight: 8, color: '#722ed1' }} />
        )}
        <span>
          {isViewOnly ? 'Subscription Plan Details' : isEditMode ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
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
          onOk: () => onClose()
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
        transitionName="" // Remove transition animation
        maskTransitionName="" // Remove mask transition animation
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
                <SyncOutlined spin style={{ fontSize: 24, color: '#722ed1' }} />
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
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          
          <div style={{ 
            background: '#f9fafb', 
            padding: 16, 
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            marginBottom: 16 
          }}>
            <Form.Item
              name="name"
              label="Plan Name"
              rules={[{ required: true, message: 'Please enter a plan name' }]}
              tooltip={{ title: "Give your subscription plan a clear, descriptive name", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                placeholder="e.g. Basic, Premium, Enterprise" 
                prefix={<CreditCardOutlined style={{ color: '#722ed1' }} />}
                maxLength={50}
              />
            </Form.Item>
            
            <Form.Item
              name="about"
              label="Description"
              tooltip={{ title: "Explain what this plan offers to customers", icon: <InfoCircleOutlined /> }}
            >
              <TextArea 
                placeholder="Describe the features and benefits of this subscription plan..." 
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>
          </div>
          
          <div style={{ 
            background: '#f9fafb', 
            padding: 16, 
            borderRadius: 8,
            border: '1px solid #f0f0f0',
            marginBottom: 16 
          }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 500 }}>
                <InfoCircleOutlined style={{ color: '#722ed1', marginRight: 8 }} /> 
                Plan Limits & Features
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: 16 
              }}>
                <Form.Item
                  name="days"
                  label="Duration (Days)"
                  rules={[{ required: true, message: 'Please enter subscription duration' }]}
                  tooltip={{ title: "How many days this subscription will be valid for", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    placeholder="e.g. 30" 
                    style={{ width: '100%' }}
                                       min={1}
                    max={365}
                    addonBefore={<CalendarOutlined style={{ color: '#1890ff' }} />}
                    addonAfter="Days"
                  />
                </Form.Item>
                
                <Form.Item
                  name="camera"
                  label="Camera Limit"
                  rules={[{ required: true, message: 'Please enter camera limit' }]}
                  tooltip={{ title: "Maximum number of cameras allowed for this plan", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    placeholder="e.g. 5" 
                    style={{ width: '100%' }}
                    min={1}
                    max={100}
                    addonBefore={<VideoCameraOutlined style={{ color: '#1890ff' }} />}
                    addonAfter="Cameras"
                  />
                </Form.Item>
                
                <Form.Item
                  name="promptPerCamera"
                  label="Prompts Per Camera"
                  rules={[{ required: true, message: 'Please enter prompts per camera limit' }]}
                  tooltip={{ title: "Maximum number of prompts that can be assigned to each camera", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    placeholder="e.g. 3" 
                    style={{ width: '100%' }}
                    min={1}
                    max={50}
                    addonBefore={<AppstoreOutlined style={{ color: '#722ed1' }} />}
                    addonAfter="Prompts"
                  />
                </Form.Item>
                
                <Form.Item
                  name="alertPerDay"
                  label="Alerts Per Day"
                  rules={[{ required: true, message: 'Please enter alerts per day limit' }]}
                  tooltip={{ title: "Maximum number of alerts that can be triggered per day", icon: <InfoCircleOutlined /> }}
                >
                  <InputNumber 
                    placeholder="e.g. 50" 
                    style={{ width: '100%' }}
                    min={1}
                    max={1000}
                    addonBefore={<BellOutlined style={{ color: '#fa8c16' }} />}
                    addonAfter="Alerts"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          
          <Form.Item
            name="status"
            label="Plan Status"
            valuePropName="checked"
            tooltip={{ title: "Enable or disable this subscription plan", icon: <InfoCircleOutlined /> }}
          >
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive" 
            />
          </Form.Item>
          
          {isViewOnly && subscription && (
            <div style={{ 
              marginTop: 24, 
              padding: 16, 
              borderTop: '1px solid #f0f0f0' 
            }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>Plan Features Summary</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                gap: 16 
              }}>
                <FeatureLimit 
                  icon={<CalendarOutlined />} 
                  value={subscription.days} 
                  label="Days" 
                  color="cyan" 
                />
                <FeatureLimit 
                  icon={<VideoCameraOutlined />} 
                  value={subscription.camera} 
                  label="Cameras" 
                  color="indigo" 
                />
                <FeatureLimit 
                  icon={<AppstoreOutlined />} 
                  value={subscription.promptPerCamera} 
                  label="Prompts per Camera" 
                  color="purple" 
                />
                <FeatureLimit 
                  icon={<BellOutlined />} 
                  value={subscription.alertPerDay} 
                  label="Alerts per Day" 
                  color="amber" 
                />
              </div>
            </div>
          )}
          
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
                {isEditMode ? 'Update' : 'Create'} Subscription Plan
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    );
  };

  // Delete confirmation modal
  const DeleteSubscriptionModal = ({ visible, onClose, subscription }) => {
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
      if (!subscription || !subscription.id) return;
      
      setLoading(true);
      try {
        await axios.post(`${API_URL}/Subscription/manage`, null, {
          params: {
            Id: subscription.id,
            PUID: puid,
            Slug: window.location.pathname,
            CrudAction: 'DELETE'
          }
        });
        
        message.success('Subscription plan deleted successfully');
        onClose(true);
      } catch (error) {
        console.error('Error deleting subscription plan:', error);
        message.error(error.response?.data?.message || 'Failed to delete subscription plan');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            <span>Delete Subscription Plan</span>
          </div>
        }
        open={visible}
        onCancel={() => onClose()}
        footer={null}
        centered
        width={420}
        transitionName="" // Remove transition animation
        maskTransitionName="" // Remove mask transition animation
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <Text>
              Are you sure you want to delete the <strong>{subscription?.name}</strong> subscription plan? This action cannot be undone.
            </Text>
            
            {subscription && (
              <div style={{ 
                marginTop: 16, 
                background: '#fff7e6', 
                border: '1px solid #ffbb96', 
                borderRadius: 8, 
                padding: 16 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <WarningOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                  <Text strong style={{ color: '#fa8c16' }}>Warning</Text>
                </div>
                <Text>
                  Deleting this plan may affect users who are currently subscribed to it.
                </Text>
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
              Delete Plan
            </Button>
          </Space>
        </div>
      </Modal>
    );
  };

  // Subscription detail card for expanded rows
  const SubscriptionDetailCard = ({ record }) => (
    <div style={{ 
      background: '#fafafa', 
      padding: 20, 
      borderRadius: 8, 
      border: '1px solid #f0f0f0', 
      marginTop: 4 
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: 24,
        '@media (max-width: 768px)': {
          gridTemplateColumns: '1fr'
        }
      }}>
        <div>
          <h4 style={{ 
            fontSize: 16, 
            fontWeight: 500, 
            marginBottom: 12, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <InfoCircleOutlined style={{ color: '#722ed1', marginRight: 8 }} /> 
            Plan Description
          </h4>
          <div style={{ 
            background: '#fff', 
            padding: 16, 
            borderRadius: 8, 
            border: '1px solid #f0f0f0' 
          }}>
            {record.about ? (
              <div style={{ whiteSpace: 'pre-line' }}>
                {record.about}
              </div>
            ) : (
              <div style={{ color: '#8c8c8c', fontStyle: 'italic' }}>No description provided</div>
            )}
          </div>
        </div>
        
        <div>
          <h4 style={{ 
            fontSize: 16, 
            fontWeight: 500, 
            marginBottom: 12, 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <AppstoreOutlined style={{ color: '#722ed1', marginRight: 8 }} /> 
            Plan Features
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
            gap: 16 
          }}>
            <FeatureLimit 
              icon={<CalendarOutlined />} 
              value={record.days} 
              label="Days" 
              color="cyan" 
            />
            <FeatureLimit 
              icon={<VideoCameraOutlined />} 
              value={record.camera} 
              label="Cameras" 
              color="indigo" 
            />
            <FeatureLimit 
              icon={<AppstoreOutlined />} 
              value={record.promptPerCamera} 
              label="Prompts per Camera" 
              color="purple" 
            />
            <FeatureLimit 
              icon={<BellOutlined />} 
              value={record.alertPerDay} 
              label="Alerts per Day" 
              color="amber" 
            />
          </div>
        </div>
      </div>
    </div>
  );

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
            <CreditCardOutlined style={{ marginRight: 12, color: '#722ed1' }} /> Subscription Plans
          </h1>
          <p style={{ color: '#8c8c8c' }}>
            Manage subscription plans, features, and limits
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search plans..." 
            prefix={<SearchOutlined />}
            onChange={e => debouncedSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddSubscription}
          >
            Create Plan
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
            <CreditCardOutlined />
            <span style={{ fontWeight: 500 }}>Subscription Plans</span>
            <Badge 
              count={pagination.total} 
              showZero
              style={{ backgroundColor: '#722ed1' }}
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
          dataSource={subscriptions}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} plans`
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <EmptyStateIllustration />
          }}
          scroll={{ x: 'max-content' }}
          expandable={{
            expandedRowRender: record => <SubscriptionDetailCard record={record} />,
            expandRowByClick: true
          }}
        />
      </div>
      
      <SubscriptionFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        subscription={selectedSubscription}
      />
      
      <DeleteSubscriptionModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default SubscriptionManagement;