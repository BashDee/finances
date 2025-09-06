<template>
    <div class="dashboard">
      <h1><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
      
      <div class="summary-cards">
        <div class="card budget-card">
          <div class="card-header">
            <i class="fas fa-calculator"></i>
            <h3>Total Budget</h3>
          </div>
          <div class="card-value">${{ summary.totalBudget.toFixed(2) }}</div>
        </div>
        
        <div class="card needs-card">
          <div class="card-header">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Total Needs</h3>
          </div>
          <div class="card-value">${{ summary.totalNeeds.toFixed(2) }}</div>
          <div class="card-subtext">Paid: ${{ summary.needsPaid.toFixed(2) }}</div>
        </div>
        
        <div class="card wants-card">
          <div class="card-header">
            <i class="fas fa-heart"></i>
            <h3>Total Wants</h3>
          </div>
          <div class="card-value">${{ summary.totalWants.toFixed(2) }}</div>
          <div class="card-subtext">Saved: ${{ summary.wantsSaved.toFixed(2) }}</div>
        </div>
        
        <div class="card remaining-card" :class="{ 'negative': summary.remainingBudget < 0 }">
          <div class="card-header">
            <i class="fas fa-piggy-bank"></i>
            <h3>Remaining</h3>
          </div>
          <div class="card-value">${{ summary.remainingBudget.toFixed(2) }}</div>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-if="recentItems.length === 0" class="no-activity">
            <i class="fas fa-inbox"></i>
            <p>No recent activity</p>
          </div>
          <div v-else v-for="item in recentItems" :key="item.id" class="activity-item">
            <div class="activity-icon" :class="item.type">
              <i :class="getIconClass(item.type)"></i>
            </div>
            <div class="activity-content">
              <h4>{{ item.name }}</h4>
              <p>${{ item.amount.toFixed(2) }} - {{ formatDate(item.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Add-Transaction Button -->
      <button class="fab" :class="{ open: showTransactionForm }" @click="toggleForm">
        <i class="fas fa-plus"></i>
      </button>

      <!-- QuickTransaction component appears when toggled -->
      <Transaction
            v-if="showTransactionForm"
            @close="showTransactionForm = false"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useFinanceStore } from '@/stores/finance'
  import type { Budget, Need, Want } from '@/types'
  import Transaction from './Transactions.vue'
  
  const store = useFinanceStore()
  const showTransactionForm = ref(false)
  const toggleForm = () => {
  showTransactionForm.value = !showTransactionForm.value
    }
  
  const summary = computed(() => store.summary)
  
  const recentItems = computed(() => {
    const allItems: (Budget & { type: 'budget' })[] = store.budgets.map(b => ({ ...b, type: 'budget' as const }))
    const allNeeds: (Need & { type: 'need' })[] = store.needs.map(n => ({ ...n, type: 'need' as const }))
    const allWants: (Want & { type: 'want' })[] = store.wants.map(w => ({ ...w, type: 'want' as const }))
    
    const combined = [...allItems, ...allNeeds, ...allWants]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    return combined
  })
  
  

  const getIconClass = (type: string) => {
    switch (type) {
      case 'budget': return 'fas fa-calculator'
      case 'need': return 'fas fa-exclamation-triangle'
      case 'want': return 'fas fa-heart'
      default: return 'fas fa-circle'
    }
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
  .dashboard h1 {
    margin-bottom: 2rem;
    color: #2c3e50;
  }
  
  .summary-cards {
    flex-wrap: wrap;
    display: flex;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    border-left: 4px solid #3498db;
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .card-header i {
    font-size: 1.5rem;
    color: #7f8c8d;
  }
  
  .card-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 1rem;
  }
  
  .card-value {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }
  
  .card-subtext {
    color: #7f8c8d;
    font-size: 0.9rem;
  }
  
  .budget-card { border-left-color: #3498db; }
  .needs-card { border-left-color: #e74c3c; }
  .wants-card { border-left-color: #9b59b6; }
  .remaining-card { border-left-color: #2ecc71; }
  .remaining-card.negative { border-left-color: #e74c3c; }
  
  .recent-activity h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }
  
  .activity-list {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  
  .no-activity {
    padding: 3rem;
    text-align: center;
    color: #7f8c8d;
  }
  
  .no-activity i {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ecf0f1;
  }
  
  .activity-item:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    color: white;
  }
  
  .activity-icon.budget { background: #3498db; }
  .activity-icon.need { background: #e74c3c; }
  .activity-icon.want { background: #9b59b6; }
  
  .activity-content h4 {
    margin: 0 0 0.25rem 0;
    color: #2c3e50;
  }
  
  .activity-content p {
    margin: 0;
    color: #7f8c8d;
    font-size: 0.9rem;
  }

  /* Floating Action Button */
.fab {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 56px;
  height: 56px;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.3s ease;
}
.fab.open {
  transform: rotate(45deg);
}
  </style>