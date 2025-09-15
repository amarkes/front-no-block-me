import { useState, useContext, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import AuthContext from "@/context/AuthContext";
import styles from './styles.module.css';


const MenuComponent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user, logout } = useContext(AuthContext);

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

    // Alternar o tema
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark", !isDarkMode); // Tailwind dark mode
    };

    return (
        <div className={styles.menuContainer}>
            {/* Botão de menu */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.menuButton} ${isDarkMode ? styles.dark : ''}`}
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
                <div className={`${styles.menuDropdown} ${isDarkMode ? styles.dark : ''}`}>
                    <div className={styles.menuContent}>
                        <h3 className={`${styles.menuTitle} ${isDarkMode ? styles.dark : ''}`}>
                            Theme Mode
                        </h3>
                        <div className={styles.themeContainer}>
                            <span className={`${styles.themeLabel} ${isDarkMode ? styles.dark : ''}`}>Light</span>
                            <label className={styles.themeSwitchContainer}>
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={toggleTheme}
                                />
                            </label>
                            <span className={`${styles.themeLabel} ${isDarkMode ? styles.dark : ''}`}>Dark</span>
                        </div>
                        
                        {/* Botão de logout se usuário estiver logado */}
                        {user && (
                            <>
                                <div className={`${styles.divider} ${isDarkMode ? styles.dark : ''}`} />
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
