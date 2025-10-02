import { useState } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';
import styles from './styles.module.css';
import { useTheme } from '../../../context/ThemeContext';

const ReportsPage = ({ onMenuClick }) => {
  const {
    transactions
  } = useTransactions();
  
  const { isDark } = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calcular estatísticas
  const getTransactionsByType = (type) => {
    return transactions.filter(t => t.type === type);
  };

  const incomeTransactions = getTransactionsByType('income');
  const expenseTransactions = getTransactionsByType('expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Agrupar por categoria
  const getTransactionsByCategory = (type) => {
    const typeTransactions = getTransactionsByType(type);
    const grouped = {};
    
    typeTransactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      if (!grouped[categoryName]) {
        grouped[categoryName] = {
          name: categoryName,
          amount: 0,
          count: 0,
          color: transaction.category?.color || '#6B7280',
          icon: transaction.category?.icon || '💰'
        };
      }
      grouped[categoryName].amount += transaction.amount;
      grouped[categoryName].count += 1;
    });

    return Object.values(grouped).sort((a, b) => b.amount - a.amount);
  };

  const incomeByCategory = getTransactionsByCategory('income');
  const expenseByCategory = getTransactionsByCategory('expense');

  return (
    <div className={`${styles.reportsContainer} ${isDark ? styles.dark : ''}`}>
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Relatórios Financeiros
            </h1>
            <p className={`${styles.pageSubtitle} ${isDark ? styles.dark : ''}`}>
              Análises detalhadas das suas finanças
            </p>
          </div>

          {/* Filtros de período */}
          <div className={styles.filtersContainer}>
            <h3 className={styles.filtersTitle}>Período</h3>
            <div className={styles.periodButtons}>
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`${styles.periodButton} ${
                    selectedPeriod === period ? styles.periodButtonActive : ''
                  }`}
                >
                  {period === 'week' ? 'Esta Semana' : 
                   period === 'month' ? 'Este Mês' : 'Este Ano'}
                </button>
              ))}
            </div>
          </div>

          {/* Resumo geral */}
          <div className={styles.summarySection}>
            <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>Resumo Geral</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon}>
                  📈
                </div>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryLabel}>Total de Receitas</h3>
                  <p className={styles.summaryValue}>
                    R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon}>
                  📉
                </div>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryLabel}>Total de Despesas</h3>
                  <p className={styles.summaryValue}>
                    R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className={styles.summaryCard}>
                <div className={styles.summaryIcon}>
                  💰
                </div>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryLabel}>Saldo</h3>
                  <p className={`${styles.summaryValue} ${
                    balance >= 0 ? styles.positiveValue : styles.negativeValue
                  }`}>
                    R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Análise por categoria - Receitas */}
          <div className={styles.categoryAnalysis}>
            <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>Receitas por Categoria</h2>
            <div className={styles.categoryList}>
              {incomeByCategory.length > 0 ? (
                incomeByCategory.map((category, index) => (
                  <div key={index} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}>
                      <div 
                        className={styles.categoryIcon}
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <span style={{ color: category.color }}>
                          {category.icon}
                        </span>
                      </div>
                      <div className={styles.categoryDetails}>
                        <h4 className={styles.categoryName}>{category.name}</h4>
                        <p className={styles.categoryCount}>
                          {category.count} transação{category.count !== 1 ? 'ões' : ''}
                        </p>
                      </div>
                    </div>
                    <div className={styles.categoryAmount}>
                      R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Nenhuma receita registrada</p>
              )}
            </div>
          </div>

          {/* Análise por categoria - Despesas */}
          <div className={styles.categoryAnalysis}>
            <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>Despesas por Categoria</h2>
            <div className={styles.categoryList}>
              {expenseByCategory.length > 0 ? (
                expenseByCategory.map((category, index) => (
                  <div key={index} className={styles.categoryItem}>
                    <div className={styles.categoryInfo}>
                      <div 
                        className={styles.categoryIcon}
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <span style={{ color: category.color }}>
                          {category.icon}
                        </span>
                      </div>
                      <div className={styles.categoryDetails}>
                        <h4 className={styles.categoryName}>{category.name}</h4>
                        <p className={styles.categoryCount}>
                          {category.count} transação{category.count !== 1 ? 'ões' : ''}
                        </p>
                      </div>
                    </div>
                    <div className={styles.categoryAmount}>
                      R$ {category.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              ) : (
                <p className={styles.emptyState}>Nenhuma despesa registrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
