import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageCircle, BarChart3, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavigationProps {
  currentPath: string;
}

/**
 * Navigation Component
 * Modern mobile-first navigation with glass morphism
 */
const Navigation: React.FC<NavigationProps> = ({ currentPath }) => {
  const navItems = [
    {
      path: '/',
      label: 'Inicio',
      icon: Home,
    },
    {
      path: '/chatbot',
      label: 'Chat',
      icon: MessageCircle,
    },
    {
      path: '/dashboard',
      label: 'Bienestar',
      icon: BarChart3,
    },
    {
      path: '/calendar',
      label: 'Calendario',
      icon: Calendar,
    },
    {
      path: '/community',
      label: 'Comunidad',
      icon: Users,
    },
  ];

  return (
    <>
      {/* Mobile Navigation - Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 px-4 py-2 safe-area-bottom">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200"
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`relative z-10 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`relative z-10 text-xs font-medium mt-1 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Desktop Navigation - Sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 z-50">
        <div className="flex flex-col w-full p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold gradient-text">Virtus</h2>
            <p className="text-sm text-gray-600 mt-1">Bienestar Universitario</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 hover:bg-gray-100/50"
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-tab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon 
                    size={20} 
                    className={`relative z-10 mr-3 ${isActive ? 'text-white' : 'text-gray-600'}`}
                  />
                  <span className={`relative z-10 font-medium ${
                    isActive ? 'text-white' : 'text-gray-700'
                  }`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;