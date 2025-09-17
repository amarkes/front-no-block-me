import React from 'react';
import styles from './styles.module.css';

const TransactionForm = ({ 
  showForm, 
  setShowForm, 
  formData, 
  handleInputChange, 
  handleSubmit,
  categories = [],
  getCategoriesByType,
  loading = false,
  onCreateCategory
}) => {
  if (!showForm) return null;

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>
        Nova Transação
      </h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Tipo
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={styles.formSelect}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Valor (R$)
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Descrição
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <div className={styles.formLabelContainer}>
                      <label className={styles.formLabel}>
                        Categoria
                      </label>
                      {onCreateCategory && (
                        <button
                          type="button"
                          onClick={() => onCreateCategory(formData.type)}
                          className={styles.addCategoryButton}
                          title="Criar nova categoria"
                        >
                          + Nova Categoria
                        </button>
                      )}
                    </div>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="">Selecione uma categoria</option>
                      {getCategoriesByType && getCategoriesByType(formData.type).length > 0 ? (
                        getCategoriesByType(formData.type).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          Nenhuma categoria disponível
                        </option>
                      )}
                    </select>
                    {getCategoriesByType && getCategoriesByType(formData.type).length === 0 && (
                      <p className={styles.noCategoriesText}>
                        Nenhuma categoria de {formData.type === 'income' ? 'receita' : 'despesa'} cadastrada.
                        {onCreateCategory && ' Clique em "Nova Categoria" para criar uma.'}
                      </p>
                    )}
                  </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formButtons}>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className={styles.cancelButton}
          >
            Cancelar
          </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Transação'}
                  </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
