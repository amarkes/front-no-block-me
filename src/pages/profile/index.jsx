import React, { useContext } from 'react';
import styles from './styles.module.css';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/header';
import AuthContext from '../../context/AuthContext';


const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <HeaderComponent />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Card de perfil */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-primary p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Perfil do Usuário
            </h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Nome Completo
                </label>
                <p className="text-gray-800 dark:text-white">
                  {user?.full_name || 'Não informado'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Email
                </label>
                <p className="text-gray-800 dark:text-white">
                  {user?.email || 'Não informado'}
                </p>
              </div>
            </div>
          </div>

          {/* Botão de logout */}
          <div className="text-center">
            <button
              onClick={logout}
              className="bg-primary hover:bg-primary2-hover text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Fazer Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
