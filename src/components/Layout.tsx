import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout Component
 * Modern mobile-first layout with smooth animations
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation currentPath={location.pathname} />
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="pb-20 md:pb-0 md:ml-64"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;