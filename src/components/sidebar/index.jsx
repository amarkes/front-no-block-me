import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import packageJson from '../../../package.json';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/home',
      description: 'Visão geral financeira'
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: '📂',
      path: '/categories',
      description: 'Gerenciar categorias'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: '📈',
      path: '/reports',
      description: 'Análises e gráficos'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
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
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
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
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`${styles.menuItem} group ${
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
            ))}
          </nav>

          {/* Footer do Sidebar */}
          <div className={styles.sidebarFooter}>
            <div className={styles.footerText}>
              <span className={styles.footerTitle}>FinanceApp</span>
              <span className={styles.footerSubtitle}>v{packageJson.version}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
