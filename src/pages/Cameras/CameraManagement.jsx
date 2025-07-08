import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Badge, message, Input, Tooltip, Menu, Dropdown } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  SyncOutlined, 
  VideoCameraOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import CameraFormModal from './CameraFormModal';
import DeleteCameraModal from './DeleteCameraModal';
import { API_URL } from '../../api/axiosConfig';

const EmptyStateIllustration = () => (
  <div style={{ textAlign: 'center', padding: '24px' }}>
    <VideoCameraOutlined style={{ fontSize: 40, color: '#bfbfbf', marginBottom: 16 }} />
    <h3>No Cameras Found</h3>
    <p style={{ color: '#8c8c8c' }}>
      Add your first camera to start monitoring and analyzing video feeds with AI Vision.
    </p>
  </div>
);

const CameraStatus = ({ status, rtspLink }) => {
  const isOnline = status && rtspLink;
  
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Badge
        status={isOnline ? "success" : "error"}
        text={isOnline ? "Online" : "Offline"}
      />
      {!rtspLink && (
        <Tooltip title="RTSP link not configured">
          <ExclamationCircleOutlined style={{ marginLeft: 8, color: '#faad14' }} />
        </Tooltip>
      )}
    </div>
  );
};

const CameraManagement = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const puid = Cookies.get('id') || 0;

 const fetchCameras = useCallback(async () => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('PUID', puid);
    formData.append('Slug', window.location.pathname);
    formData.append('CrudAction', 'VIEW');
    formData.append('PageNo', pagination.current);
    formData.append('PageSize', pagination.pageSize);
    formData.append('Search', searchText);

    const response = await axios.post(`${API_URL}/Camera/manage`, formData);
    
    const data = response.data.data || [];
    setCameras(data);
    setPagination({
      ...pagination,
      total: response.data.totalCount || 0
    });
  } catch (error) {
    console.error('Error fetching cameras:', error);
    message.error('Failed to fetch cameras');
  } finally {
    setLoading(false);
  }
}, [pagination.current, pagination.pageSize, searchText, puid]);
  useEffect(() => {
    fetchCameras();
  }, [fetchCameras, refreshKey]);

  const debouncedSearch = debounce(value => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, 500);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...newPagination
    });
  };

  const handleAddCamera = () => {
    setSelectedCamera(null);
    setModalVisible(true);
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setModalVisible(true);
  };

  const handleViewCamera = (camera) => {
    setSelectedCamera({...camera, viewOnly: true});
    setModalVisible(true);
  };

  const handleDeleteCamera = (camera) => {
    setSelectedCamera(camera);
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
      <Menu.Item key="view" icon={<EyeOutlined />} onClick={() => handleViewCamera(record)}>
        View Details
      </Menu.Item>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditCamera(record)}>
        Edit Camera
      </Menu.Item>
      <Menu.Item key="stream" icon={<PlayCircleOutlined />} onClick={() => navigate(`/cameras/${record.id}/stream`)}>
        View Stream
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDeleteCamera(record)}>
        Delete Camera
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => <span>#{(pagination.current - 1) * pagination.pageSize + index + 1}</span>
    },
    {
      title: 'Camera',
      dataIndex: 'name',
      key: 'name',
           render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 40, 
            width: 64, 
            borderRadius: 4, 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: 12
          }}>
            <VideoCameraOutlined style={{ color: record.rtspLink ? '#1890ff' : '#bfbfbf', fontSize: 18 }} />
            {record.rtspLink && record.status && (
              <Badge status="success" style={{ position: 'absolute', bottom: 2, right: 2 }} />
            )}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
              {record.rtspLink || "No RTSP link configured"}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'About',
      dataIndex: 'about',
      key: 'about',
      render: about => (
        <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {about || <span style={{ fontStyle: 'italic', color: '#bfbfbf' }}>No description</span>}
        </div>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (_, record) => (
        <div>
          {record.city && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvironmentOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />
              <span>{[record.city, record.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {record.landmark && (
            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>
              Near: {record.landmark}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status, record) => <CameraStatus status={status} rtspLink={record.rtspLink} />
    },
    {
      title: 'Order',
      dataIndex: 'viewOrder',
      key: 'viewOrder',
      width: 80,
      render: order => (
        <span>{order !== undefined && order !== null ? order : '-'}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Dropdown overlay={<ActionMenu record={record} />} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/cameras/${record.id}/stream`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditCamera(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, display: 'flex', alignItems: 'center' }}>
            <VideoCameraOutlined style={{ marginRight: 12, color: '#1890ff' }} /> Camera Management
          </h1>
          <p style={{ color: '#8c8c8c' }}>
            Configure and monitor camera feeds for AI analysis
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search cameras..." 
            prefix={<SearchOutlined />}
            onChange={e => debouncedSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddCamera}
          >
            Add Camera
          </Button>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <VideoCameraOutlined />
            <span style={{ fontWeight: 500 }}>Cameras List</span>
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
          dataSource={cameras}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} cameras`
          }}
          onChange={handleTableChange}
          loading={loading}
          locale={{
            emptyText: <EmptyStateIllustration />
          }}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <CameraFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        camera={selectedCamera}
      />
      
      <DeleteCameraModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        camera={selectedCamera}
      />
    </div>
  );
};

export default CameraManagement;