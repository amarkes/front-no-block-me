import styles from './styles.module.css';
import { useTheme } from '../../context/ThemeContext';

const TransactionList = ({ transactions, onDelete, onMarkAsPaid, onMarkAsUnpaid, loading = false }) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`${styles.transactionsContainer} ${isDark ? styles.dark : ''}`}>
      <div className={styles.transactionsHeader}>
        <h2 className={styles.transactionsTitle}>
          Transações Recentes
        </h2>
      </div>
      
            <div className={styles.transactionsContent}>
              {loading ? (
                <div className={styles.emptyState}>
                  <p className={styles.emptyText}>Carregando transações...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className={styles.emptyText}>Nenhuma transação cadastrada</p>
                  <p className={styles.emptySubtext}>Adicione sua primeira transação acima</p>
                </div>
              ) : (
          <div className={styles.transactionsList}>
            {transactions.map((transaction) => (
              <div key={transaction.id} className={styles.transactionItem}>
                <div className={styles.transactionLeft}>
                  <div className={`${styles.transactionIcon} ${
                    transaction.type === 'income' 
                      ? styles.transactionIconIncome
                      : styles.transactionIconExpense
                  }`}>
                    <svg className={`${styles.transactionIconSvg} ${
                      transaction.type === 'income' ? styles.transactionIconSvgIncome : styles.transactionIconSvgExpense
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {transaction.type === 'income' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      )}
                    </svg>
                  </div>
                        <div className={styles.transactionInfo}>
                          <p className={styles.transactionDescription}>{transaction.description}</p>
                          <p className={styles.transactionCategory}>
                            {transaction.category ? `${transaction.category.icon} ${transaction.category.name}` : 'Sem categoria'}
                          </p>
                        </div>
                      </div>
                      <div className={styles.transactionRight}>
                        <div className={styles.transactionAmountContainer}>
                          <p className={`${styles.transactionAmount} ${
                            transaction.type === 'income' ? styles.transactionAmountIncome : styles.transactionAmountExpense
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                          </p>
                          <p className={styles.transactionDate}>
                            {new Date(transaction.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className={styles.transactionActions}>
                          {/* Status de pagamento */}
                          <div className={styles.paymentStatus}>
                            {transaction.is_paid ? (
                              <span className={styles.paidStatus}>✅ Pago</span>
                            ) : (
                              <span className={styles.unpaidStatus}>⏳ Pendente</span>
                            )}
                          </div>
                          
                          {/* Botões de ação */}
                          <div className={styles.actionButtons}>
                            {transaction.is_paid ? (
                              onMarkAsUnpaid && (
                                <button
                                  onClick={() => onMarkAsUnpaid(transaction.id)}
                                  className={styles.unpaidButton}
                                  title="Marcar como não pago"
                                >
                                  ↩️
                                </button>
                              )
                            ) : (
                              onMarkAsPaid && (
                                <button
                                  onClick={() => onMarkAsPaid(transaction.id)}
                                  className={styles.paidButton}
                                  title="Marcar como pago"
                                >
                                  ✅
                                </button>
                              )
                            )}
                            
                            {onDelete && (
                              <button
                                onClick={() => onDelete(transaction.id)}
                                className={styles.deleteButton}
                                title="Deletar transação"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
