import api from '../../common/utils/axios';

// Serviço de Transações
export const transactionService = {
  // Listar transações
  async getTransactions(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.type) params.append('type', filters.type);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const queryString = params.toString();
    const url = `/cashflow/transactions${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  },

  // Buscar transação por ID
  async getTransactionById(id) {
    const response = await api.get(`/cashflow/transactions/${id}`);
    return response.data;
  },

  // Criar transação
  async createTransaction(transactionData) {
    const response = await api.post(`/cashflow/transactions`, transactionData);
    return response.data;
  },

  // Atualizar transação
  async updateTransaction(id, transactionData) {
    const response = await api.put(`/cashflow/transactions/${id}`, transactionData);
    return response.data;
  },

  // Deletar transação
  async deleteTransaction(id) {
    const response = await api.delete(`/cashflow/transactions/${id}`);
    return response.data;
  },

  // Marcar transação como paga
  async markAsPaid(id) {
    const response = await api.patch(`/cashflow/transactions/${id}/pay`);
    return response.data;
  },

  // Marcar transação como não paga
  async markAsUnpaid(id) {
    const response = await api.patch(`/cashflow/transactions/${id}/unpay`);
    return response.data;
  },

  // Obter resumo financeiro
  async getSummary(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = `/cashflow/summary${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data;
  }
};

// Serviço de Categorias
export const categoryService = {
  // Listar categorias
  async getCategories() {
    const response = await api.get(`/cashflow/categories`);
    return response.data;
  },

  // Buscar categoria por ID
  async getCategoryById(id) {
    const response = await api.get(`/cashflow/categories/${id}`);
    return response.data;
  },

  // Criar categoria
  async createCategory(categoryData) {
    const response = await api.post(`/cashflow/categories`, categoryData);
    return response.data;
  },

  // Atualizar categoria
  async updateCategory(id, categoryData) {
    const response = await api.put(`/cashflow/categories/${id}`, categoryData);
    return response.data;
  },

  // Deletar categoria
  async deleteCategory(id) {
    const response = await api.delete(`/cashflow/categories/${id}`);
    return response.data;
  }
};

export default {
  transactionService,
  categoryService
};
