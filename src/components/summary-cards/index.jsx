import React from 'react';
import styles from './styles.module.css';

const SummaryCards = ({ totalIncome, totalExpenses, balance, loading = false }) => {
  return (
    <div className={styles.cardsGrid}>
      <div className={styles.summaryCard}>
        <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <p className={styles.cardLabel}>Receitas</p>
                  <p className={`${styles.cardValue} ${styles.cardValueIncome}`}>
                    {loading ? '...' : `R$ ${totalIncome.toFixed(2)}`}
                  </p>
                </div>
          <div className={`${styles.cardIcon} ${styles.cardIconIncome}`}>
            <svg className={`${styles.icon} ${styles.iconIncome}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <p className={styles.cardLabel}>Despesas</p>
                  <p className={`${styles.cardValue} ${styles.cardValueExpense}`}>
                    {loading ? '...' : `R$ ${totalExpenses.toFixed(2)}`}
                  </p>
                </div>
          <div className={`${styles.cardIcon} ${styles.cardIconExpense}`}>
            <svg className={`${styles.icon} ${styles.iconExpense}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.cardContent}>
                <div className={styles.cardInfo}>
                  <p className={styles.cardLabel}>Saldo</p>
                  <p className={`${styles.cardValue} ${balance >= 0 ? styles.cardValueBalance : styles.cardValueBalanceNegative}`}>
                    {loading ? '...' : `R$ ${balance.toFixed(2)}`}
                  </p>
                </div>
          <div className={`${styles.cardIcon} ${balance >= 0 ? styles.cardIconBalance : styles.cardIconBalanceNegative}`}>
            <svg className={`${styles.icon} ${balance >= 0 ? styles.iconBalance : styles.iconBalanceNegative}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
