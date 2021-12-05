import Vue from 'vue'
import VueRouter from 'vue-router'
import Account from '../views/Account.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Account',
    component: Account
  },
]

const router = new VueRouter({
  routes
})

export default router
