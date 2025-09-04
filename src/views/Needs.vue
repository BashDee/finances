


<template>
    <div class="needs">
      <div class="header">
        <h1><i class="fas fa-exclamation-triangle"></i> Needs Management</h1>
        <button @click="showForm = !showForm" class="btn btn-primary">
          <i class="fas fa-plus"></i> Add Need
        </button>
      </div>
  
      <!-- Add/Edit Form -->
      <div v-if="showForm" class="form-card">
        <h2>{{ editingNeed ? 'Edit Need' : 'Add New Need' }}</h2>
        <form @submit.prevent="saveNeed">
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
            <select v-model="form.category" id="category" required>
              <option value="housing">Housing</option>
              <option value="food">Food</option>
              <option value="transportation">Transportation</option>
              <option value="utilities">Utilities</option>
              <option value="healthcare">Healthcare</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="priority">Priority</label>
            <select v-model="form.priority" id="priority" required>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="dueDate">Due Date (Optional)</label>
            <input v-model="form.dueDate" type="date" id="dueDate">
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input v-model="form.isPaid" type="checkbox" id="isPaid">
              <span>Mark as Paid</span>
            </label>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save"></i> {{ editingNeed ? 'Update' : 'Save' }}
            </button>
            <button type="button" @click="cancelForm" class="btn btn-secondary">
              <i class="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      </div>
  
      <!-- Filter and Sort -->
      <div class="filters">
        <div class="filter-group">
          <label for="filterCategory">Filter by Category:</label>
          <select v-model="filterCategory" id="filterCategory">
            <option value="">All Categories</option>
            <option value="housing">Housing</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="utilities">Utilities</option>
            <option value="healthcare">Healthcare</option>
            <option value="insurance">Insurance</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="filterStatus">Filter by Status:</label>
          <select v-model="filterStatus" id="filterStatus">
            <option value="">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>
  
      <!-- Needs List -->
      <div class="needs-list">
        <div v-if="filteredNeeds.length === 0" class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>No needs found</h3>
          <p>{{ filterCategory || filterStatus ? 'Try adjusting your filters' : 'Create your first need to get started' }}</p>
        </div>
        
        <div v-else v-for="need in filteredNeeds" :key="need.id" class="need-item" :class="{ 'paid': need.isPaid }">
          <div class="need-info">
            <div class="need-header">
              <h3>{{ need.name }}</h3>
              <span class="priority-badge" :class="need.priority">{{ need.priority }}</span>
            </div>
            <p class="category">{{ need.category }}</p>
            <p v-if="need.dueDate" class="due-date">
              <i class="fas fa-calendar"></i> Due: {{ formatDate(need.dueDate) }}
            </p>
          </div>
          
          <div class="need-amount">
            <span class="amount">${{ need.amount.toFixed(2) }}</span>
          </div>
          
          <div class="need-status">
            <span class="status-badge" :class="{ 'paid': need.isPaid, 'unpaid': !need.isPaid }">
              {{ need.isPaid ? 'Paid' : 'Unpaid' }}
            </span>
          </div>
          
          <div class="need-actions">
            <button @click="editNeed(need)" class="btn btn-sm btn-outline">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button @click="deleteNeed(need.id)" class="btn btn-sm btn-danger">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useFinanceStore } from '@/stores/finance'
  import type { Need } from '@/types'
  
  const store = useFinanceStore()
  const showForm = ref(false)
  const editingNeed = ref<Need | null>(null)
  const filterCategory = ref('')
  const filterStatus = ref('')
  
  const form = reactive({
    name: '',
    amount: 0,
    category: 'other' as Need['category'],
    priority: 'medium' as Need['priority'],
    dueDate: '',
    isPaid: false
  })
  
  const filteredNeeds = computed(() => {
    let filtered = store.needs
    
    if (filterCategory.value) {
      filtered = filtered.filter(need => need.category === filterCategory.value)
    }
    
    if (filterStatus.value) {
      const isPaid = filterStatus.value === 'paid'
      filtered = filtered.filter(need => need.isPaid === isPaid)
    }
    
    return filtered.sort((a, b) => {
      // Sort by priority first (high > medium > low)
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })
  
  const saveNeed = () => {
    const needData = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined
    }
    
    if (editingNeed.value) {
      store.updateNeed(editingNeed.value.id, needData)
    } else {
      store.addNeed(needData)
    }
    resetForm()
    showForm.value = false
  }
  
  const editNeed = (need: Need) => {
    editingNeed.value = need
    Object.assign(form, {
      name: need.name,
      amount: need.amount,
      category: need.category,
      priority: need.priority,
      dueDate: need.dueDate ? need.dueDate.toISOString().split('T')[0] : '',
      isPaid: need.isPaid
    })
    showForm.value = true
  }
  
  const deleteNeed = (id: string) => {
    if (confirm('Are you sure you want to delete this need?')) {
      store.deleteNeed(id)
    }
  }
  
  const cancelForm = () => {
    resetForm()
    showForm.value = false
  }
  
  const resetForm = () => {
    editingNeed.value = null
    Object.assign(form, {
      name: '',
      amount: 0,
      category: 'other',
      priority: 'medium',
      dueDate: '',
      isPaid: false
    })
  }
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  </script>
  
  <style scoped>
  .needs .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .needs h1 {
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
    background: #e74c3c;
    color: white;
  }
  
  .btn-primary:hover {
    background: #c0392b;
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
    border: 1px solid #e74c3c;
    color: #e74c3c;
  }
  
  .btn-outline:hover {
    background: #e74c3c;
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
  
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
  
  .checkbox-label input[type="checkbox"] {
    width: auto;
    margin: 0;
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
    border-color: #e74c3c;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
  }
  
  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .filters {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .filter-group label {
    font-weight: 500;
    color: #2c3e50;
  }
  
  .filter-group select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    min-width: 150px;
  }
  
  .needs-list {
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
  
  .need-item {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: grid;
    grid-template-columns: 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    transition: all 0.3s;
  }
  
  .need-item.paid {
    opacity: 0.7;
    background: #f8f9fa;
  }
  
  .need-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .need-header h3 {
    margin: 0;
    color: #2c3e50;
  }
  
  .priority-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
  }
  
  .priority-badge.high {
    background: #e74c3c;
    color: white;
  }
  
  .priority-badge.medium {
    background: #f39c12;
    color: white;
  }
  
  .priority-badge.low {
    background: #27ae60;
    color: white;
  }
  
  .need-info p {
    margin: 0.25rem 0;
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .need-info .due-date {
    color: #e74c3c;
    font-weight: 500;
  }
  
  .need-amount .amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c3e50;
  }
  
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .status-badge.paid {
    background: #27ae60;
    color: white;
  }
  
  .status-badge.unpaid {
    background: #e74c3c;
    color: white;
  }
  
  .need-actions {
    display: flex;
    gap: 0.5rem;
  }
  </style>