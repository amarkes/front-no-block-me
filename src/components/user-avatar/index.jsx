import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const UserAvatar = ({ user }) => {
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

  if (!user) return null;

  // Gera as iniciais do usuário
  const getInitials = () => {
    const name = user.nickname || user.full_name || user.email;
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtém o nome de exibição
  const getDisplayName = () => {
    return user.nickname || user.full_name?.split(' ')[0] || user.email;
  };

  return (
    <div className={styles.userContainer}>
      {/* Avatar */}
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Avatar"
          className={styles.avatarImage}
        />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {getInitials()}
        </div>
      )}
      
      {/* Nome */}
      <span className={`${styles.displayName} ${isDarkMode ? styles.dark : ''}`}>
        {getDisplayName()}
      </span>
    </div>
  );
};

export default UserAvatar;
