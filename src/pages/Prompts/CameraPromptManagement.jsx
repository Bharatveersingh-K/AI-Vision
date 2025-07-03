import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Space, Badge, message, Input, Tooltip, Menu, Dropdown, 
  Select, Modal, Form, Typography
} from 'antd';
import { 
  LinkOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  FormOutlined,
  VideoCameraOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  ApiOutlined,
  DisconnectOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../api/axiosConfig';

const { Option } = Select;
const { Text } = Typography;

// Empty state component
const EmptyStateIllustration = () => (
  <div style={{ textAlign: 'center', padding: '24px' }}>
    <LinkOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <h3>No Camera-Prompt Associations</h3>
    <p style={{ color: '#8c8c8c' }}>
      Link cameras to prompts to automate AI vision analysis with custom instructions.
    </p>
  </div>
);

// Status component
const AssociationStatus = ({ status }) => (
  <Badge
    status={status ? "success" : "error"}
    text={status ? "Active" : "Inactive"}
  />
);

// Main component
const CameraPromptManagement = () => {
  const [cameraPrompts, setCameraPrompts] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadingCameras, setLoadingCameras] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  
  const navigate = useNavigate();
  const puid = Cookies.get('id') || 0;

  // Fetch camera-prompt associations
  const fetchCameraPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/CameraPrompt/manage`, null, {
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
      setCameraPrompts(data);
      setPagination({
        ...pagination,
        total: response.data.totalCount || 0
      });
    } catch (error) {
      console.error('Error fetching camera-prompt associations:', error);
      message.error('Failed to fetch camera-prompt associations');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchText, puid]);

  // Fetch cameras for dropdown
  const fetchCameras = async () => {
    setLoadingCameras(true);
    try {
      const response = await axios.post(`${API_URL}/Camera/manage`, null, {
        params: {
          PUID: puid,
          Slug: window.location.pathname,
          CrudAction: 'VIEW',
          PageSize: 100
        }
      });
      
      const data = response.data.data || [];
      setCameras(data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
      message.error('Failed to load cameras');
    } finally {
      setLoadingCameras(false);
    }
  };

  // Fetch prompts for dropdown
  const fetchPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const response = await axios.post(`${API_URL}/Prompt/manage`, null, {
        params: {
          PUID: puid,
          Slug: window.location.pathname,
          CrudAction: 'VIEW',
          PageSize: 100
        }
      });
      
      const data = response.data.data || [];
      setPrompts(data);
    } catch (error) {
      console.error('Error fetching prompts:', error);
      message.error('Failed to load prompts');
    } finally {
      setLoadingPrompts(false);
    }
  };

  useEffect(() => {
    fetchCameraPrompts();
  }, [fetchCameraPrompts, refreshKey]);

  const debouncedSearch = debounce(value => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 500);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination
    });
  };

  const handleAddAssociation = () => {
    setSelectedAssociation(null);
    setModalVisible(true);
    fetchCameras();
    fetchPrompts();
  };

  const handleEditAssociation = (association) => {
    setSelectedAssociation(association);
    setModalVisible(true);
    fetchCameras();
    fetchPrompts();
  };

  const handleViewAssociation = (association) => {
    setSelectedAssociation({...association, viewOnly: true});
    setModalVisible(true);
    fetchCameras();
    fetchPrompts();
  };

  const handleDeleteAssociation = (association) => {
    setSelectedAssociation(association);
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
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewAssociation(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditAssociation(record)}>
        Edit Association
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteAssociation(record)}>
        Delete Association
      </Menu.Item>
    </Menu>
  );

  // Find camera and prompt names for display
  const getCameraName = (cameraId) => {
    const camera = cameras.find(c => c.id === cameraId);
    return camera ? camera.name : `Camera #${cameraId}`;
  };

  const getPromptName = (promptId) => {
    const prompt = prompts.find(p => p.id === promptId);
    return prompt ? prompt.name : `Prompt #${promptId}`;
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Camera',
      dataIndex: 'cameraId',
      key: 'camera',
      render: (cameraId) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 40, 
            width: 40, 
            borderRadius: '50%', 
            background: '#1890ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 12 
          }}>
            <VideoCameraOutlined style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{getCameraName(cameraId)}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              ID: {cameraId}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Prompt',
      dataIndex: 'promptId',
      key: 'prompt',
      render: (promptId) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 40, 
            width: 40, 
            borderRadius: '50%', 
            background: '#722ed1', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 12 
          }}>
            <FormOutlined style={{ color: 'white' }} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{getPromptName(promptId)}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              ID: {promptId}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => <AssociationStatus status={status} />
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
            onClick={() => handleViewAssociation(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditAssociation(record)}
          />
        </Space>
      ),
    },
  ];

  // Form modal for adding/editing associations
  const CameraPromptFormModal = ({ visible, onClose, association }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formTouched, setFormTouched] = useState(false);
    
    const isEditMode = !!association && !association.viewOnly;
    const isViewOnly = association?.viewOnly;
    
    useEffect(() => {
      if (visible) {
        setFormTouched(false);
        
        if (association) {
          form.setFieldsValue({
            id: association?.id,
            cameraId: association?.cameraId,
            promptId: association?.promptId,
            status: association?.status ?? true
          });
        } else {
          form.resetFields();
          form.setFieldsValue({
            status: true
          });
        }
      }
    }, [visible, association, form]);
  
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
        
        await axios.post(`${API_URL}/CameraPrompt/manage`, null, { params });
        
        message.success(`Camera-Prompt association ${isEditMode ? 'updated' : 'added'} successfully`);
        onClose(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} association`);
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
          <LinkOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
        )}
        <span>
          {isViewOnly ? 'Camera-Prompt Details' : isEditMode ? 'Edit Camera-Prompt' : 'Create Camera-Prompt Association'}
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
        width={600}
        centered
        destroyOnClose
        transitionName="" // Remove transition
        maskTransitionName="" // Remove mask transition
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
            zIndex: 1000
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
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          
          <div style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 16, 
            textAlign: 'center' 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 16 
            }}>
              <div style={{ 
                height: 48, 
                width: 48, 
                borderRadius: '50%', 
                background: '#1890ff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <VideoCameraOutlined style={{ color: 'white', fontSize: 20 }} />
              </div>
              <div style={{ 
                margin: '0 16px', 
                color: '#1890ff', 
                fontSize: 20, 
                fontWeight: 'bold' 
              }}>
                <LinkOutlined />
              </div>
              <div style={{ 
                height: 48, 
                width: 48, 
                borderRadius: '50%', 
                background: '#722ed1', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <FormOutlined style={{ color: 'white', fontSize: 20 }} />
              </div>
            </div>
            
            <Form.Item
              name="cameraId"
              label="Select Camera"
              rules={[{ required: true, message: 'Please select a camera' }]}
              tooltip={{ title: "Choose the camera to associate with a prompt", icon: <InfoCircleOutlined /> }}
            >
              <Select
                placeholder="Select a camera"
                loading={loadingCameras}
                disabled={isViewOnly || loadingCameras}
                showSearch
                filterOption={(input, option) =>
                  option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {cameras.map(camera => (
                  <Option key={camera.id} value={camera.id}>
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
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="promptId"
              label="Select Prompt"
              rules={[{ required: true, message: 'Please select a prompt' }]}
              tooltip={{ title: "Choose the prompt to associate with the camera", icon: <InfoCircleOutlined /> }}
            >
              <Select
                placeholder="Select a prompt"
                loading={loadingPrompts}
                disabled={isViewOnly || loadingPrompts}
                showSearch
                filterOption={(input, option) =>
                  option.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {prompts.map(prompt => (
                  <Option key={prompt.id} value={prompt.id}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: '#722ed1',
                      marginRight: 8
                    }}>
                      <FormOutlined style={{ color: 'white', fontSize: 12 }} />
                    </span>
                    {prompt.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <Form.Item
            name="status"
            label="Association Status"
            tooltip={{ title: "Enable or disable this camera-prompt association", icon: <InfoCircleOutlined /> }}
          >
            <Select defaultValue={true}>
              <Option value={true}>
                <Badge status="success" text="Active" />
              </Option>
              <Option value={false}>
                <Badge status="error" text="Inactive" />
              </Option>
            </Select>
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
                {isEditMode ? 'Update' : 'Create'} Association
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    );
  };

  // Delete confirmation modal
  const DeleteAssociationModal = ({ visible, onClose, association }) => {
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
      if (!association || !association.id) return;
      
      setLoading(true);
      try {
        await axios.post(`${API_URL}/CameraPrompt/manage`, null, {
          params: {
            Id: association.id,
            PUID: puid,
            Slug: window.location.pathname,
            CrudAction: 'DELETE'
          }
        });
        
        message.success('Camera-Prompt association deleted successfully');
        onClose(true);
      } catch (error) {
        console.error('Error deleting association:', error);
        message.error(error.response?.data?.message || 'Failed to delete association');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            <span>Remove Association</span>
          </div>
        }
        open={visible}
        onCancel={() => onClose()}
        footer={null}
        centered
        width={420}
        transitionName="" // Remove transition
        maskTransitionName="" // Remove mask transition
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <Text>
              Are you sure you want to delete this camera-prompt association? This action cannot be undone.
            </Text>
            
            {association && (
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: '#1890ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <VideoCameraOutlined style={{ color: 'white', fontSize: 16 }} />
                  </div>
                  <div style={{ 
                    margin: '0 8px', 
                    color: '#ff4d4f'
                  }}>
                    <DisconnectOutlined />
                  </div>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: '#722ed1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FormOutlined style={{ color: 'white', fontSize: 16 }} />
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
            <LinkOutlined style={{ marginRight: 12, color: '#1890ff' }} /> Camera-Prompt Associations
          </h1>
          <p style={{ color: '#8c8c8c' }}>
            Link cameras to prompts for customized AI vision analysis
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search associations..." 
            prefix={<SearchOutlined />}
            onChange={e => debouncedSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddAssociation}
          >
            Create Association
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
            <LinkOutlined />
            <span style={{ fontWeight: 500 }}>Associations List</span>
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
          dataSource={cameraPrompts}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} associations`
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <EmptyStateIllustration />
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <CameraPromptFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        association={selectedAssociation}
      />
      
      <DeleteAssociationModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        association={selectedAssociation}
      />
    </div>
  );
};

export default CameraPromptManagement;