import React, { useState, useEffect } from 'react';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  BellOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  LogoutOutlined,
 
  ApiOutlined,
  EyeOutlined,
  LockOutlined
} from '@ant-design/icons';
import { useAuth } from "../Authentication/AuthContext";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Badge, Tooltip, Input, Avatar, Dropdown } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import profileLogo from "../assets/headerprofile.jpg";

const SIDEBAR_WIDTH = 240;  // <-- Set to your expanded sidebar width
const SIDEBAR_COLLAPSED_WIDTH = 72; // <-- Set to your collapsed sidebar width

const Header = ({ onToggle, collapsed, isMobile, showMobileSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications] = useState(5);
  
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
     
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown,  ]);

  const handleLogout = () => {
    Cookies.remove('token');
    logout();
    navigate('/');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Error attempting to enable fullscreen:', err.message);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

   

  // Common styles for header buttons
  const headerButtonClass = "flex items-center justify-center h-9 w-9 rounded-full transition-all duration-200 hover:bg-[#e0e7ef]";

  // Notification dropdown items (example colors, match primary theme if desired)
  const notificationItems = [
    {
      key: '1',
      label: 'Camera 1 detected motion',
      time: '2 minutes ago',
      icon: <EyeOutlined style={{ color: '#2563eb' }} />, // primary blue
      read: false
    },
    {
      key: '2',
      label: 'Scheduled task completed',
      time: '1 hour ago',
      icon: <ApiOutlined style={{ color: '#2563eb' }} />, // blue
      read: false
    },
    {
      key: '3',
      label: 'New user registered',
      time: '3 hours ago',
      icon: <UserOutlined style={{ color: '#38bdf8' }} />, // cyan
      read: false
    },
    {
      key: '4',
      label: 'System update available',
      time: 'Yesterday',
      icon: <SettingOutlined style={{ color: '#f59e0b' }} />,
      read: true
    },
    {
      key: '5',
      label: 'License will expire soon',
      time: '2 days ago',
      icon: <LockOutlined style={{ color: '#e11d48' }} />,
      read: true
    }
  ];

  return (
    <header 
      className="fixed right-0 top-0 z-30 transition-all duration-300 ease-in-out"
      style={{
        left: isMobile ? 0 : (collapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`),
        height: "64px",
        background: "linear-gradient(90deg,rgb(65, 118, 231) 0%,rgb(160, 162, 255) 100%)", // MAIN THEME COLOR
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #2563eb",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="flex items-center justify-between h-full px-3 md:px-5">
        {/* Left Section */}
        <div className="flex items-center">
          {/* Toggle Button */}
          <Tooltip 
            title={isMobile ? (showMobileSidebar ? "Close Sidebar" : "Open Sidebar") : (collapsed ? "Expand Sidebar" : "Collapse Sidebar")}
            placement="bottom"
          >
            <button
              onClick={onToggle}
              className={`${headerButtonClass} text-white mr-2`}
              aria-label={isMobile ? (showMobileSidebar ? "Close Sidebar" : "Open Sidebar") : (collapsed ? "Expand Sidebar" : "Collapse Sidebar")}
            >
              {isMobile ? (
                showMobileSidebar ? 
                  <MenuFoldOutlined className="text-lg text-white" /> : 
                  <MenuUnfoldOutlined className="text-lg text-white" />
              ) : (
                collapsed ? 
                  <MenuUnfoldOutlined className="text-lg text-white" /> : 
                  <MenuFoldOutlined className="text-lg text-white" />
              )}
            </button>
          </Tooltip>
          
          {/* Title */}
          <div className="flex items-center">
            <motion.div 
              className="flex items-center space-x-3"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
                           <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#2563eb] to-[#38bdf8] flex items-center justify-center">
                <EyeOutlined className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-white font-bold tracking-wide" style={{ marginLeft: '0.5rem'}}>
                  {isMobile ? "AI Vision" : "AI Vision Monitoring System"}
                </h1>
                {!isMobile && (
                  <div className="text-xs text-[#dbeafe]" style={{ marginLeft:'0.5rem'}}>
                    Intelligence · Security · Analytics
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Section with Action Buttons */}
        <div className="flex items-center space-x-1 md:space-x-2">
        

          {/* Notifications */}
          <Dropdown
            menu={{
              items: notificationItems.map(item => ({
                key: item.key,
                label: (
                  <div className={`flex items-start p-1 ${!item.read ? 'bg-[#dbeafe]' : ''}`}>
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#2563eb] flex items-center justify-center mr-3">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#1e293b]">{item.label}</div>
                      <div className="text-xs text-[#2563eb]">{item.time}</div>
                    </div>
                    {!item.read && (
                      <div className="flex-shrink-0 h-2 w-2 rounded-full bg-[#2563eb]"></div>
                    )}
                  </div>
                )
              })),
              footer: (
                <div className="p-2 text-center border-t border-[#2563eb]">
                  <a className="text-sm text-[#2563eb] hover:text-[#1d4ed8]" href="#">View all notifications</a>
                </div>
              )
            }}
            placement="bottomRight"
            trigger={['click']}
                       overlayClassName="custom-dropdown-overlay"
            overlayStyle={{
              minWidth: '320px',
              background: 'linear-gradient(to bottom, #e0f2fe, #fff)', // Soft blue to white
              border: '1px solid #2563eb',
              borderRadius: '12px',
              overflow: 'hidden',
              padding: '8px 0',
              boxShadow: '0 20px 25px -5px rgba(37,99,235,0.09), 0 10px 10px -5px rgba(37,99,235,0.05)'
            }}
          >
            <button className={`${headerButtonClass} text-[#2563eb] relative`}>
              <Badge count={notifications} size="small" offset={[0, 4]}>
                <BellOutlined className="text-lg" />
              </Badge>
            </button>
          </Dropdown>

          {/* Fullscreen */}
          <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} placement="bottom">
            <button 
              onClick={toggleFullscreen} 
              className={`${headerButtonClass} text-white hidden sm:flex`}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <FullscreenExitOutlined className="text-lg" />
              ) : (
                <FullscreenOutlined className="text-lg" />
              )}
            </button>
          </Tooltip>

        

          {/* User Menu */}
          <div className="relative user-dropdown" style={{marginRight: isMobile ? '5px' : '30px'}}>
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center ml-1 transition-all duration-200"
              aria-expanded={showDropdown}
            >
              <div className="relative" >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 rgba(56, 189, 248, 0)",
                      "0 0 0 2px rgba(37,99,235, 0.3)",
                      "0 0 0 rgba(56, 189, 248, 0)"
                    ] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <Avatar 
                  src={profileLogo}
                  size={36}
                  className="border-2"
                  
                />
              </div>
            </button>
            {/* User Dropdown Menu */}
            <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-64 origin-top-right z-50"
                style={{ 
                  background: 'linear-gradient(to bottom, #e0f2fe, #fff)',
                   
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(37,99,235,0.09), 0 10px 10px -5px rgba(37,99,235,0.06)'
                }}
              >
               
                
              <div style={{ 
  padding: "12px 8px", 
  backgroundColor: "white", 
  borderRadius: "8px", 
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)" 
}}>
  <button 
    style={{ 
      width: "100%", 
      textAlign: "left", 
      padding: "12px 20px", 
      margin: "4px 0", 
      fontSize: "0.875rem", 
      color: "#374151", 
      borderRadius: "6px", 
      transition: "all 0.3s ease-in-out", 
      display: "flex", 
      alignItems: "center", 
      border: "none", 
      backgroundColor: "transparent", 
      cursor: "pointer" 
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#f9fafb";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <UserOutlined style={{ marginRight: "12px", color: "#3b82f6", fontSize: "16px" }} /> 
    <span style={{ fontWeight: "500" }}>My Profile</span>
  </button>
  
  <button 
    style={{ 
      width: "100%", 
      textAlign: "left", 
      padding: "12px 20px", 
      margin: "4px 0", 
      fontSize: "0.875rem", 
      color: "#374151", 
      borderRadius: "6px", 
      transition: "all 0.3s ease-in-out", 
      display: "flex", 
      alignItems: "center", 
      border: "none", 
      backgroundColor: "transparent", 
      cursor: "pointer" 
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#f9fafb";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <SettingOutlined style={{ marginRight: "12px", color: "#3b82f6", fontSize: "16px" }} /> 
    <span style={{ fontWeight: "500" }}>Account Settings</span>
  </button>
  
  <div style={{ 
    borderTop: "1px solid #f3f4f6", 
    margin: "8px 0" 
  }}></div>
  
  <button 
    onClick={handleLogout} 
    style={{ 
      width: "100%", 
      textAlign: "left", 
      padding: "12px 20px", 
      margin: "4px 0", 
      fontSize: "0.875rem", 
      color: "#374151", 
      borderRadius: "6px", 
      transition: "all 0.3s ease-in-out", 
      display: "flex", 
      alignItems: "center", 
      border: "none", 
      backgroundColor: "transparent", 
      cursor: "pointer" 
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = "#FEF2F2";
      e.currentTarget.style.color = "#EF4444";
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#374151";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <LogoutOutlined style={{ marginRight: "12px", color: "#6B7280", fontSize: "16px" }} /> 
    <span style={{ fontWeight: "500" }}>Logout</span>
  </button>
</div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Global styles for dropdowns */}
      <style jsx global>{`
        .custom-dropdown-overlay .ant-dropdown-menu {
          background: transparent !important;
          box-shadow: none !important;
        }

        .custom-dropdown-overlay .ant-dropdown-menu-item {
          padding: 8px 12px !important;
          margin: 2px 8px !important;
          border-radius: 8px !important;
          color: #1e293b !important;
          transition: all 0.2s !important;
        }

        .custom-dropdown-overlay .ant-dropdown-menu-item:hover {
          background: #dbeafe !important;
          color: #2563eb !important;
        }
      `}</style>
    </header>
  );
};

export default Header;