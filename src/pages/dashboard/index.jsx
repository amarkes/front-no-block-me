import { useState } from 'react';
import styles from './styles.module.css';
import HeaderComponent from '../../components/header';
import SummaryCards from '../../components/summary-cards';
import TransactionForm from '../../components/transaction-form';
import TransactionList from '../../components/transaction-list';
import CategoryModal from '../../components/category-modal';
import TransactionFilters from '../../components/transaction-filters';
import { useTransactions } from '../../hooks/useTransactions';

const DashboardPage = ({ onMenuClick }) => {
  const {
    transactions,
    categories,
    summary,
    loading,
    createTransaction,
    deleteTransaction,
    createCategory,
    markAsPaid,
    markAsUnpaid,
    applyFilters
  } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState('expense');
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

  return (
        <div className={styles.dashboardContainer}>
          <HeaderComponent onMenuClick={onMenuClick} />
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Controle Financeiro
            </h1>
            <p className={styles.pageSubtitle}>
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

          {/* Lista de transações */}
              <TransactionList 
                transactions={transactions} 
                onDelete={handleDeleteTransaction}
                onMarkAsPaid={markAsPaid}
                onMarkAsUnpaid={markAsUnpaid}
                loading={loading}
              />

          {/* Modal de categoria */}
          <CategoryModal
            isOpen={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
            onSubmit={handleCreateCategorySubmit}
            type={categoryModalType}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;