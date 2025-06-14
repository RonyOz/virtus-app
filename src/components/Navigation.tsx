import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageCircle, BarChart3, Calendar, Users } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
}

/**
 * Navigation Component
 * Responsive navigation that shows as bottom tabs on mobile
 * and sidebar on desktop
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
      <nav className="mobile-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Navigation - Sidebar */}
      <nav className="desktop-nav">
        <div className="nav-header">
          <h2>Wellness App</h2>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        /* Mobile Navigation Styles */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-around;
          padding: var(--spacing-2) 0;
          z-index: 1000;
        }

        .mobile-nav .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--spacing-2);
          text-decoration: none;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
          min-width: 60px;
        }

        .mobile-nav .nav-item span {
          font-size: var(--font-size-xs);
          margin-top: var(--spacing-1);
          font-weight: 500;
        }

        .mobile-nav .nav-item.active {
          color: var(--color-primary);
        }

        .mobile-nav .nav-item:hover {
          color: var(--color-primary);
        }

        /* Desktop Navigation Styles */
        .desktop-nav {
          position: fixed;
          top: 0;
          left: 0;
          width: 250px;
          height: 100vh;
          background: var(--bg-primary);
          border-right: 1px solid var(--border-light);
          padding: var(--spacing-6);
          display: none;
          flex-direction: column;
          z-index: 1000;
        }

        .nav-header {
          margin-bottom: var(--spacing-8);
        }

        .nav-header h2 {
          color: var(--color-primary);
          font-size: var(--font-size-xl);
          font-weight: 700;
        }

        .desktop-nav .nav-item {
          display: flex;
          align-items: center;
          padding: var(--spacing-3) var(--spacing-4);
          margin-bottom: var(--spacing-2);
          text-decoration: none;
          color: var(--text-secondary);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .desktop-nav .nav-item span {
          margin-left: var(--spacing-3);
          font-weight: 500;
        }

        .desktop-nav .nav-item.active {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }

        .desktop-nav .nav-item:hover {
          background: var(--color-gray-100);
          color: var(--color-primary);
        }

        /* Show desktop nav on larger screens */
        @media (min-width: 768px) {
          .mobile-nav {
            display: none;
          }
          
          .desktop-nav {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;