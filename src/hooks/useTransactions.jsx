import { useState, useEffect, useCallback } from 'react';
import { transactionService, categoryService } from '../services/transactions';
import { toast } from 'react-toastify';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  // Carregar categorias
  const loadCategories = useCallback(async () => {
    try {
      const response = await categoryService.getCategories();
      
      if (response.success) {
        setCategories(response.data);
        
        // Se não há categorias, cria as padrão
        if (response.data.length === 0) {
          // Categorias padrão definidas inline para evitar dependências
          const defaultCategories = [
            // Receitas
            { name: 'Salário', type: 'income', color: '#10B981', icon: '💼' },
            { name: 'Freelance', type: 'income', color: '#3B82F6', icon: '💻' },
            { name: 'Investimentos', type: 'income', color: '#8B5CF6', icon: '📈' },
            { name: 'Vendas', type: 'income', color: '#F59E0B', icon: '🛒' },
            { name: 'Outros', type: 'income', color: '#6B7280', icon: '💰' },
            
            // Despesas
            { name: 'Alimentação', type: 'expense', color: '#EF4444', icon: '🍽️' },
            { name: 'Transporte', type: 'expense', color: '#F97316', icon: '🚗' },
            { name: 'Moradia', type: 'expense', color: '#84CC16', icon: '🏠' },
            { name: 'Saúde', type: 'expense', color: '#EC4899', icon: '🏥' },
            { name: 'Educação', type: 'expense', color: '#06B6D4', icon: '📚' },
            { name: 'Lazer', type: 'expense', color: '#8B5CF6', icon: '🎮' },
            { name: 'Outros', type: 'expense', color: '#6B7280', icon: '💸' }
          ];

          const promises = defaultCategories.map(category => 
            categoryService.createCategory(category).catch(() => {
              // Ignora erros se a categoria já existir
            })
          );
          
          await Promise.all(promises);
          
          // Recarrega as categorias após criar as padrão
          const newResponse = await categoryService.getCategories();
          if (newResponse.success) {
            setCategories(newResponse.data);
          }
        }
      } else {
        throw new Error(response.error || 'Erro ao carregar categorias');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar categorias';
      setError(errorMessage);
    }
  }, []);

  // Carregar transações
  const loadTransactions = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionService.getTransactions(filters);
      
      if (response.success) {
        setTransactions(response.data);
      } else {
        throw new Error(response.error || 'Erro ao carregar transações');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar transações';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);


  // Carregar resumo financeiro
  const loadSummary = useCallback(async (filters = {}) => {
    try {
      const response = await transactionService.getSummary(filters);
      
      if (response.success) {
        setSummary(response.data);
      } else {
        throw new Error(response.error || 'Erro ao carregar resumo');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao carregar resumo';
      setError(errorMessage);
    }
  }, []);

  // Criar transação
  const createTransaction = useCallback(async (transactionData) => {
    const createTransactionPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await transactionService.createTransaction(transactionData);
        
        if (response.success) {
          // Recarregar transações e resumo
          await Promise.all([
            loadTransactions(),
            loadSummary()
          ]);
          
          return response.data;
        } else {
          throw new Error(response.error || 'Erro ao criar transação');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(createTransactionPromise, {
      pending: 'Criando transação...',
      success: 'Transação criada com sucesso!',
      error: 'Erro ao criar transação. Tente novamente.'
    });

    return createTransactionPromise;
  }, [loadTransactions, loadSummary]);

  // Atualizar transação
  const updateTransaction = useCallback(async (id, transactionData) => {
    const updateTransactionPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await transactionService.updateTransaction(id, transactionData);
        
        if (response.success) {
          // Recarregar transações e resumo
          await Promise.all([
            loadTransactions(),
            loadSummary()
          ]);
          
          return response.data;
        } else {
          throw new Error(response.error || 'Erro ao atualizar transação');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao atualizar transação';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(updateTransactionPromise, {
      pending: 'Atualizando transação...',
      success: 'Transação atualizada com sucesso!',
      error: (err) => {
        return err.response?.data?.error || err.message || 'Erro ao atualizar transação. Tente novamente.';
      }
    });

    return updateTransactionPromise;
  }, [loadTransactions, loadSummary]);

  // Deletar transação
  const deleteTransaction = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await transactionService.deleteTransaction(id);
      
      if (response.success) {
        // Recarregar transações e resumo
        await Promise.all([
          loadTransactions(),
          loadSummary()
        ]);
        
        toast.success('Transação deletada com sucesso!');
        return true;
      } else {
        throw new Error(response.error || 'Erro ao deletar transação');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao deletar transação';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadTransactions, loadSummary]);

  // Criar categoria
  const createCategory = useCallback(async (categoryData) => {
    const createCategoryPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoryService.createCategory(categoryData);
        
        if (response.success) {
          // Atualiza a lista de categorias diretamente
          setCategories(prev => [...prev, response.data]);
          return response.data;
        } else {
          throw new Error(response.error || 'Erro ao criar categoria');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar categoria';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(createCategoryPromise, {
      pending: 'Criando categoria...',
      success: 'Categoria criada com sucesso!',
      error: 'Erro ao criar categoria. Tente novamente.'
    });

    return createCategoryPromise;
  }, []);

  // Deletar categoria
  const deleteCategory = useCallback(async (categoryId) => {
    const deleteCategoryPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await categoryService.deleteCategory(categoryId);
        
        if (response.success) {
          // Remove a categoria da lista
          setCategories(prev => prev.filter(cat => cat.id !== categoryId));
          return response.data;
        } else {
          throw new Error(response.error || 'Erro ao deletar categoria');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao deletar categoria';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(deleteCategoryPromise, {
      pending: 'Deletando categoria...',
      success: 'Categoria deletada com sucesso!',
      error: 'Erro ao deletar categoria. Tente novamente.'
    });

    return deleteCategoryPromise;
  }, []);

  // Marcar transação como paga
  const markAsPaid = useCallback(async (transactionId) => {
    const markAsPaidPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await transactionService.markAsPaid(transactionId);
        
        if (response.success) {
          // Atualiza a transação na lista
          setTransactions(prev => prev.map(transaction => 
            transaction.id === transactionId 
              ? { ...transaction, is_paid: true, updated_at: new Date().toISOString() }
              : transaction
          ));
          
          // Recarrega o resumo
          await loadSummary();
          return response.data;
        } else {
          const errorMessage = response.error || 'Erro ao marcar transação como paga';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao marcar transação como paga';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(markAsPaidPromise, {
      pending: 'Marcando como paga...',
      success: 'Transação marcada como paga!',
      error: (err) => {
        return err.response?.data?.error || err.message || 'Erro ao marcar transação como paga. Tente novamente.';
      }
    });

    return markAsPaidPromise;
  }, [loadSummary]);

  // Marcar transação como não paga
  const markAsUnpaid = useCallback(async (transactionId) => {
    const markAsUnpaidPromise = (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await transactionService.markAsUnpaid(transactionId);
        
        if (response.success) {
          // Atualiza a transação na lista
          setTransactions(prev => prev.map(transaction => 
            transaction.id === transactionId 
              ? { ...transaction, is_paid: false, updated_at: new Date().toISOString() }
              : transaction
          ));
          
          // Recarrega o resumo
          await loadSummary();
          return response.data;
        } else {
          const errorMessage = response.error || 'Erro ao marcar transação como não paga';
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao marcar transação como não paga';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(markAsUnpaidPromise, {
      pending: 'Marcando como não paga...',
      success: 'Transação marcada como não paga!',
      error: (err) => {
        return err.response?.data?.error || err.message || 'Erro ao marcar transação como não paga. Tente novamente.';
      }
    });

    return markAsUnpaidPromise;
  }, [loadSummary]);

  // Aplicar filtros
  const applyFilters = useCallback(async (newFilters) => {
    try {
      setLoading(true);
      setFilters(newFilters);
      
      // Carrega transações com filtros
      const transactionsResponse = await transactionService.getTransactions(newFilters);
      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data);
      }
      
      // Carrega resumo com filtros
      const summaryResponse = await transactionService.getSummary(newFilters);
      if (summaryResponse.success) {
        setSummary(summaryResponse.data);
      }
    } catch {
      setError('Erro ao aplicar filtros');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Carrega transações
        const transactionsResponse = await transactionService.getTransactions();
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.data);
        }
        
        // Carrega categorias
        const categoriesResponse = await categoryService.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
        
        // Carrega resumo
        const summaryResponse = await transactionService.getSummary();
        if (summaryResponse.success) {
          setSummary(summaryResponse.data);
        }
      } catch {
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []); // Array vazio para executar apenas uma vez

  return {
    // Estado
    transactions,
    categories,
    summary,
    loading,
    error,
    filters,
    
    // Ações
    loadTransactions,
    loadCategories,
    loadSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    deleteCategory,
    markAsPaid,
    markAsUnpaid,
    applyFilters,
    
    // Helpers
    refreshData: () => {
      loadTransactions();
      loadCategories();
      loadSummary();
    }
  };
};
