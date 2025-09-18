import { useContext } from 'react';
import styles from './styles.module.css';
import { useNavigate } from 'react-router-dom';
import MenuComponent from '@/components/menu/index';
import UserAvatar from '@/components/user-avatar/index';
import AuthContext from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const HeaderComponent = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();

  return (
    <div className={`${styles.headerWrapper} ${isDark ? styles.dark : ''}`}>
      <header className={styles.headerContainer}>
        {user && (
          <button
            onClick={onMenuClick}
            className={`${styles.menuButton} ${isDark ? styles.dark : ''}`}
          >
            ☰
          </button>
        )}
        <div
          tabIndex={0}
          onClick={() => navigate('/')}
          className={`${styles.logo} ${isDark ? styles.dark : ''}`}
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
