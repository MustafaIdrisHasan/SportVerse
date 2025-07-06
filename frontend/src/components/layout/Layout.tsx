import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showHeader = true }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showHeader && <Header />}
      <main className={showHeader ? 'pt-0' : 'pt-16'}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 