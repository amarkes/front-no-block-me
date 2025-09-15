import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from "framer-motion";
import LoginPage from '@/pages/login/index';
import RegisterPage from '@/pages/register/index';
import ForgotPasswordPage from '@/pages/forgot/index';

import ProfilePage from './pages/profile';


import HomePage from '@/pages/home/index';
import AuthContext, { AuthProvider } from '@/context/AuthContext';
import { AlertDialogProvider } from '@/components/alert/AlertDialogContext';
import './index.css';

function App() {
  const { user, loading } = useContext(AuthContext); // Adiciona o loading

  // Verifica se está carregando os dados do usuário
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          {/* Spinner animado */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
          
          {/* Texto de loading */}
          <div className="text-gray-600 dark:text-gray-300">
            <h2 className="text-xl font-semibold mb-2">Carregando...</h2>
            <p className="text-sm">Verificando sua autenticação</p>
          </div>
          
          {/* Pontos animados */}
          <div className="flex justify-center mt-4 space-x-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ element }) => {
    return !user ? element : <Navigate to="/" replace />;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Rotas protegidas */}

        <Route path="/app" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />


        {/* Rotas públicas */}
        <Route path="/" element={<PublicRoute element={<HomePage />} />}>
          <Route path="login" element={<PublicRoute element={<LoginPage />} />} />
          <Route path="register" element={<PublicRoute element={<RegisterPage />} />} />
          <Route path="forgot-password" element={<PublicRoute element={<ForgotPasswordPage />} />} />
        </Route>


        {/* Rota para capturar qualquer rota inválida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function RootApp() {
  return (
    <Router>
      <AuthProvider>
        <AlertDialogProvider>
          <ToastContainer />
          <App />
        </AlertDialogProvider>,
      </AuthProvider>
    </Router>
  );
}
