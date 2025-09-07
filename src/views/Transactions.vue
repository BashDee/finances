<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <!-- Close icon -->
      <button class="close-button" type="button" @click="$emit('close')">
        &times;
      </button>
      <form @submit.prevent="addTransaction">
        <div class="form-grid">
          <div class="form-group">
            <label for="type">Type</label><br />
            <select id="transactionType" v-model="transactionForm.transaction_type" required>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div class="form-group">
            <label for="amount">Amount</label>
            <input type="number" id="transactionAmount"
                  v-model.number="transactionForm.amount"
                   step="1" min="0" required />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <input v-model="transactionForm.description" type="text" id="transactionDescription" required />
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <select v-model="transactionForm.category" id="transactionCategory" required>
              <option value="">Select Category</option>
              <optgroup label="Income">
                <option value="salary">Salary</option>
              </optgroup>
              <optgroup label="Expenses">
                <option value="food">Food & Dining</option>
                <option value="other-expense">Other Expense</option>
              </optgroup>
            </select>
          </div>
      
          <div class="form-group">
            <label for="transactionDate">Transaction Date</label>
            <input v-model="transactionForm.transaction_date" type="date" id="transactionDate" required />
          </div>

          <div class="form-group">
            <label for="notes">Notes (Optional)</label>
            <input v-model="transactionForm.note" type="text" id="transactionNotes" />
          </div>
        </div>
        <!-- status message -->
        <div v-if="transactionMessage" class="message"
             :class="transactionMessage.type">
          <i :class="transactionMessage.type === 'success'
                      ? 'fas fa-check' : 'fas fa-exclamation-triangle'"></i>
          {{ transactionMessage.text }}
        </div>
        <!-- Actions -->
        <div class="button-group">
          <button type="submit" class="btn btn-success">
            Submit
          </button>
          <button type="button" class="btn btn-cancel" @click="resetForm">
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useFinanceStore } from '@/stores/finance'
  
  const store = useFinanceStore()
  const loading = ref(false)
  const transactionMessage = ref<{ type: 'success'|'error'; text: string }|null>(null)
  
  const transactionForm = reactive({
    transaction_type: 'expense' as 'income'|'expense',
    amount: 0,
    description: '',
    category_id: 1,
    transaction_date: new Date().toISOString().split('T')[0],
    note: ''
  })
  


  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const addTransaction = async () => {
    loading.value = true
    transactionMessage.value = null

  // Validate required fields
  if (!transactionForm.amount || !transactionForm.description || !transactionForm.category_id) {
    transactionMessage.value = { type: 'error', text: 'Please fill all required fields.' }
    loading.value = false
    return
  }

  try {
    const payload = {
      user_id: 1, // TODO: replace with actual logged-in user
      ...transactionForm,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const res = await fetch(`${API_URL}/api/v1/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    let data
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (!res.ok) {
      throw new Error(data?.message || res.statusText)
    }

    transactionMessage.value = { type: 'success', text: 'Transaction added successfully!' }
    resetForm()
  } catch (err: any) {
    transactionMessage.value = { type: 'error', text: 'Failed to add. ' + (err?.message || '') }
  } finally {
    loading.value = false
  }
}

  
  const resetForm = () => {
    Object.assign(transactionForm, {
      transaction_type: 'expense',
      amount: 0,
      description: '',
      category_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      note: ''
    })
    transactionMessage.value = null
  }
  const fetchCategory = async () => {
    try {
    } catch {
    }
    onMounted(async () => {
    await fetchCategory()
  })
  }
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 600px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 4px;
  font-weight: 500;
}

.form-group input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-group {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-cancel {
  background-color: #dc3545;
  color: #fff;
}
.message {
    display: flex; align-items: center; gap: .5rem;
    margin-bottom: 1rem; padding: 1rem; border-radius: 4px;
  }
  .message.success {
    background: #d4edda; color: #155724; border-left: 4px solid #28a745;
  }
  .message.error {
    background: #f8d7da; color: #721c24; border-left: 4px solid #dc3545;
  }
</style>
