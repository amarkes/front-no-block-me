import { useState, useContext } from "react";
import AuthContext from "@/context/AuthContext";
import ThemeToggle from "@/components/theme-toggle";
import { useTheme } from "@/context/ThemeContext";
import styles from './styles.module.css';

const MenuComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const { isDark } = useTheme();

    return (
        <div className={styles.menuContainer}>
            {/* Botão de menu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.menuButton}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className={styles.menuIcon}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                </svg>
            </button>

            {/* Menu Dropdown */}
            {isOpen && (
                <div className={`${styles.menuDropdown} ${isDark ? styles.dark : ''}`}>
                    <div className={styles.menuContent}>
                        <h3 className={`${styles.menuTitle} ${isDark ? styles.dark : ''}`}>
                            Configurações
                        </h3>
                        
                        {/* Toggle de tema */}
                        <div className={styles.themeContainer}>
                            <span className={`${styles.themeLabel} ${isDark ? styles.dark : ''}`}>Tema</span>
                            <ThemeToggle />
                        </div>
                        
                        {/* Botão de logout se usuário estiver logado */}
                        {user && (
                            <>
                                <div className={`${styles.divider} ${isDark ? styles.dark : ''}`} />
                                <button
                                    onClick={logout}
                                    className={styles.logoutButton}
                                >
                                    Sair
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuComponent;
