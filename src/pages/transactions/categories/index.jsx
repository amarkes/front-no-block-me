import { useState } from 'react';
import { useTransactions } from '../../../hooks/useTransactions';
import styles from './styles.module.css';
import CategoryModal from '../../../components/category-modal';
import { useTheme } from '../../../context/ThemeContext';

const CategoriesPage = ({ onMenuClick }) => {
  const {
    categories,
    loading,
    createCategory,
    deleteCategory
  } = useTransactions();
  
  const { isDark } = useTheme();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState('expense');
  const [editingCategory, setEditingCategory] = useState(null);

  const handleCreateCategory = (type) => {
    setCategoryModalType(type);
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryModalType(category.type);
    setShowCategoryModal(true);
  };

  const handleCreateCategorySubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        // TODO: Implementar edição de categoria
        console.log('Editar categoria:', editingCategory.id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch {
      // Error já é tratado no hook
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
      try {
        await deleteCategory(id);
      } catch {
        // Error já é tratado no hook
      }
    }
  };

  const getCategoriesByType = (type) => {
    return categories.filter(cat => cat.type === type);
  };

  const incomeCategories = getCategoriesByType('income');
  const expenseCategories = getCategoriesByType('expense');

  return (
    <div className={`${styles.categoriesContainer} ${isDark ? styles.dark : ''}`}>
      
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {/* Header da página */}
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>
              Gerenciar Categorias
            </h1>
            <p className={`${styles.pageSubtitle} ${isDark ? styles.dark : ''}`}>
              Organize suas receitas e despesas por categoria
            </p>
          </div>

          {/* Botões de ação */}
          <div className={styles.actionButtons}>
            <button
              onClick={() => handleCreateCategory('income')}
              className={styles.createButton}
              disabled={loading}
            >
              + Nova Categoria de Receita
            </button>
            <button
              onClick={() => handleCreateCategory('expense')}
              className={styles.createButton}
              disabled={loading}
            >
              + Nova Categoria de Despesa
            </button>
          </div>

          {/* Categorias de Receita */}
          <div className={styles.categorySection}>
            <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
              📈 Categorias de Receita
            </h2>
            <div className={styles.categoriesGrid}>
              {incomeCategories.length > 0 ? (
                incomeCategories.map((category) => (
                  <div key={category.id} className={styles.categoryCard}>
                    <div 
                      className={styles.categoryIcon}
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <span style={{ color: category.color }}>
                        {category.icon}
                      </span>
                    </div>
                    <div className={styles.categoryInfo}>
                      <h3 className={styles.categoryName}>
                        {category.name}
                      </h3>
                      <p className={styles.categoryType}>
                        Receita
                      </p>
                    </div>
                    <div className={styles.categoryActions}>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className={styles.editButton}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhuma categoria de receita cadastrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Categorias de Despesa */}
          <div className={styles.categorySection}>
            <h2 className={`${styles.sectionTitle} ${isDark ? styles.dark : ''}`}>
              📉 Categorias de Despesa
            </h2>
            <div className={styles.categoriesGrid}>
              {expenseCategories.length > 0 ? (
                expenseCategories.map((category) => (
                  <div key={category.id} className={styles.categoryCard}>
                    <div 
                      className={styles.categoryIcon}
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <span style={{ color: category.color }}>
                        {category.icon}
                      </span>
                    </div>
                    <div className={styles.categoryInfo}>
                      <h3 className={styles.categoryName}>
                        {category.name}
                      </h3>
                      <p className={styles.categoryType}>
                        Despesa
                      </p>
                    </div>
                    <div className={styles.categoryActions}>
                      <button
                        onClick={() => handleEditCategory(category)}
                        className={styles.editButton}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className={styles.deleteButton}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Nenhuma categoria de despesa cadastrada</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal de categoria */}
          <CategoryModal
            isOpen={showCategoryModal}
            onClose={() => {
              setShowCategoryModal(false);
              setEditingCategory(null);
            }}
            onSubmit={handleCreateCategorySubmit}
            type={categoryModalType}
            loading={loading}
            editingCategory={editingCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
