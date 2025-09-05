import Dashboard from '@/views/Dashboard.vue'
import Budget from '@/views/Budget.vue'
import Needs from '@/views/Needs.vue'
import Wants from '@/views/Wants.vue'

export default [
  { path: '/', component: Dashboard },
  { path: '/budget', component: Budget },
  { path: '/needs', component: Needs },
  { path: '/wants', component: Wants }
]
