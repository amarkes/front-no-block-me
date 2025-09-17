import  { useContext, useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import MenuComponent from '@/components/menu/index';
import UserAvatar from '@/components/user-avatar/index';
import AuthContext from '@/context/AuthContext';


const HeaderComponent = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Verifica se está em dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Observa mudanças na classe dark
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.headerWrapper} ${isDarkMode ? styles.dark : ''}`}>
      <header className={styles.headerContainer}>
        {user && (
          <button
            onClick={onMenuClick}
            className={styles.menuButton}
          >
            ☰
          </button>
        )}
        <div
          tabIndex={0}
          onClick={() => navigate('/')}
          className={`${styles.logo} ${isDarkMode ? styles.dark : ''}`}
        >
          LOGO HERE
        </div>
        <div className={styles.headerButtons}>
          {user ? (
            // Usuário logado - mostra avatar e nome
            <div className={styles.headerButtons2}>
              <UserAvatar user={user} />
            </div>
          ) : (
            // Usuário não logado - mostra botões de login e registro
            <div className={styles.headerButtons2}>
              <button
                className={[styles.headerSignButtons, styles.headerSignInButtons].join(' ')}
                tabIndex={2}
                onClick={() => navigate('/login')}
              >
                LOGIN
              </button>
              <button
                className={[styles.headerSignButtons, styles.headerSignUpButtons].join(' ')}
                tabIndex={3}
                onClick={() => navigate('/register')}
              >
                REGISTRAR
              </button>
            </div>
          )}
          <div className={styles.headerDivider} />
          <MenuComponent />
        </div>
      </header>
    </div>
  );
};

export default HeaderComponent;
