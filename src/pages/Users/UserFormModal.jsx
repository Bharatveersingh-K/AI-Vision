import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Row,
  Col,
  Divider,
  message,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  MobileOutlined,
  LockOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  SaveOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../api/axiosConfig";

const { Option } = Select;

const UserFormModal = ({ visible, onClose, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [formTouched, setFormTouched] = useState(false);
  const isEditMode = !!user;
  const isViewOnly = user?.viewOnly;

  const puid = Cookies.get("id") || 0;

  useEffect(() => {
    if (visible) {
      fetchRoles();
      fetchAddressTypes();
      fetchStateCity();
      setFormTouched(false);

      if (isEditMode) {
        form.setFieldsValue({
          id: user?.id,
          name: user?.name,
          email: user?.email,
          mobile: user?.mobile,
          userName: user?.userName,
          password: "",
          role: user?.role,
          address: user?.address,
          landmark: user?.landmark,
          street: user?.street,
          city: user?.city,
          state: user?.state,
          pinCode: user?.pinCode,
          addressType: user?.addressType,
          status: user?.status,
        });

        setSelectedState(user?.state);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: true,
        });
      }
    }
  }, [visible, user, form]);

  useEffect(() => {
    if (selectedState) {
      filterCitiesByState(selectedState);
    }
  }, [selectedState, states]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${API_URL}/StaticData/roles`);
      setRoles(response.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchAddressTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/StaticData/address-types`);
      setAddressTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching address types:", error);
    }
  };

  const fetchStateCity = async () => {
    try {
      const response = await axios.get(`${API_URL}/StaticData/state-city`);
      setStates(response.data || []);
    } catch (error) {
      console.error("Error fetching states and cities:", error);
    }
  };

  const filterCitiesByState = (stateName) => {
    const stateData = states.find((state) => state.state === stateName);
    setCities(stateData?.cities || []);
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    form.setFieldsValue({ city: undefined });
  };

  const handleFormChange = () => {
    setFormTouched(true);
  };

  const handleClose = () => {
    if (formTouched && !isViewOnly) {
      Modal.confirm({
        title: "Discard changes?",
        content: "You have unsaved changes. Are you sure you want to discard them?",
        okText: "Yes, discard",
        cancelText: "No, continue editing",
        onOk: () => onClose(),
      });
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const params = {
        ...values,
        PUID: puid,
        Slug: window.location.pathname,
        CrudAction: isEditMode ? "EDIT" : "ADD",
      };

      await axios.post(`${API_URL}/User/manage`, null, { params });

      message.success(`User ${isEditMode ? "updated" : "created"} successfully`);
      onClose(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} user`
      );
    } finally {
      setLoading(false);
    }
  };

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <UserOutlined style={{ fontSize: 20, marginRight: 8, color: '#1890ff' }} />
      <span>
        {isViewOnly ? "User Details" : isEditMode ? "Edit User" : "Add New User"}
      </span>
    </div>
  );

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={900}
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
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>

            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter the full name" },
              ]}
              tooltip={{ title: "User's full name as it will appear in the system", icon: <InfoCircleOutlined /> }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter full name"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="userName"
              label="Username"
              rules={[
                { required: true, message: "Please enter a username" },
              ]}
              tooltip={{ title: "Unique username for login", icon: <InfoCircleOutlined /> }}
            >
              <Input
                prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter username"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter an email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
              tooltip={{ title: "Email address for account notifications", icon: <InfoCircleOutlined /> }}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter email"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="mobile"
              label="Mobile Number"
              rules={[
                { required: true, message: "Please enter a mobile number" },
                {
                  pattern: /^[+]?[0-9]{10,15}$/,
                  message: "Please enter a valid mobile number",
                },
              ]}
              tooltip={{ title: "Mobile number with country code", icon: <InfoCircleOutlined /> }}
            >
              <Input
                prefix={<MobileOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter mobile number"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="password"
              label={isEditMode ? "New Password" : "Password"}
              rules={[
                {
                  required: !isEditMode,
                  message: "Please enter a password",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters",
                },
              ]}
              tooltip={{ title: isEditMode ? "Leave blank to keep current password" : "Minimum 6 characters required", icon: <InfoCircleOutlined /> }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                 placeholder={
                  isEditMode
                    ? "Enter new password (optional)"
                    : "Enter password"
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select a role" }]}
              tooltip={{ title: "Access level for this user", icon: <InfoCircleOutlined /> }}
            >
              <Select
                placeholder="Select role"
                loading={roles.length === 0}
                suffixIcon={<DesktopOutlined style={{ color: '#bfbfbf' }} />}
              >
                {roles.map((role) => (
                  <Option key={role} value={role}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{ 
                          display: 'inline-block', 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          marginRight: 8,
                          background: role === "ADMIN" ? '#1890ff' : role === "MASTER" ? '#722ed1' : '#52c41a'
                        }}
                      ></span>
                      {role}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" style={{ marginTop: 24, marginBottom: 24 }}>
          <span style={{ color: '#1890ff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
            <EnvironmentOutlined style={{ marginRight: 8 }} /> Address Information
          </span>
        </Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input
                prefix={<HomeOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter address"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="landmark"
              label="Landmark"
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter landmark"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="street"
              label="Street"
            >
              <Input placeholder="Enter street" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="addressType"
              label="Address Type"
            >
              <Select
                placeholder="Select address type"
                loading={addressTypes.length === 0}
                suffixIcon={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
              >
                {addressTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={8}>
            <Form.Item
              name="state"
              label="State"
            >
              <Select
                placeholder="Select state"
                onChange={handleStateChange}
                loading={states.length === 0}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                suffixIcon={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
              >
                {states.map((state) => (
                  <Option key={state.state} value={state.state}>
                    {state.state}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="city"
              label="City"
            >
              <Select
                placeholder={selectedState ? "Select city" : "Select state first"}
                disabled={!selectedState}
                loading={selectedState && cities.length === 0}
                showSearch
                optionFilterProp="children"
                suffixIcon={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
              >
                {cities.map((city) => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="pinCode"
              label="PIN Code"
              rules={[
                {
                  pattern: /^[0-9]{5,6}$/,
                  message: "Please enter a valid PIN code",
                },
              ]}
            >
              <Input placeholder="Enter PIN code" />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <Form.Item
              name="status"
              label="Account Status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          marginTop: 24, 
          paddingTop: 16, 
          borderTop: '1px solid #f0f0f0',
          gap: 12
        }}>
          <Button
            onClick={handleClose}
            icon={<CloseOutlined />}
          >
            {isViewOnly ? "Close" : "Cancel"}
          </Button>

          {!isViewOnly && (
            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? "Update" : "Create"} User
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default UserFormModal;