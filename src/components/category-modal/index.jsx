import { useState } from 'react';
import styles from './styles.module.css';
import { useTheme } from '../../context/ThemeContext';

const CategoryModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  type = 'expense',
  loading = false 
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    color: type === 'income' ? '#10B981' : '#EF4444',
    icon: type === 'income' ? '💰' : '💸'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit({
        ...formData,
        type,
        name: formData.name.trim()
      });
      setFormData({
        name: '',
        color: type === 'income' ? '#10B981' : '#EF4444',
        icon: type === 'income' ? '💰' : '💸'
      });
    }
  };

  const predefinedColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
    '#10B981', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6',
    '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#6B7280', '#374151'
  ];

  const predefinedIcons = [
    '💰', '💸', '💼', '💻', '📈', '🛒', '🍽️', '🚗', '🏠', '🏥',
    '📚', '🎮', '🎬', '🎵', '⚽', '🛍️', '🍕', '☕', '⛽', '💊'
  ];

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContainer} ${isDark ? styles.dark : ''}`}>
        <div className={styles.modalHeader}>
          <h3 className={`${styles.modalTitle} ${isDark ? styles.dark : ''}`}>
            Nova Categoria - {type === 'income' ? 'Receita' : 'Despesa'}
          </h3>
          <button
            onClick={onClose}
            className={styles.closeButton}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>
              Nome da Categoria
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${styles.formInput} ${isDark ? styles.dark : ''}`}
              placeholder="Ex: Salário, Alimentação..."
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>
              Cor
            </label>
            <div className={styles.colorGrid}>
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`${styles.colorButton} ${formData.color === color ? styles.colorButtonSelected : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.formLabel} ${isDark ? styles.dark : ''}`}>
              Ícone
            </label>
            <div className={styles.iconGrid}>
              {predefinedIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`${styles.iconButton} ${formData.icon === icon ? styles.iconButtonSelected : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  disabled={loading}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || !formData.name.trim()}
            >
              {loading ? 'Criando...' : 'Criar Categoria'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
