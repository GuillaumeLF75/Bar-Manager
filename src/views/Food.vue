<template>
  <div class="food">
    <header class="page-header">
      <h1>Gestion des snacks</h1>
      <button @click="showAddModal" class="btn primary">+ Nouveau snack</button>
    </header>

    <div class="food-list">
      <div v-if="foodItems.length === 0" class="empty-state">
        <h3>🍽️ Aucun snack</h3>
        <p>Commencez par ajouter des snacks à votre carte !</p>
      </div>
      
      <div v-else class="food-grid">
        <div v-for="item in foodItems" :key="item.id" class="food-card">
          <div class="food-header">
            <h3>{{ item.name }}</h3>
            <span class="price">{{ item.price }}€</span>
          </div>
          <div class="ingredients-list">
            <h4>Ingrédients :</h4>
            <ul>
              <li v-for="ing in item.ingredients" :key="ing.id">
                {{ ing.quantity }}{{ ing.unit }} {{ ing.name }}
              </li>
            </ul>
          </div>
          <div class="cost-info">
            <p>Coût : {{ item.cost }}€</p>
            <p>Marge : {{ calculateMargin(item) }}%</p>
          </div>
          <div class="actions">
            <button @click="editFood(item)" class="btn">✏️ Modifier</button>
            <button @click="deleteFood(item.id)" class="btn danger">🗑️ Supprimer</button>
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
      foodItems: []
    }
  },
  methods: {
    calculateMargin(item) {
      return ((item.price - item.cost) / item.price * 100).toFixed(1)
    },
    showAddModal() {
      // Logic pour afficher le modal d'ajout
    },
    editFood(item) {
      // Logic pour éditer
    },
    deleteFood(id) {
      // Logic pour supprimer
    }
  }
}
</script> 