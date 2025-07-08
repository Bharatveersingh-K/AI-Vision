import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, Button, Space, Badge, message, Input, Tooltip, Menu, Dropdown, 
  Switch, Upload, Modal, Form, Typography, Tag, Divider 
} from 'antd';
import { 
  FormOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  MessageOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  MailOutlined,
  WhatsAppOutlined,
  FileAddOutlined,
  SaveOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  CopyOutlined,
  PaperClipOutlined,
  BellOutlined
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
    <FormOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <h3>No Prompts Found</h3>
    <p style={{ color: '#8c8c8c' }}>
      Create your first prompt to automate responses and notifications.
    </p>
  </div>
);

// Status component
const PromptStatus = ({ status }) => (
  <Badge
    status={status ? "success" : "error"}
    text={status ? "Active" : "Inactive"}
  />
);

// Main component
const PromptManagement = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
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

 const fetchPrompts = useCallback(async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('PUID', puid);
    formData.append('Slug', window.location.pathname);
    formData.append('CrudAction', 'VIEW');
    formData.append('PageNo', pagination.current);
    formData.append('PageSize', pagination.pageSize);
    formData.append('Search', searchText);
    
    const response = await axios.post(`${API_URL}/Prompt/manage`, formData);
    
    const data = response.data.data || [];
    setPrompts(data);
    setPagination({
      ...pagination,
      total: response.data.totalCount || 0
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    message.error('Failed to fetch prompts');
  } finally {
    setLoading(false);
  }
}, [pagination.current, pagination.pageSize, searchText, puid]);
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts, refreshKey]);

  const debouncedSearch = debounce(value => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 500);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination
    });
  };

  const handleAddPrompt = () => {
    setSelectedPrompt(null);
    setFileList([]);
    setModalVisible(true);
  };

  const handleEditPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    setFileList([]);
    setModalVisible(true);
  };

  const handleViewPrompt = (prompt) => {
    setSelectedPrompt({...prompt, viewOnly: true});
    setFileList([]);
    setModalVisible(true);
  };

  const handleDeletePrompt = (prompt) => {
    setSelectedPrompt(prompt);
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

  const copyPromptText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Prompt copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      message.error('Failed to copy prompt text');
    });
  };

  const ActionMenu = ({ record }) => (
    <Menu>
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewPrompt(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditPrompt(record)}>
        Edit Prompt
      </Menu.Item>
      <Menu.Item key="copy" icon={<CopyOutlined />} onClick={() => copyPromptText(record.prompt)}>
        Copy Prompt Text
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeletePrompt(record)}>
        Delete Prompt
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
            <FormOutlined style={{ color: '#1890ff' }} />
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.prompt && record.prompt.length > 50 
                ? `${record.prompt.substring(0, 50)}...` 
                : record.prompt || "No prompt text"
              }
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Timer',
      dataIndex: 'timer',
      key: 'timer',
      width: 100,
      render: timer => <span>{timer || 'N/A'}</span>
    },
    {
      title: 'Loop',
      dataIndex: 'loop',
      key: 'loop',
      width: 100,
      render: loop => <span>{loop || 'N/A'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: status => <PromptStatus status={status} />
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
            onClick={() => handleViewPrompt(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditPrompt(record)}
          />
        </Space>
      ),
    },
  ];

  // Form for adding/editing prompts
  const PromptFormModal = ({ visible, onClose, prompt }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [formTouched, setFormTouched] = useState(false);
    
    const isEditMode = !!prompt && !prompt.viewOnly;
    const isViewOnly = prompt?.viewOnly;
    
    useEffect(() => {
      if (visible) {
        setFormTouched(false);
        
        if (prompt) {
          form.setFieldsValue({
            id: prompt?.id,
            cameraId: prompt?.cameraId,
            name: prompt?.name,
            prompt: prompt?.prompt,
            result: prompt?.result,
            timer: prompt?.timer,
            loop: prompt?.loop,
            status: prompt?.status ?? true
          });
        } else {
          form.resetFields();
          form.setFieldsValue({
            status: true,
            timer: 0,
            loop: ''
          });
        }
      }
    }, [visible, prompt, form]);
  
    const handleFormChange = () => {
      setFormTouched(true);
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
    await axios.post(`${API_URL}/Prompt/manage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    message.success(`Prompt ${isEditMode ? 'updated' : 'added'} successfully`);
    onClose(true);
  } catch (error) {
    console.error('Error submitting form:', error);
    message.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} prompt`);
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
          <FormOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
        )}
        <span>
          {isViewOnly ? 'Prompt Details' : isEditMode ? 'Edit Prompt' : 'Create New Prompt'}
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
          
          <Form.Item name="cameraId" hidden>
            <Input />
          </Form.Item>
          
          <Form.Item
            name="name"
            label="Prompt Name"
            rules={[{ required: true, message: 'Please enter a prompt name' }]}
            tooltip={{ title: "A descriptive name for this prompt", icon: <InfoCircleOutlined /> }}
          >
            <Input 
              prefix={<FormOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Enter prompt name"
            />
          </Form.Item>
          
          <Form.Item
            name="prompt"
            label="Prompt Text"
            rules={[{ required: true, message: 'Please enter the prompt text' }]}
            tooltip={{ title: "The full text of your prompt", icon: <InfoCircleOutlined /> }}
          >
            <TextArea 
              placeholder="Enter your prompt text here..."
              autoSize={{ minRows: 4, maxRows: 8 }}
              showCount
              maxLength={2000}
            />
          </Form.Item>
          
          <Form.Item
            name="result"
            label="Result"
            tooltip={{ title: "Expected result or outcome of the prompt", icon: <InfoCircleOutlined /> }}
          >
            <TextArea 
              placeholder="Enter expected result..."
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16,
            marginBottom: 16
          }}>
            <Form.Item
              name="timer"
              label="Timer (seconds)"
              tooltip={{ title: "Timer in seconds", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                type="number" 
                min={0}
                placeholder="Enter timer in seconds"
              />
            </Form.Item>
            
            <Form.Item
              name="loop"
              label="Loop"
              tooltip={{ title: "Loop settings", icon: <InfoCircleOutlined /> }}
            >
              <Input 
                placeholder="Enter loop settings"
              />
            </Form.Item>
          </div>
          
          <Form.Item label="Attachments">
            <Dragger {...uploadProps}>
              <p style={{ padding: '16px 0 8px' }}>
                <CloudUploadOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </p>
              <p>Click or drag files to this area to upload</p>
              <p style={{ fontSize: 12, color: '#8c8c8c' }}>
                Support for single or bulk upload. Attach files that provide context to your prompt.
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
            label="Prompt Status"
            valuePropName="checked"
            tooltip={{ title: "Enable or disable this prompt", icon: <InfoCircleOutlined /> }}
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
                {isEditMode ? 'Update' : 'Create'} Prompt
              </Button>
            )}
          </div>
        </Form>
      </Modal>
    );
  };

  // Delete confirmation modal
  // Delete confirmation modal
  const DeletePromptModal = ({ visible, onClose, prompt }) => {
    const [loading, setLoading] = useState(false);
  
  const handleDelete = async () => {
  if (!prompt || !prompt.id) return;
  
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('Id', prompt.id);
    formData.append('PUID', puid);
    formData.append('Slug', window.location.pathname);
    formData.append('CrudAction', 'DELETE');
    
    await axios.post(`${API_URL}/Prompt/manage`, formData);
    
    message.success('Prompt deleted successfully');
    onClose(true);
  } catch (error) {
    console.error('Error deleting prompt:', error);
    message.error(error.response?.data?.message || 'Failed to delete prompt');
  } finally {
    setLoading(false);
  }
};
  
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
            <span>Delete Prompt</span>
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
              Are you sure you want to delete this prompt? This action cannot be undone.
            </Text>
            
            {prompt && (
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
                  <FormOutlined style={{ color: '#ff4d4f' }} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 500 }}>{prompt.name}</div>
                  <div style={{ 
                    fontSize: 12, 
                    color: '#8c8c8c',
                    maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {prompt.prompt && prompt.prompt.length > 50 
                      ? `${prompt.prompt.substring(0, 50)}...` 
                      : prompt.prompt || "No prompt text"
                    }
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
            <FormOutlined style={{ marginRight: 12, color: '#1890ff' }} /> Prompt Management
          </h1>
          <p style={{ color: '#8c8c8c' }}>
            Create and manage automated prompts for your application
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search prompts..." 
            prefix={<SearchOutlined />}
            onChange={e => debouncedSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<FileAddOutlined />} 
            onClick={handleAddPrompt}
          >
            Create Prompt
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
            <FormOutlined />
            <span style={{ fontWeight: 500 }}>Prompts List</span>
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
          dataSource={prompts}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} prompts`
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <EmptyStateIllustration />
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <PromptFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        prompt={selectedPrompt}
      />
      
      <DeletePromptModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        prompt={selectedPrompt}
      />
    </div>
  );
};

export default PromptManagement;