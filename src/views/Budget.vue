<template>
    <div class="budget">
      <div class="header">
        <h1><i class="fas fa-calculator"></i> Budget Management</h1>
        <button @click="showForm = !showForm" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add Budget
        </button>
      </div>
  
      <!-- Add/Edit Form -->
      <div v-if="showForm" class="form-card">
        <h2>{{ editingBudget ? 'Edit Budget' : 'Add New Budget' }}</h2>
        <form @submit.prevent="saveBudget">
          <div class="form-group">
            <label for="name">Name</label>
            <input v-model="form.name" type="text" id="name" required>
          </div>
          
          <div class="form-group">
            <label for="amount">Amount</label>
            <input v-model.number="form.amount" type="number" id="amount" step="0.01" required>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <input v-model="form.category" type="text" id="category" required>
          </div>
          
          <div class="form-group">
            <label for="period">Period</label>
            <select v-model="form.period" id="period" required>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-triangle"></i> {{ errorMessage }}
          </div>
          <div v-if="isLoading" class="loading-message">
            <i class="fas fa-spinner fa-spin"></i> Loading...
          </div>
          <div v-if="successMessage" class="success-message">

          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disable="isLoading">
                <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i> 
              {{ editingBudget ? 'Update' : (isLoading ? 'Saving...' : 'Save') }}
            </button>
            <button type="button" @click="cancelForm" class="btn btn-secondary">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
  
      <!-- Budget List -->
      <div class="budget-list">
        <div v-if="budgets.length === 0" class="empty-state">
          <i class="fas fa-calculator"></i>
          <h3>No budgets yet</h3>
          <p>Create your first budget to get started</p>
        </div>
        
        <div v-else v-for="budget in budgets" :key="budget.id" class="budget-item">
          <div class="budget-info">
            <h3>{{ budget.name }}</h3>
            <p class="category">{{ budget.category }}</p>
            <p class="period">{{ budget.period }}</p>
          </div>
          
          <div class="budget-amount">
            <span class="amount">${{ budget.amount.toFixed(2) }}</span>
            <span class="per-period">per {{ budget.period.slice(0, -2) }}</span>
          </div>
          
          <div class="budget-actions">
            <button @click="editBudget(budget)" class="btn btn-sm btn-outline">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="deleteBudget(budget.id)" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import { useFinanceStore } from '@/stores/finance'
  import type { Budget } from '@/types'

  
  const store = useFinanceStore()
  const showForm = ref(false)
  const editingBudget = ref<Budget | null>(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const isLoadingBudgets = ref(false)
  
  const form = reactive({
    name: '',
    amount: 0,
    category: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly' | 'one-time',
  })
  
  const budgets = ref<Budget[]>([])
  const fetchBudgets = async () => {
    isLoadingBudgets.value = true
    try {
        const response = await fetch('http://localhost:8000/api/v1/budget/items', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        console.log('Budgets fetched:', result)

        budgets.value = Array.isArray(result)? result : []

    } catch (error) {
        console.error('Error fetching budgets:', error)
        errorMessage.value = 'Failed to load budgets'
        budgets.value = []
    }
    finally{
        isLoadingBudgets.value = false
    }
}
   
  
  const saveBudget = async () => {
    if (editingBudget.value) {
      store.updateBudget(editingBudget.value.id, form)
      resetForm()
      showForm.value = false
    } else {
        isLoading.value = true
        errorMessage.value = ''
        
        try {
            const budgetData = {
                id: Date.now().toString(),
                name: form.name,
                amount: form.amount,
                category: form.category,
                period: form.period,
            }
            const response = await fetch('http://localhost:8000/api/v1/budget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(budgetData)
            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log('Budget added:', result)

            store.addBudget(form)

            resetForm()
            showForm.value = false
        } catch (error) {
            console.error('Error adding budget:', error)
            errorMessage.value = 'Failed to add budget'
        } finally {
          isLoading.value = false
        }
    }
  }
  
  const editBudget = (budget: Budget) => {
    editingBudget.value = budget
    Object.assign(form, {
      name: budget.name,
      amount: budget.amount,
      category: budget.category,
      period: budget.period,
      date: budget.date ? budget.date.toISOString().split('T')[0] : ''
    })
    showForm.value = true
  }
  
  const deleteBudget = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      store.deleteBudget(id)
    }
  }
  
  const cancelForm = () => {
    resetForm()
    showForm.value = false
  }
  
  const resetForm = () => {
    editingBudget.value = null
    Object.assign(form, {
      name: '',
      amount: 0,
      category: '',
      period: 'monthly',
      date: ''
    })
  }
  
  onMounted(async() => {
    budgets.value = store.budgets
    await fetchBudgets()
  })
  </script>
  
  <style scoped>
  .budget .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .budget h1 {
    color: #2c3e50;
    margin: 0;
  }
  
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
  }
  
  .btn-primary {
    background: #3498db;
    color: white;
  }
  
  .btn-primary:hover {
    background: #2980b9;
  }
  
  .btn-secondary {
    background: #95a5a6;
    color: white;
  }
  
  .btn-secondary:hover {
    background: #7f8c8d;
  }
  
  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .btn-outline {
    background: transparent;
    border: 1px solid #3498db;
    color: #3498db;
  }
  
  .btn-outline:hover {
    background: #3498db;
    color: white;
  }
  
  .btn-danger {
    background: #e74c3c;
    color: white;
  }
  
  .btn-danger:hover {
    background: #c0392b;
  }
  
  .form-card {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 2rem;
  }
  
  .form-card h2 {
    margin-top: 0;
    color: #2c3e50;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .budget-list {
    display: grid;
    gap: 1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    color: #7f8c8d;
  }
  
  .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .budget-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .budget-info h3 {
    margin: 0 0 0.5rem 0;
    color: #2c3e50;
  }
  
  .budget-info p {
    margin: 0.25rem 0;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .budget-amount {
    text-align: right;
  }
  
  .amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
    display: block;
  }
  
  .per-period {
    color: #7f8c8d;
    font-size: 0.8rem;
  }
  
  .budget-actions {
    display: flex;
    gap: 0.5rem;
  }
  .budget-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .error-message {
    background: #fee;
    color: #e74c3c;
    padding: 1rem;
    border-radius: 4px;
    border-left: 4px solid #e74c3c;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .error-message i {
    font-size: 1rem;
  }
  
  .fa-spin {
    animation: fa-spin 1s infinite linear;
  }
  
  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>