<template>
  <div class="orders">
    <header class="page-header">
      <h1>Gestion des commandes</h1>
      <button @click="newOrder" class="btn primary">+ Nouvelle commande</button>
    </header>

    <div class="orders-tabs">
      <button 
        :class="['tab-btn', { active: activeTab === 'current' }]"
        @click="activeTab = 'current'"
      >
        En cours
      </button>
      <button 
        :class="['tab-btn', { active: activeTab === 'completed' }]"
        @click="activeTab = 'completed'"
      >
        Terminées
      </button>
    </div>

    <div class="orders-list">
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <h3>📝 Aucune commande</h3>
        <p>Aucune commande {{ activeTab === 'current' ? 'en cours' : 'terminée' }}</p>
      </div>
      
      <div v-else class="orders-grid">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <h3>Commande #{{ order.id }}</h3>
            <span class="status" :class="order.status">{{ order.status }}</span>
          </div>
          <div class="order-items">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <span>{{ item.quantity }}x</span>
              <span>{{ item.name }}</span>
              <span>{{ item.price }}€</span>
            </div>
          </div>
          <div class="order-total">
            <h4>Total : {{ calculateTotal(order) }}€</h4>
          </div>
          <div class="actions">
            <button 
              v-if="order.status === 'pending'"
              @click="completeOrder(order.id)" 
              class="btn success"
            >
              ✓ Terminer
            </button>
            <button @click="deleteOrder(order.id)" class="btn danger">
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      activeTab: 'current'
    }
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => 
        this.activeTab === 'current' ? order.status === 'pending' : order.status === 'completed'
      )
    }
  },
  methods: {
    calculateTotal(order) {
      return order.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    newOrder() {
      // Logic pour nouvelle commande
    },
    completeOrder(id) {
      // Logic pour terminer une commande
    },
    deleteOrder(id) {
      // Logic pour supprimer
    }
  }
}
</script> 