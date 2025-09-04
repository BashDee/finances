export interface Budget {
  id: string
  name: string
  amount: number
  category: string
  period: 'weekly' | 'monthly' | 'yearly'
  createdAt: Date
  updatedAt: Date
}

export interface Need {
  id: string
  name: string
  amount: number
  category: 'housing' | 'food' | 'transportation' | 'utilities' | 'healthcare' | 'insurance' | 'other'
  priority: 'high' | 'medium' | 'low'
  dueDate?: Date
  isPaid: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Want {
  id: string
  name: string
  amount: number
  category: 'entertainment' | 'shopping' | 'dining' | 'travel' | 'hobbies' | 'other'
  priority: 'high' | 'medium' | 'low'
  targetDate?: Date
  isSaved: boolean
  savedAmount: number
  createdAt: Date
  updatedAt: Date
}

export interface Summary {
  totalBudget: number
  totalNeeds: number
  totalWants: number
  remainingBudget: number
  needsPaid: number
  wantsSaved: number
}
