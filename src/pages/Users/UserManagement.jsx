import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Badge, message, Tag, Input, Tooltip } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  SyncOutlined, 
  UserOutlined,
  EyeOutlined,
  FilterOutlined,
  ExportOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Cookies from 'js-cookie';
import UserFormModal from './UserFormModal';
import DeleteUserModal from './DeleteUserModal';
import { API_URL } from '../../api/axiosConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const puid = Cookies.get('id') || 0;

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, searchText, refreshKey]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/User/manage`, null, {
        params: {
          PUID: puid,
          Slug: window.location.pathname,
          CrudAction: 'VIEW',
          PageNo: pagination.current,
          PageSize: pagination.pageSize,
          Search: searchText
        }
      });
      
      setUsers(response.data.data || []);
      setPagination({
        ...pagination,
        total: response.data.totalCount || 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser({...user, viewOnly: true});
    setModalVisible(true);
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

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({...pagination, current: 1});
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id) => (
        <Tag color="#f0f0f0" style={{ color: '#595959' }}>
          #{id}
        </Tag>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            height: 36, 
            width: 36, 
            borderRadius: '50%', 
            background: '#1890ff', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginRight: 12,
            color: 'white',
            fontWeight: 500 
          }}>
            {name ? name.charAt(0).toUpperCase() : <UserOutlined />}
          </div>
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.userName}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => {
        let color;
        switch(role?.toUpperCase()) {
          case 'ADMIN':
            color = 'blue';
            break;
          case 'MASTER':
            color = 'purple';
            break;
          case 'USER':
            color = 'green';
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag color={color}>
            {role?.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Badge 
          status={status ? "success" : "error"} 
          text={status ? "Active" : "Inactive"} 
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button 
              type="text"
              icon={<EyeOutlined />} 
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete User">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteUser(record)}
              danger
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

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
          <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>User Management</h1>
          <p style={{ color: '#8c8c8c' }}>Manage user accounts and access permissions</p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <Input 
            placeholder="Search users..." 
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddUser}
          >
            Add User
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
            <UserOutlined />
            <span style={{ fontWeight: 500 }}>Users List</span>
            <Tag color="#f0f0f0" style={{ marginLeft: 8 }}>
              {pagination.total} Users
            </Tag>
          </div>
          
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Refresh Data">
              <Button 
                icon={<SyncOutlined />}
                onClick={() => setRefreshKey(prevKey => prevKey + 1)}
              />
            </Tooltip>
            <Tooltip title="Filter">
              <Button icon={<FilterOutlined />} />
            </Tooltip>
            <Tooltip title="Export">
              <Button icon={<ExportOutlined />} />
            </Tooltip>
          </div>
        </div>
        
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
          }}
          onChange={handleTableChange}
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </div>
      
      <UserFormModal
        visible={modalVisible}
        onClose={handleModalClose}
        user={selectedUser}
      />
      
      <DeleteUserModal
        visible={deleteModalVisible}
        onClose={handleDeleteModalClose}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;