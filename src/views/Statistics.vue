<template>
  <div class="statistics">
    <header class="page-header">
      <h1>Statistiques</h1>
      <div class="period-selector">
        <button 
          v-for="period in periods" 
          :key="period"
          :class="['period-btn', { active: selectedPeriod === period }]"
          @click="selectedPeriod = period"
        >
          {{ period }}
        </button>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Chiffre d'affaires</h3>
        <div class="stat-value">{{ revenue }}€</div>
        <div class="stat-trend" :class="revenueTrend > 0 ? 'up' : 'down'">
          {{ revenueTrend }}% vs période précédente
        </div>
      </div>

      <div class="stat-card">
        <h3>Nombre de commandes</h3>
        <div class="stat-value">{{ orderCount }}</div>
        <div class="stat-trend" :class="orderTrend > 0 ? 'up' : 'down'">
          {{ orderTrend }}% vs période précédente
        </div>
      </div>

      <div class="stat-card">
        <h3>Panier moyen</h3>
        <div class="stat-value">{{ averageOrder }}€</div>
      </div>
    </div>

    <div class="charts-section">
      <div class="chart">
        <h3>Ventes par catégorie</h3>
        <!-- Intégrer un composant de graphique ici -->
      </div>

      <div class="chart">
        <h3>Produits les plus vendus</h3>
        <div class="top-products">
          <div v-for="product in topProducts" :key="product.id" class="product-stat">
            <span class="product-name">{{ product.name }}</span>
            <span class="product-sales">{{ product.sales }} ventes</span>
            <div class="sales-bar" :style="{ width: (product.sales / maxSales * 100) + '%' }"></div>
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
      periods: ['Jour', 'Semaine', 'Mois', 'Année'],
      selectedPeriod: 'Jour',
      revenue: 0,
      revenueTrend: 0,
      orderCount: 0,
      orderTrend: 0,
      averageOrder: 0,
      topProducts: []
    }
  },
  computed: {
    maxSales() {
      return Math.max(...this.topProducts.map(p => p.sales))
    }
  },
  methods: {
    fetchStatistics() {
      // Logic pour récupérer les statistiques
    }
  },
  mounted() {
    this.fetchStatistics()
  }
}
</script> 