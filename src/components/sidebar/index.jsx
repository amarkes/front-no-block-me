import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import styles from './styles.module.css';
import packageJson from '../../../package.json';
import ThemeToggle from '@/components/theme-toggle';
import { useTheme } from '@/context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    {
      id: 'transactions',
      label: 'Transações',
      icon: '📊',
      path: '/home',
      description: 'Visão geral financeira'
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: '💰',
      description: 'Gestão financeira',
      hasSubmenu: true,
      submenu: [
        {
          id: 'transactions',
          label: 'Transações',
          icon: '📊',
          path: '/financial/transactions',
          description: 'Visão geral financeira'
        }, 
        {
          id: 'categories',
          label: 'Categorias',
          icon: '📂',
          path: '/financial/categories',
          description: 'Gerenciar categorias'
        },
        {
          id: 'reports',
          label: 'Relatórios',
          icon: '📈',
          path: '/financial/reports',
          description: 'Análises e gráficos'
        }
      ]
    },
    {
      id: 'pomodoro',
      label: 'Pomodoro',
      icon: '🍅',
      description: 'Gestão de tempo',
      hasSubmenu: true,
      submenu: [
        {
          id: 'pomodoro-timer',
          label: 'Timer',
          icon: '⏰',
          path: '/pomodoro/timer',
          description: 'Timer Pomodoro'
        },
        {
          id: 'pomodoro-settings',
          label: 'Configurações',
          icon: '⚙️',
          path: '/pomodoro/settings',
          description: 'Configurar tempos'
        }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubmenuActive = (submenuItems) => {
    return submenuItems.some(item => location.pathname === item.path);
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className={styles.overlay}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed} ${isDark ? styles.dark : ''}`}>
        <div className={styles.sidebarContent}>
          {/* Header do Sidebar */}
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>💰</span>
              <span className={styles.logoText}>FinanceApp</span>
            </div>
            <button 
              className={styles.closeButton}
              onClick={onClose}
            >
              ✕
            </button>
          </div>

          {/* Menu Items */}
          <nav className={styles.nav}>
            {menuItems.map((item) => (
              <div key={item.id} className={styles.menuGroup}>
                {item.hasSubmenu ? (
                  <>
                    {/* Menu principal com submenu */}
                    <button
                      onClick={() => toggleSubmenu(item.id)}
                      className={`${styles.menuItem} ${styles.menuItemWithSubmenu} ${
                        isSubmenuActive(item.submenu) ? styles.menuItemActive : ''
                      }`}
                    >
                      <div className={styles.menuItemIcon}>
                        {item.icon}
                      </div>
                      <div className={styles.menuItemContent}>
                        <span className={styles.menuItemLabel}>
                          {item.label}
                        </span>
                        <span className={styles.menuItemDescription}>
                          {item.description}
                        </span>
                      </div>
                      <div className={`${styles.submenuArrow} ${
                        expandedMenus[item.id] ? styles.submenuArrowExpanded : ''
                      }`}>
                        ▼
                      </div>
                    </button>
                    
                    {/* Submenu */}
                    <div className={`${styles.submenu} ${
                      expandedMenus[item.id] ? styles.submenuExpanded : ''
                    }`}>
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.path)}
                          className={`${styles.submenuItem} ${
                            isActive(subItem.path) ? styles.submenuItemActive : ''
                          }`}
                        >
                          <div className={styles.submenuItemIcon}>
                            {subItem.icon}
                          </div>
                          <div className={styles.submenuItemContent}>
                            <span className={styles.submenuItemLabel}>
                              {subItem.label}
                            </span>
                            <span className={styles.submenuItemDescription}>
                              {subItem.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Menu simples */
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`${styles.menuItem} ${
                      isActive(item.path) ? styles.menuItemActive : ''
                    }`}
                  >
                    <div className={styles.menuItemIcon}>
                      {item.icon}
                    </div>
                    <div className={styles.menuItemContent}>
                      <span className={styles.menuItemLabel}>
                        {item.label}
                      </span>
                      <span className={styles.menuItemDescription}>
                        {item.description}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Footer do Sidebar */}
          <div className={styles.sidebarFooter}>
            <div className={styles.footerText}>
              <span className={styles.footerTitle}>FinanceApp</span>
              <span className={styles.footerSubtitle}>v{packageJson.version}</span>
            </div>
            
            {/* Toggle de tema */}
            <div className={styles.themeToggleContainer}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
