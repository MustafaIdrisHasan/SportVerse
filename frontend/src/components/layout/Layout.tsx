import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import ResizableQuickTools from '../ui/ResizableQuickTools';
import useAuthStore from '../../context/authStore';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true, showSidebar = true }) => {
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isSidebarVisible, setIsSidebarVisible] = useState(showSidebar);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  // Hide sidebar on login/register pages or when not authenticated
  useEffect(() => {
    const hideSidebarPaths = ['/login', '/register', '/'];
    const shouldHideSidebar = hideSidebarPaths.includes(location.pathname) || !isAuthenticated;
    setIsSidebarVisible(showSidebar && !shouldHideSidebar);
  }, [location.pathname, isAuthenticated, showSidebar]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-50 via-gray-900 to-dark-100 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Racing stripes */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-f1-500 via-motogp-500 to-lemans-500 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-lemans-500 via-motogp-500 to-f1-500 opacity-60"></div>

        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-f1-500/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-motogp-500/20 to-transparent rounded-full blur-xl animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-lemans-500/20 to-transparent rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-accent-purple/20 to-transparent rounded-full blur-xl animate-bounce-slow"></div>

        {/* Speed lines effect */}
        <div className="absolute inset-0">
          <div className="speed-lines absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-electric/50 to-transparent"></div>
          <div className="speed-lines absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-neon/50 to-transparent" style={{animationDelay: '0.5s'}}></div>
          <div className="speed-lines absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent-pink/50 to-transparent" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {showHeader && <Header />}
        <div className="flex">
          {/* Main Content Area */}
          <main 
            className={`flex-1 transition-all duration-300 ${showHeader ? 'pt-0' : 'pt-16'}`}
            style={{
              marginRight: isSidebarVisible ? `${sidebarWidth}px` : '0',
              minHeight: 'calc(100vh - 64px)'
            }}
          >
            {children}
          </main>
          
          {/* Resizable Quick Tools Sidebar */}
          {isAuthenticated && (
            <ResizableQuickTools
              isVisible={isSidebarVisible}
              onWidthChange={setSidebarWidth}
              defaultWidth={320}
              minWidth={240}
              maxWidth={600}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;