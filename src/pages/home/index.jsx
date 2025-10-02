import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';
import HeaderComponent from '../../components/header';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <HeaderComponent />
      <Outlet />
    </div>
  );
};

export default HomePage;
