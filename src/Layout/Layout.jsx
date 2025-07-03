import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_WIDTH_COLLAPSED = 80;

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(false);
        setShowMobileSidebar(false);
      } else if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };
    window.addEventListener('resize', checkMobile);
    checkMobile();
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isMobile) setShowMobileSidebar(!showMobileSidebar);
    else setCollapsed(!collapsed);
  };
  const closeOverlay = () => { if (isMobile) setShowMobileSidebar(false); };

  // Match the widths!
  const sidebarWidth = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <div
          style={{
            width: sidebarWidth,
            background: "#f0f6fc",
            borderRight: '1px solid #e3e7ef',
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            zIndex: 10,
            transition: 'width 0.3s cubic-bezier(.4,0,.2,1)'
          }}
        >
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isMobile={false}
            visible={true}
          />
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0"
          style={{
            background: 'rgba(0,0,0,0.07)',
            zIndex: 40,
            backdropFilter: "blur(2px)"
          }}
          onClick={closeOverlay}
        />
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <div
          style={{
            width: '85%',
            maxWidth: 300,
            background: "#f0f6fc",
            borderRight: '1px solid #e3e7ef',
            position: 'fixed',
            top: 0, left: showMobileSidebar ? 0 : "-100%",
            height: '100vh',
            zIndex: 50,
            transition: 'left 0.3s cubic-bezier(.4,0,.2,1)'
          }}
        >
          <Sidebar
            collapsed={false}
            setCollapsed={() => {}}
            isMobile={true}
            visible={showMobileSidebar}
          />
        </div>
      )}

      <div
        style={{
          flex: 1,
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)'
        }}
      >
        <Header
          collapsed={collapsed}
          isMobile={isMobile}
          showMobileSidebar={showMobileSidebar}
          onToggle={handleToggle}
        />
        <main
          style={{
            marginTop: 64, // Header height
            minHeight: 'calc(100vh - 64px)',
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f8fa 0%, #eaf2fb 100%)'
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              minHeight: "100%",
              boxShadow: "0 2px 12px 0 rgba(30, 64, 175, 0.06)",
              padding: 16
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;