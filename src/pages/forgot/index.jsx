/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState, useContext } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import AuthContext from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import loginImage from '../../assets/forgot.png';
import styles from './styles.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('teste@teste.com');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCardContainer}>
        <div className={styles.loginCard}>
          <h2 className={[styles.loginTitle, `dark:text-white`].join(' ')}>Recuperação de conta</h2>

          <div className={styles.divider}>
            <span className={styles.line}></span>
            <span className={styles.text}>informe seu email</span>
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

            <div className={styles.formFooter}>
              <label className={[styles.remember, `dark:text-white`].join(' ')}>
                caso lembre sua senha
              </label>
              <button onClick={() => navigate('/login')} className={styles.forgotPassword}>voltar para login</button>
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
          <h2 className={styles.illustrationTitle}>É uma pena saber que esqueceu sua senha</h2>
          <p className={styles.illustrationText}>
            Não se preocupe que iremos te ajudar a recupera-la! Insira seu email te que mandaremos um link para recuperar-la
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

export default ForgotPasswordPage;
