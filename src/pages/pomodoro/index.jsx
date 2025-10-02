import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import HeaderComponent from '../../components/header';
import { PomodoroProvider } from '../../context/PomodoroContext';

const PomodoroPage = () => {
  return (
    <PomodoroProvider>
      <div className={`${styles.pomodoroContainer} dark:bg-zinc-900`}>
        <HeaderComponent />
        <Outlet />
      </div>
    </PomodoroProvider>
  );
};

export default PomodoroPage;
