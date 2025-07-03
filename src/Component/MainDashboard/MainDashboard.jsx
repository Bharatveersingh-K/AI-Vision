import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Table, Badge, Tag, Progress, 
  Button, Avatar, List, Dropdown, Menu, Tooltip, Typography, 
  Calendar, Divider, Space, Select
} from 'antd';
import { 
  DashboardOutlined, ArrowUpOutlined, ArrowDownOutlined, 
  VideoCameraOutlined, UserOutlined, BellOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  CalendarOutlined, FileTextOutlined, SettingOutlined,
  MoreOutlined, RiseOutlined, FallOutlined, PieChartOutlined,
  BarChartOutlined, LineChartOutlined, AppstoreOutlined,
  MessageOutlined, SyncOutlined, InfoCircleOutlined,
  TeamOutlined, CreditCardOutlined
} from '@ant-design/icons';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, 
  Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, ResponsiveContainer, Cell
} from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

// Static data for charts
const monthlyDataTraffic = [
  { name: 'Jan', cameras: 65, alerts: 28 },
  { name: 'Feb', cameras: 59, alerts: 48 },
  { name: 'Mar', cameras: 80, alerts: 40 },
  { name: 'Apr', cameras: 81, alerts: 37 },
  { name: 'May', cameras: 56, alerts: 50 },
  { name: 'Jun', cameras: 55, alerts: 25 },
  { name: 'Jul', cameras: 40, alerts: 22 },
  { name: 'Aug', cameras: 60, alerts: 30 },
  { name: 'Sep', cameras: 70, alerts: 45 },
  { name: 'Oct', cameras: 90, alerts: 55 },
  { name: 'Nov', cameras: 75, alerts: 38 },
  { name: 'Dec', cameras: 85, alerts: 42 }
];

const dailyActivity = [
  { time: '00:00', value: 10 },
  { time: '03:00', value: 5 },
  { time: '06:00', value: 15 },
  { time: '09:00', value: 40 },
  { time: '12:00', value: 45 },
  { time: '15:00', value: 55 },
  { time: '18:00', value: 75 },
  { time: '21:00', value: 35 },
  { time: '24:00', value: 15 }
];

const userTypes = [
  { name: 'Admin', value: 15 },
  { name: 'Operator', value: 30 },
  { name: 'Viewer', value: 45 },
  { name: 'Guest', value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#722ED1'];

const recentActivity = [
  {
    id: 1,
    user: 'John Smith',
    action: 'Added a new camera',
    target: 'Entrance Camera',
    time: '10 min ago',
    icon: <VideoCameraOutlined style={{ color: '#1890ff' }} />
  },
  {
    id: 2,
    user: 'Emily Johnson',
    action: 'Triggered alert',
    target: 'Motion Detection',
    time: '25 min ago',
    icon: <BellOutlined style={{ color: '#fa8c16' }} />
  },
  {
    id: 3,
    user: 'Michael Brown',
    action: 'Created prompt',
    target: 'Person Detection',
    time: '1 hour ago',
    icon: <FileTextOutlined style={{ color: '#722ed1' }} />
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    action: 'Added user',
    target: 'Robert Davis',
    time: '2 hours ago',
    icon: <UserOutlined style={{ color: '#52c41a' }} />
  },
  {
    id: 5,
    user: 'James Miller',
    action: 'Updated subscription',
    target: 'Premium Plan',
    time: '3 hours ago',
    icon: <CreditCardOutlined style={{ color: '#eb2f96' }} />
  }
];

const activeAlerts = [
  {
    id: 1,
    title: 'Motion Detected',
    camera: 'Front Door Camera',
    time: '2 min ago',
    severity: 'high'
  },
  {
    id: 2,
    title: 'Person Detected',
    camera: 'Backyard Camera',
    time: '15 min ago',
    severity: 'medium'
  },
  {
    id: 3,
    title: 'Camera Offline',
    camera: 'Garage Camera',
    time: '1 hour ago',
    severity: 'low'
  }
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Format severity badge
  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high':
        return <Badge status="error" text={<Text strong style={{ color: '#ff4d4f' }}>High</Text>} />;
      case 'medium':
        return <Badge status="warning" text={<Text strong style={{ color: '#faad14' }}>Medium</Text>} />;
      case 'low':
        return <Badge status="default" text={<Text strong>Low</Text>} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
              <DashboardOutlined style={{ marginRight: 12, color: '#1890ff' }} /> 
              Dashboard
            </Title>
            <Text type="secondary">Welcome back! Here's what's happening with your cameras.</Text>
          </Col>
          <Col>
            <Space>
              <Select 
                defaultValue="week" 
                style={{ width: 120 }}
                onChange={value => setTimeRange(value)}
              >
                <Option value="day">Today</Option>
                <Option value="week">This Week</Option>
                <Option value="month">This Month</Option>
                <Option value="year">This Year</Option>
              </Select>
              <Button 
                icon={<SyncOutlined />} 
                onClick={() => setLoading(true)}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
      
      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>Total Cameras</span>}
              value={24}
              valueStyle={{ color: '#1890ff' }}
              prefix={<VideoCameraOutlined />}
              suffix={
                <Tag color="blue" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 12%
                </Tag>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">+3 from last month</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>Active Users</span>}
              value={136}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 8%
                </Tag>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">+12 from last month</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>Active Prompts</span>}
              value={42}
              valueStyle={{ color: '#722ed1' }}
              prefix={<FileTextOutlined />}
              suffix={
                <Tag color="purple" style={{ marginLeft: 8 }}>
                  <ArrowUpOutlined /> 15%
                </Tag>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">+7 from last month</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} hoverable>
            <Statistic
              title={<span style={{ fontSize: 16, color: '#8c8c8c' }}>Total Alerts</span>}
              value={187}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<BellOutlined />}
              suffix={
                <Tag color="orange" style={{ marginLeft: 8 }}>
                  <ArrowDownOutlined /> 5%
                </Tag>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">-10 from last month</Text>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <LineChartOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <span>Camera & Alert Activity</span>
              </div>
            }
            extra={
              <Space>
                <Tag color="blue">Cameras</Tag>
                <Tag color="orange">Alerts</Tag>
              </Space>
            }
            loading={loading}
          >
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <LineChart
                  data={monthlyDataTraffic}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cameras" 
                    stroke="#1890ff" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="#fa8c16" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <PieChartOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                <span>User Distribution</span>
              </div>
            }
            loading={loading}
          >
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={userTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Second Row of Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BarChartOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                <span>Daily Activity</span>
              </div>
            }
            loading={loading}
          >
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer>
                <AreaChart
                  data={dailyActivity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#52c41a" 
                    fill="rgba(82, 196, 26, 0.2)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AppstoreOutlined style={{ color: '#eb2f96', marginRight: 8 }} />
                <span>Camera Status</span>
              </div>
            }
            loading={loading}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#f9f0ff', textAlign: 'center' }}>
                  <Statistic
                    title="Online"
                    value={21}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                    prefix={<CheckCircleOutlined />}
                  />
                  <Progress percent={87} status="success" showInfo={false} />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#fcfcfc', textAlign: 'center' }}>
                  <Statistic
                    title="Offline"
                    value={3}
                    valueStyle={{ color: '#ff4d4f', fontSize: 24 }}
                    prefix={<ClockCircleOutlined />}
                  />
                  <Progress percent={13} status="exception" showInfo={false} />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false} style={{ background: '#e6f7ff', textAlign: 'center' }}>
                  <Statistic
                    title="Streaming"
                    value={18}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                    prefix={<EyeOutlined />}
                  />
                  <Progress percent={75} status="active" showInfo={false} />
                </Card>
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <Row>
              <Col span={24}>
                <BarChart
                  width={500}
                  height={120}
                  data={[
                    { name: 'Mon', value: 22 },
                    { name: 'Tue', value: 23 },
                    { name: 'Wed', value: 20 },
                    { name: 'Thu', value: 21 },
                    { name: 'Fri', value: 24 },
                    { name: 'Sat', value: 19 },
                    { name: 'Sun', value: 21 }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#1890ff" />
                </BarChart>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      
      {/* Activity and Alerts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <BellOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                <span>Recent Activity</span>
              </div>
            }
            extra={
              <Button type="link" icon={<EyeOutlined />}>
                View All
              </Button>
            }
            loading={loading}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivity}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={item.icon} style={{ backgroundColor: 'transparent' }} />
                    }
                    title={<Text strong>{item.user} {item.action}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{item.target}</Text>
                        <Tag color="default">{item.time}</Tag>
                      </Space>
                    }
                  />
                  <Button type="text" icon={<MoreOutlined />} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                              <BellOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                <span>Active Alerts</span>
              </div>
            }
            extra={
              <Badge count={activeAlerts.length} style={{ backgroundColor: '#ff4d4f' }} />
            }
            loading={loading}
          >
            <List
              itemLayout="horizontal"
              dataSource={activeAlerts}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="text" size="small" icon={<EyeOutlined />}>View</Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>{item.title}</Text>
                        {getSeverityBadge(item.severity)}
                      </div>
                    }
                    description={
                      <div>
                        <Space>
                          <VideoCameraOutlined style={{ color: '#1890ff' }} />
                          <Text>{item.camera}</Text>
                        </Space>
                        <div>
                          <Tag style={{ marginTop: 4 }} icon={<ClockCircleOutlined />} color="default">
                            {item.time}
                          </Tag>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" ghost>
                View All Alerts
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Calendar and Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <span>Calendar</span>
              </div>
            }
            extra={
              <Select defaultValue="events" style={{ width: 120 }}>
                <Option value="events">Events</Option>
                <Option value="alerts">Alerts</Option>
                <Option value="maintenance">Maintenance</Option>
              </Select>
            }
            loading={loading}
          >
            <Calendar 
              fullscreen={false}
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const current = value.format('MMMM YYYY');
                return (
                  <div style={{ padding: '12px 0', textAlign: 'center' }}>
                    <Text strong style={{ fontSize: 16 }}>{current}</Text>
                  </div>
                );
              }}
              dateCellRender={(date) => {
                // Randomly add some events to the calendar
                const day = date.date();
                if ([3, 8, 12, 17, 22, 25].includes(day)) {
                  return (
                    <Badge 
                      count={Math.floor(Math.random() * 3) + 1} 
                      style={{ backgroundColor: '#1890ff' }} 
                    />
                  );
                }
                return null;
              }}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <SettingOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                <span>Quick Actions</span>
              </div>
            }
            loading={loading}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              <Button type="primary" icon={<VideoCameraOutlined />} block>
                Add Camera
              </Button>
              <Button type="primary" icon={<UserOutlined />} block>
                Add User
              </Button>
              <Button type="default" icon={<FileTextOutlined />} block>
                Create Prompt
              </Button>
              <Button type="default" icon={<BellOutlined />} block>
                Alerts
              </Button>
              <Button type="default" icon={<CreditCardOutlined />} block>
                Subscriptions
              </Button>
              <Button type="default" icon={<SettingOutlined />} block>
                Settings
              </Button>
            </div>

            <Divider style={{ margin: '24px 0 16px' }}>
              <Text type="secondary">SYSTEM STATUS</Text>
            </Divider>
            
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>AI Processing</Text>
                <Text type="success" strong>Active</Text>
              </div>
              <Progress percent={92} status="active" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, marginTop: 8 }}>
                <Text>Database</Text>
                <Text type="success" strong>Normal</Text>
              </div>
              <Progress percent={87} status="active" />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, marginTop: 8 }}>
                <Text>Storage Usage</Text>
                <Text type="warning" strong>78%</Text>
              </div>
              <Progress percent={78} status="exception" />
            </Space>
          </Card>
        </Col>
      </Row>
      
      {/* Footer */}
      <div style={{ marginTop: 24, textAlign: 'center', padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
        <Space>
          <Text type="secondary">AI Vision Dashboard v1.0</Text>
          <Divider type="vertical" />
          <Text type="secondary">© 2023 AI Vision. All rights reserved.</Text>
        </Space>
      </div>
    </div>
  );
};

export default Dashboard;