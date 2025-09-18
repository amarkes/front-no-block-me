import { useState } from 'react';
import styles from './styles.module.css';
import HeaderComponent from '../../components/header';
import SummaryCards from '../../components/summary-cards';
import TransactionForm from '../../components/transaction-form';
import TransactionList from '../../components/transaction-list';
import CategoryModal from '../../components/category-modal';
import TransactionEditModal from '../../components/transaction-edit-modal';
import TransactionFilters from '../../components/transaction-filters';
import { useTransactions } from '../../hooks/useTransactions';
import { useTheme } from '../../context/ThemeContext';

const DashboardPage = ({ onMenuClick }) => {
  const {
    transactions,
    categories,
    summary,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    createCategory,
    markAsPaid,
    markAsUnpaid,
    applyFilters
  } = useTransactions();
  
  const { isDark } = useTheme();

  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState('expense');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: '',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id || null,
      tags: formData.tags.length > 0 ? formData.tags.split(',').map(tag => tag.trim()) : []
    };

    try {
      await createTransaction(transactionData);
      
      // Reset form
      setFormData({
        type: 'income',
        description: '',
        amount: '',
        category_id: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
        notes: ''
      });
      setShowForm(false);
    } catch {
      // Error já é tratado no hook
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch {
        // Error já é tratado no hook
      }
    }
  };

  // Filtrar categorias por tipo
  const getCategoriesByType = (type) => {
    return categories.filter(cat => cat.type === type);
  };

  // Separar transações por status de pagamento
  const paidTransactions = transactions.filter(transaction => transaction.is_paid);
  const unpaidTransactions = transactions.filter(transaction => !transaction.is_paid);

  // Abrir modal de categoria
  const handleCreateCategory = (type) => {
    setCategoryModalType(type);
    setShowCategoryModal(true);
  };

  // Criar categoria
  const handleCreateCategorySubmit = async (categoryData) => {
    try {
      await createCategory(categoryData);
      setShowCategoryModal(false);
    } catch {
      // Error já é tratado no hook
    }
  };

  // Abrir modal de edição
  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  };

  // Editar transação
  const handleEditTransactionSubmit = async (transactionData) => {
    try {
      await updateTransaction(editingTransaction.id, transactionData);
      setShowEditModal(false);
      setEditingTransaction(null);
    } catch {
      // Error já é tratado no hook
    }
  };

  return (
        <div className={`${styles.dashboardContainer} ${isDark ? styles.dark : ''}`}>
          <HeaderComponent onMenuClick={onMenuClick} />
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Controle Financeiro
            </h1>
            <p className={`${styles.pageSubtitle} ${isDark ? styles.dark : ''}`}>
              Gerencie suas despesas e receitas de forma simples
            </p>
          </div>

          {/* Cards de resumo */}
          <SummaryCards 
            totalIncome={summary.totalIncome}
            totalExpenses={summary.totalExpenses}
            balance={summary.balance}
            loading={loading}
          />

          {/* Botão para filtros */}
          <div className={styles.filtersButtonContainer}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filtersButton}
              disabled={loading}
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>
          </div>

          {/* Filtros */}
          {showFilters && (
            <TransactionFilters 
              onFilterChange={applyFilters}
              loading={loading}
            />
          )}

          {/* Botão para adicionar transação */}
          <div className={styles.addButtonContainer}>
            <button
              onClick={() => setShowForm(!showForm)}
              className={styles.addButton}
              disabled={loading}
            >
              {showForm ? 'Cancelar' : '+ Nova Transação'}
            </button>
          </div>

          {/* Formulário de nova transação */}
          <TransactionForm
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            categories={categories}
            getCategoriesByType={getCategoriesByType}
            loading={loading}
            onCreateCategory={handleCreateCategory}
          />

          {/* Transações não pagas */}
          {unpaidTransactions.length > 0 && (
            <div className={styles.transactionSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                <span className={styles.sectionIcon}>⏳</span>
                Pendentes ({unpaidTransactions.length})
              </h2>
              <TransactionList 
                transactions={unpaidTransactions} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                onMarkAsPaid={markAsPaid}
                onMarkAsUnpaid={markAsUnpaid}
                loading={loading}
              />
            </div>
          )}

          {/* Transações pagas */}
          {paidTransactions.length > 0 && (
            <div className={styles.transactionSection}>
              <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
                <span className={styles.sectionIcon}>✅</span>
                Pagas ({paidTransactions.length})
              </h2>
              <TransactionList 
                transactions={paidTransactions} 
                onDelete={handleDeleteTransaction}
                onEdit={handleEditTransaction}
                onMarkAsPaid={markAsPaid}
                onMarkAsUnpaid={markAsUnpaid}
                loading={loading}
              />
            </div>
          )}

          {/* Mensagem quando não há transações */}
          {transactions.length === 0 && !loading && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📊</div>
              <h3 className={isDark ? styles.dark : ''}>Nenhuma transação encontrada</h3>
              <p className={isDark ? styles.dark : ''}>Comece adicionando sua primeira transação!</p>
            </div>
          )}

          {/* Modal de categoria */}
          <CategoryModal
            isOpen={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
            onSubmit={handleCreateCategorySubmit}
            type={categoryModalType}
            loading={loading}
          />

          {/* Modal de edição de transação */}
          <TransactionEditModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingTransaction(null);
            }}
            onSubmit={handleEditTransactionSubmit}
            transaction={editingTransaction}
            categories={categories}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;