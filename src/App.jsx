import { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from "framer-motion";
import LoginPage from '@/pages/login/index';
import RegisterPage from '@/pages/register/index';
import ForgotPasswordPage from '@/pages/forgot/index';
import HomePage from '@/pages/home/index';
import AuthContext, { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AlertDialogProvider } from '@/components/alert/AlertDialogContext';
import Sidebar from './components/sidebar';
import TransactionsPage from './pages/transactions/index';
import TransactionPage from './pages/transactions/transaction/index';
import CategoriesPage from './pages/transactions/categories/index';
import ReportsPage from './pages/transactions/reports/index';
import PomodoroPage from './pages/pomodoro/index';
import PomodoroTimer from './pages/pomodoro/timer/index';
import PomodoroSettings from './pages/pomodoro/settings/index';
import './index.css';

function App() {
  const { user, loading } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
    <div className="flex h-screen">
      {/* Sidebar */}
      {user && (
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Conteúdo principal */}
      <div className={`flex-1 ${user ? 'lg:ml-64' : ''} transition-all duration-300`}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Rotas protegidas */}
            <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
            <Route path="financial" element={<ProtectedRoute element={<TransactionsPage onMenuClick={() => setSidebarOpen(true)} />} />} >
              <Route path="transactions" element={<ProtectedRoute element={<TransactionPage onMenuClick={() => setSidebarOpen(true)} />} />} />
              <Route path="categories" element={<ProtectedRoute element={<CategoriesPage onMenuClick={() => setSidebarOpen(true)} />} />} />
              <Route path="reports" element={<ProtectedRoute element={<ReportsPage onMenuClick={() => setSidebarOpen(true)} />} />} />
            </Route>

            <Route path="pomodoro" element={<ProtectedRoute element={<PomodoroPage />} />} >
              <Route path="timer" element={<ProtectedRoute element={<PomodoroTimer onMenuClick={() => setSidebarOpen(true)} />} />} />
              <Route path="settings" element={<ProtectedRoute element={<PomodoroSettings onMenuClick={() => setSidebarOpen(true)} />} />} />
            </Route>

            {/* Redirecionamento padrão para usuários logados */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

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
      </div>
    </div>
  );
}

export default function RootApp() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          
            <AlertDialogProvider>
              <ToastContainer />
              <App />
            </AlertDialogProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}
