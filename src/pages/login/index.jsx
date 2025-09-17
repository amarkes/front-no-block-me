import { useState, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import loginImage from '../../assets/login_home.png';
import styles from './styles.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, remember);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCardContainer}>
        <div className={styles.loginCard}>
          <h2 className={[styles.loginTitle, `dark:text-white`].join(' ')}>Bem-vindo novamente</h2>

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.text}>Faça seu login aqui</span>
            <span className={styles.line}></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={[styles.label, `dark:text-white`].join(' ')}>Email</label>
              <input
                name="email"
                autoComplete="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={[styles.label, `dark:text-white`].join(' ')}>Senha</label>
              <input
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className={styles.input}
              />
            </div>
            <div className={styles.formFooter}>
              <label className={[styles.remember, `dark:text-white`].join(' ')}>
                <input 
                  type="checkbox" 
                  className={styles.checkbox}
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember
              </label>
              <button onClick={() => navigate('/forgot-password')} className={styles.forgotPassword}>Forgot Password</button>
            </div>
            <button
              type="submit"
              className={styles.submitButton}
            >
              Continue
            </button>
          </form>
        </div>

        <div className={styles.loginIllustration}>
          <h2 className={styles.illustrationTitle}>Entre e aproveite ao máximo!</h2>
          <p className={styles.illustrationText}>
            Faça seu login para aproveitar do nosso sistema!
          </p>
          <img
            src={loginImage}
            alt="Illustration"
            className={styles.illustrationImage}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
