import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Budget, Need, Want, Summary } from '@/types'

export const useFinanceStore = defineStore('finance', () => {
  const budgets = ref<Budget[]>([])
  const needs = ref<Need[]>([])
  const wants = ref<Want[]>([])

  // Computed summary
  const summary = computed<Summary>(() => {
    const totalBudget = budgets.value.reduce((sum, budget) => sum + budget.amount, 0)
    const totalNeeds = needs.value.reduce((sum, need) => sum + need.amount, 0)
    const totalWants = wants.value.reduce((sum, want) => sum + want.amount, 0)
    const needsPaid = needs.value.filter(need => need.isPaid).reduce((sum, need) => sum + need.amount, 0)
    const wantsSaved = wants.value.reduce((sum, want) => sum + want.savedAmount, 0)

    return {
      totalBudget,
      totalNeeds,
      totalWants,
      remainingBudget: totalBudget - totalNeeds - totalWants,
      needsPaid,
      wantsSaved
    }
  })

  // Budget actions
  const addBudget = (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    budgets.value.push(newBudget)
  }

  const updateBudget = (id: string, updates: Partial<Omit<Budget, 'id' | 'createdAt'>>) => {
    const index = budgets.value.findIndex(b => b.id === id)
    if (index !== -1) {
      budgets.value[index] = { ...budgets.value[index], ...updates, updatedAt: new Date() }
    }
  }

  const deleteBudget = (id: string) => {
    budgets.value = budgets.value.filter(b => b.id !== id)
  }

  // Needs actions
  const addNeed = (need: Omit<Need, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNeed: Need = {
      ...need,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    needs.value.push(newNeed)
  }

  const updateNeed = (id: string, updates: Partial<Omit<Need, 'id' | 'createdAt'>>) => {
    const index = needs.value.findIndex(n => n.id === id)
    if (index !== -1) {
      needs.value[index] = { ...needs.value[index], ...updates, updatedAt: new Date() }
    }
  }

  const deleteNeed = (id: string) => {
    needs.value = needs.value.filter(n => n.id !== id)
  }

  // Wants actions
  const addWant = (want: Omit<Want, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newWant: Want = {
      ...want,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    wants.value.push(newWant)
  }

  const updateWant = (id: string, updates: Partial<Omit<Want, 'id' | 'createdAt'>>) => {
    const index = wants.value.findIndex(w => w.id === id)
    if (index !== -1) {
      wants.value[index] = { ...wants.value[index], ...updates, updatedAt: new Date() }
    }
  }

  const deleteWant = (id: string) => {
    wants.value = wants.value.filter(w => w.id !== id)
  }

  return {
    budgets,
    needs,
    wants,
    summary,
    addBudget,
    updateBudget,
    deleteBudget,
    addNeed,
    updateNeed,
    deleteNeed,
    addWant,
    updateWant,
    deleteWant
  }
})
