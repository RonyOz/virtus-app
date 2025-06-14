import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component
 * Provides the main layout structure with navigation
 * Responsive design that adapts to mobile and desktop
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="app">
      <Navigation currentPath={location.pathname} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;