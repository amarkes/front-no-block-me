import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useTheme } from '../../context/ThemeContext';

const TransactionEditModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction, 
  categories, 
  loading = false 
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    type: 'income',
    description: '',
    amount: '',
    category_id: '',
    date: '',
    tags: '',
    notes: '',
    is_paid: false
  });

  // Preencher formulário quando a transação mudar
  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'income',
        description: transaction.description || '',
        amount: transaction.amount?.toString() || '',
        category_id: transaction.category_id || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
        tags: transaction.tags ? (Array.isArray(transaction.tags) ? transaction.tags.join(', ') : transaction.tags) : '',
        notes: transaction.notes || '',
        is_paid: transaction.is_paid || false
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      category_id: formData.category_id || null,
      tags: formData.tags.length > 0 ? formData.tags.split(',').map(tag => tag.trim()) : []
    };

    onSubmit(transactionData);
  };

  // Filtrar categorias por tipo
  const getCategoriesByType = (type) => {
    return categories.filter(cat => cat.type === type);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modalContainer} ${isDark ? styles.dark : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.modalHeader} ${isDark ? styles.dark : ''}`}>
          <h3 className={`${styles.modalTitle} ${isDark ? styles.dark : ''}`}>
            Editar Transação
          </h3>
          <button 
            className={`${styles.closeButton} ${isDark ? styles.dark : ''}`}
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Tipo - Full Width */}
          <div className={`${styles.formGroup} ${styles.formGridFull}`}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Tipo</label>
            <div className={styles.radioGroup}>
              <label className={`${styles.radioLabel} ${isDark ? styles.dark : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className={`${styles.radioText} ${isDark ? styles.dark : ''}`}>Receita</span>
              </label>
              <label className={`${styles.radioLabel} ${isDark ? styles.dark : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className={`${styles.radioText} ${isDark ? styles.dark : ''}`}>Despesa</span>
              </label>
            </div>
          </div>

          {/* Grid Layout */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Descrição</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.formInput} ${isDark ? styles.dark : ''}`}
                placeholder="Ex: Salário, Aluguel, Comida..."
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Valor (R$)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className={`${styles.formInput} ${isDark ? styles.dark : ''}`}
                placeholder="0,00"
                step="0.01"
                min="0"
                required
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Categoria</label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={`${styles.formSelect} ${isDark ? styles.dark : ''}`}
                disabled={loading}
              >
                <option value="">Selecione uma categoria</option>
                {getCategoriesByType(formData.type).map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Data</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`${styles.formInput} ${isDark ? styles.dark : ''}`}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags e Notas - Full Width */}
          <div className={`${styles.formGroup} ${styles.formGridFull}`}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Tags (separadas por vírgula)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className={`${styles.formInput} ${isDark ? styles.dark : ''}`}
              placeholder="Ex: trabalho, urgente, importante"
              disabled={loading}
            />
          </div>

          <div className={`${styles.formGroup} ${styles.formGridFull}`}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>Observações</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className={`${styles.formTextarea} ${isDark ? styles.dark : ''}`}
              placeholder="Observações adicionais..."
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Checkbox - Full Width */}
          <div className={`${styles.formGroup} ${styles.formGridFull}`}>
            <label className={`${styles.checkboxLabel} ${isDark ? styles.dark : ''}`}>
              <input
                type="checkbox"
                name="is_paid"
                checked={formData.is_paid}
                onChange={handleInputChange}
                disabled={loading}
              />
              <span className={`${styles.checkboxText} ${isDark ? styles.dark : ''}`}>Transação já foi paga</span>
            </label>
          </div>

          <div className={`${styles.modalActions} ${isDark ? styles.dark : ''}`}>
            <button
              type="button"
              onClick={onClose}
              className={`${styles.cancelButton} ${isDark ? styles.dark : ''}`}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.submitButton} ${isDark ? styles.dark : ''}`}
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionEditModal;
