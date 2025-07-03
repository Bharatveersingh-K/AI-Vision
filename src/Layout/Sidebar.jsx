import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, Badge } from "antd";
import Cookies from "js-cookie";
import { useAuth } from "../Authentication/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DashboardOutlined,
  LineChartOutlined,
  HistoryOutlined,
  VideoCameraOutlined,
  CommentOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  CreditCardOutlined,
  ScheduleOutlined,
  DatabaseOutlined,
  MenuOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import Logo from "../assets/3879707.png";

const { Sider } = Layout;

// ====== Sidebar constants ======
const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 72;
const ICON_SIZE = 20;

// ====== Icon Helper (subtle only when active) ======
const GlowIcon = ({ icon: Icon, glowColor = "#2563eb", isActive = false }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
    {isActive && (
      <div
        style={{
          position: 'absolute',
          inset: -1,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor}26 0%, ${glowColor}00 80%)`,
          filter: `blur(2px)`,
          zIndex: 0
        }}
      />
    )}
    <Icon
      style={{
        fontSize: ICON_SIZE,
        color: isActive ? glowColor : "#64748b",
        zIndex: 1,
        marginRight: 0
      }}
    />
  </div>
);

// ====== Menu Label helper ======
const MenuLabel = ({ children, isCollapsed }) => {
  if (isCollapsed) return null;
  return (
    <span
      style={{
        color: "#1e293b",
        marginLeft: 13,
        fontSize: 15,
        fontWeight: 500,
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </span>
  );
};

// ====== Sidebar Component ======
const Sidebar = ({ collapsed, isMobile, visible }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    logout();
    navigate('/');
  };

  // Collapse logic unchanged
  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }
    const path = location.pathname.split('/')[1];
    if (!path) return;
    const pathToParentMap = {
      'cameras': 'camera-management',
      'user-cameras': 'camera-management',
      'camera-monitor': 'camera-management',
      'prompts': 'prompt-management',
      'camera-prompts': 'prompt-management',
      'user-prompts': 'prompt-management',
      'create-prompt': 'prompt-management',
      'users': 'user-management',
      'clients': 'user-management',
      'roles': 'user-management',
      'plans': 'subscription',
      'user-subscriptions': 'subscription',
      'transactions': 'subscription',
      'media-types': 'static-data',
      'notification-types': 'static-data',
      'address-types': 'static-data',
      'state-city': 'static-data',
      'api-actions': 'static-data',
    };
    const parentKey = pathToParentMap[path];
    if (parentKey && !openKeys.includes(parentKey)) {
      setOpenKeys(prev => [...prev, parentKey]);
    }
  }, [location.pathname, collapsed]);

  const handleOpenChange = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const getSelectedKey = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    return [path];
  };

  // Menu definition with explicit icon and label gaps
  const accent = "#2563eb";
  const accent2 = "#0ea5e9";
  const accent3 = "#10b981";

  const menuItems = [
    {
      key: 'dashboard',
      icon: <GlowIcon icon={DashboardOutlined} glowColor={accent} isActive={location.pathname === '/dashboard'} />,
      label: <MenuLabel isCollapsed={collapsed}><Link to="/dashboard">Dashboard</Link></MenuLabel>,
    },
    {
      key: 'analytics',
      icon: <GlowIcon icon={LineChartOutlined} glowColor={accent2} isActive={location.pathname === '/analytics'} />,
      label: <MenuLabel isCollapsed={collapsed}><Link to="/analytics">Analytics</Link></MenuLabel>
    },
    {
      key: 'activity-logs',
      icon: <GlowIcon icon={HistoryOutlined} glowColor="#fb7185" isActive={location.pathname === '/activity-logs'} />,
      label: <MenuLabel isCollapsed={collapsed}><Link to="/activity-logs">Activity Logs</Link></MenuLabel>
    },
    { type: 'divider', style: { margin: '8px 0', borderColor: '#e2e8f0' } },
    {
      key: 'camera-management',
      icon: <GlowIcon icon={VideoCameraOutlined} glowColor={accent3} isActive={openKeys.includes('camera-management')} />,
      label: <MenuLabel isCollapsed={collapsed}>Cameras</MenuLabel>,
      children: [
        { key: 'cameras', label: <Link to="/cameras">All Cameras</Link> },
        { key: 'user-cameras', label: <Link to="/user-cameras">User Cameras</Link> },
        {
          key: 'camera-monitor', label: <Link to="/camera-monitor">Live Monitor</Link>,
          icon: <Badge status="processing" color={accent3} style={{ marginRight: 8 }} />
        },
      ]
    },
    {
      key: 'prompt-management',
      icon: <GlowIcon icon={CommentOutlined} glowColor="#f59e0b" isActive={openKeys.includes('prompt-management')} />,
      label: <MenuLabel isCollapsed={collapsed}>Prompts</MenuLabel>,
      children: [
        { key: 'prompts', label: <Link to="/prompts">All Prompts</Link> },
        { key: 'camera-prompts', label: <Link to="/camera-prompts">Camera Prompts</Link> },
        {
          key: 'create-prompt',
          label: <span style={{ color: "#f59e0b", fontWeight: 500 }}><PlusCircleOutlined /> Create Prompt</span>
        },
      ]
    },
    {
      key: 'user-management',
      icon: <GlowIcon icon={UserOutlined} glowColor="#a78bfa" isActive={openKeys.includes('user-management')} />,
      label: <MenuLabel isCollapsed={collapsed}>Users</MenuLabel>,
      children: [
        { key: 'users', label: <Link to="/users">All Users</Link> },
        { key: 'clients', label: <Link to="/clients">Clients</Link> },
        { key: 'roles', label: <Link to="/roles">Roles</Link> },
      ]
    },
    {
      key: 'notifications',
      icon: <GlowIcon icon={BellOutlined} glowColor="#db2777" isActive={location.pathname === '/notifications'} />,
      label: <MenuLabel isCollapsed={collapsed}>Notifications</MenuLabel>
    },
    {
      key: 'subscription',
      icon: <GlowIcon icon={CreditCardOutlined} glowColor="#0ea5e9" isActive={openKeys.includes('subscription')} />,
      label: <MenuLabel isCollapsed={collapsed}>Subscriptions</MenuLabel>,
      children: [
        { key: 'plans', label: <Link to="/plans">Plans</Link> },
        { key: 'transactions', label: <Link to="/transactions">Transactions</Link> }
      ]
    },
    {
      key: 'cronjobs',
      icon: <GlowIcon icon={ScheduleOutlined} glowColor={accent2} isActive={location.pathname === '/cronjobs'} />,
      label: <MenuLabel isCollapsed={collapsed}>Scheduled Tasks</MenuLabel>
    },
    {
      key: 'static-data',
      icon: <GlowIcon icon={DatabaseOutlined} glowColor={accent3} isActive={openKeys.includes('static-data')} />,
      label: <MenuLabel isCollapsed={collapsed}>Data Manager</MenuLabel>,
      children: [
        { key: 'media-types', label: <Link to="/media-types">Media Types</Link> },
        { key: 'notification-types', label: <Link to="/notification-types">Notification Types</Link> },
        { key: 'state-city', label: <Link to="/state-city">Locations</Link> },
        { key: 'api-actions', label: <Link to="/api-actions">API Actions</Link> }
      ]
    },
    {
      key: 'menu-management',
      icon: <GlowIcon icon={MenuOutlined} glowColor="#a21caf" isActive={location.pathname === '/menu-management'} />,
      label: <MenuLabel isCollapsed={collapsed}>Menu Manager</MenuLabel>
    },
    {
      key: 'settings',
      icon: <GlowIcon icon={SettingOutlined} glowColor="#64748b" isActive={location.pathname === '/settings'} />,
      label: <MenuLabel isCollapsed={collapsed}>Settings</MenuLabel>
    },
    { type: 'divider', style: { margin: '8px 0', borderColor: '#e2e8f0' } },
    {
      key: 'logout',
      icon: <GlowIcon icon={LogoutOutlined} glowColor="#ef4444" isActive={location.pathname === '/logout'} />,
      label: <MenuLabel isCollapsed={collapsed}>Logout</MenuLabel>,
      onClick: handleLogout
    }
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={SIDEBAR_WIDTH}
      collapsedWidth={SIDEBAR_COLLAPSED_WIDTH}
      style={{
        position: 'fixed',
        top: 0,
        left: isMobile ? (visible ? 0 : '-100%') : 0,
        bottom: 0,
        zIndex: isMobile ? 50 : 10,
        height: "100vh",
        background: "#f8fafc",
        borderRight: "1px solid #e3e7ef",
        boxShadow: isMobile ? "0 0 15px rgba(0,0,0,0.1)" : "none",
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        display: "flex",
        flexDirection: "column"
      }}
      className="ai-vision-sidebar-light"
    >
      {/* Logo/Header Section */}
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: collapsed ? 12 : 24,
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
          gap: collapsed ? 0 : 14,
          cursor: 'pointer',
          flexShrink: 0 // Prevent logo from shrinking
        }}
        onClick={() => { window.location.href = '/dashboard'; }}
      >
        <img
          src={Logo}
          alt="AI Vision Logo"
          style={{
            height: 36,
            width: 36,
            borderRadius: 8,
            marginRight: collapsed ? 0 : 10,
            border: '2px solid #dbeafe'
          }}
        />
        {!collapsed && (
          <span
            style={{
              color: '#2563eb',
              fontWeight: 'bold',
              fontSize: 18,
              letterSpacing: '.5px'
            }}
          >
            AI Vision
          </span>
        )}
      </div>

      {/* Menu Section with enhanced scrolling for mobile */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: "10px 0 10px 0",
          height: isMobile ? "calc(100vh - 64px)" : "auto", // Ensure full height on mobile
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
        }}
        className="custom-scrollbar mobile-menu-scroll"
      >
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={getSelectedKey()}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          style={{
            background: 'transparent',
            borderRight: 'none',
            paddingLeft: collapsed ? 0 : 4,
            paddingRight: 6,
            fontSize: 15
          }}
          items={menuItems}
        />
      </div>

      {/* Scrollbar style for modern, unobtrusive look */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e9f5;
          border-radius: 4px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e9f5 transparent;
        }
        
        /* Special mobile scrolling enhancements */
        @media (max-width: 768px) {
          .mobile-menu-scroll {
            -webkit-overflow-scrolling: touch;
            padding-bottom: 50px; /* Extra padding at bottom for better scrolling */
          }
          .mobile-menu-scroll::-webkit-scrollbar {
            width: 2px; /* Thinner scrollbar on mobile */
          }
        }
        
        .ai-vision-sidebar-light .ant-menu {
          background: transparent;
        }
        .ai-vision-sidebar-light .ant-menu-item,
        .ai-vision-sidebar-light .ant-menu-submenu-title {
          padding-left: 16px !important;
          padding-right: 9px !important;
          display: flex;
          align-items: center;
          font-size: 15px;
          color: #1e293b;
          min-height: 44px;
          border-radius: 8px;
          margin: 3px 0;
        }
        .ai-vision-sidebar-light .ant-menu-item-selected {
          background: linear-gradient(90deg, #dbeafe 40%, #f1f5fa 100%) !important;
          border-left: 3px solid #2563eb;
          color: #2563eb !important;
        }
        .ai-vision-sidebar-light .ant-menu-item:hover,
        .ai-vision-sidebar-light .ant-menu-submenu-title:hover {
          background: #f1f5fa !important;
          color: #2563eb !important;
        }
        .ai-vision-sidebar-light .ant-menu-sub {
          background: #f8fafc !important;
          border-radius: 8px;
        }
      `}</style>
    </Sider>
  );
};

Sidebar.defaultProps = {
  collapsed: false,
  isMobile: false,
  visible: true
};

export default Sidebar;