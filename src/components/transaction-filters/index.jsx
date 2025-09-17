import { useState } from 'react';
import styles from './styles.module.css';

const TransactionFilters = ({ 
  onFilterChange, 
  loading = false 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [customDate, setCustomDate] = useState('');

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setCustomDate('');
    
    // Calcular datas baseado no período
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      case 'custom':
        if (customDate) {
          startDate = new Date(customDate);
          endDate = new Date(customDate);
          endDate.setHours(23, 59, 59);
        } else {
          return;
        }
        break;
      default:
        onFilterChange({});
        return;
    }

    onFilterChange({
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0]
    });
  };

  const handleCustomDateChange = (date) => {
    setCustomDate(date);
    if (selectedPeriod === 'custom') {
      handlePeriodChange('custom');
    }
  };

  const periods = [
    { value: 'all', label: 'Todos' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' },
    { value: 'year', label: 'Este Ano' },
    { value: 'custom', label: 'Data Específica' }
  ];

  return (
    <div className={styles.filtersContainer}>
      <h3 className={styles.filtersTitle}>Filtros</h3>
      
      <div className={styles.filtersGrid}>
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            className={`${styles.filterButton} ${
              selectedPeriod === period.value ? styles.filterButtonActive : ''
            }`}
            disabled={loading}
          >
            {period.label}
          </button>
        ))}
      </div>

      {selectedPeriod === 'custom' && (
        <div className={styles.customDateContainer}>
          <label className={styles.customDateLabel}>
            Selecione uma data:
          </label>
          <input
            type="date"
            value={customDate}
            onChange={(e) => handleCustomDateChange(e.target.value)}
            className={styles.customDateInput}
            disabled={loading}
          />
        </div>
      )}

      {selectedPeriod !== 'all' && (
        <button
          onClick={() => handlePeriodChange('all')}
          className={styles.clearFiltersButton}
          disabled={loading}
        >
          Limpar Filtros
        </button>
      )}
    </div>
  );
};

export default TransactionFilters;
