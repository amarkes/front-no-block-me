// src/AuthContext.js

import { createContext, useState, useEffect } from 'react';
import api from '../common/utils/axios';
import { toast } from 'react-toastify';
import store from 'store';
import { useNavigate } from 'react-router-dom';

export const UserStore = 'app_user_block';
export const TokenUser = 'app_token_block';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verifica o token e carrega os dados do usuário apenas se ele não estiver logado
  useEffect(() => {
    const token = store.get(TokenUser);

    // Só faz a requisição se o usuário ainda não estiver no estado
    if (token && token?.token && !user) {
      api.get('/auth/me')
        .then(response => {
          setUser(response?.data?.profile);
          navigate('/profile');
        })
        .catch(() => {
          store.remove(TokenUser);
          setUser(null);
          navigate('/login');
        })
        .finally(() => {
          setLoading(false); // Fim do loading após a requisição
        });
    } else {
      setLoading(false); // Caso o usuário já esteja definido, para o loading
    }
  }, []); // Adiciona 'user' como dependência

  const login = async (email, password) => {
    const loginPromise = api.post('/auth/login', {
      email: email,
      password: password,
    });

    toast.promise(loginPromise, {
      pending: 'Fazendo login...',
      success: {
        render({ data }) {
          store.set(TokenUser, { token: data?.data?.access_token });
          setUser(data?.data?.profile);
          navigate('/profile');
          return 'Login realizado com sucesso!';
        },
        autoClose: 3000
      },
      error: {
        render({ data }) {
          const errorMessage = data?.response?.data?.error
            ? data.response.data.error
            : 'Erro ao fazer login: Verifique suas credenciais e tente novamente.';
          return errorMessage;
        },
        autoClose: 10000
      }
    });
  };

  const register = async (email, password, username) => {
    const registerPromise = api.post('/users', {
      email,
      password,
      full_name: username
    });

    toast.promise(registerPromise, {
      pending: 'Criando sua conta...',
      success: {
        render({ data }) {
          if (data?.data?.user) {
            login(email, password);
            return 'Conta criada com sucesso!';
          }
          return 'Erro ao registrar: Verifique suas informações e tente novamente.';
        },
        autoClose: 3000
      },
      error: {
        render({ data }) {
          const errorMessage = data?.response?.data?.error
            ? data?.response?.data?.error
            : 'Erro ao registrar: Verifique suas informações e tente novamente.';
          return errorMessage;
        },
        autoClose: 10000
      }
    });

  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/forgot-password', { email });
      toast.success('Um e-mail de recuperação foi enviado!');
    } catch (error) {
      const errorMessage = error.response?.data?.errors[0]
        ? Object.values(error.response.data.errors[0])[0]
        : 'Erro ao solicitar recuperação de senha. Tente novamente.';
      toast.error(errorMessage);
    }
  };

  const logout = async () => {
    const logoutPromise = api.delete('/auth/logout?scope=global');

    toast.promise(logoutPromise, {
      pending: 'Fazendo logout...',
      success: {
        render() {
          store.clearAll();
          setUser(null);
          navigate('/');
          return 'Logout realizado com sucesso!';
        },
        autoClose: 10000
      },
      error: {
        render() {
          // Mesmo se der erro na API, faz logout local
          store.clearAll();
          setUser(null);
          navigate('/');
          return 'Logout realizado (erro na API)';
        },
        autoClose: 10000
      }
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
