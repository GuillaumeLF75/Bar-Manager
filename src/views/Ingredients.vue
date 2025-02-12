<template>
  <div class="ingredients">
    <header class="page-header">
      <h1>Gestion des ingrédients</h1>
      <button @click="showAddModal" class="btn primary">+ Nouvel ingrédient</button>
    </header>

    <div class="ingredients-list">
      <div v-if="ingredients.length === 0" class="empty-state">
        <h3>🧂 Aucun ingrédient</h3>
        <p>Commencez par ajouter des ingrédients pour vos cocktails !</p>
      </div>
      
      <div v-else class="ingredient-grid">
        <div v-for="ingredient in ingredients" :key="ingredient.id" class="ingredient-card">
          <div class="ingredient-header">
            <h3>{{ ingredient.name }}</h3>
            <span class="price">{{ ingredient.price }}€/{{ ingredient.unit }}</span>
          </div>
          <div class="stock-info">
            <div class="stock-bar">
              <div class="stock-level" :style="{ width: getStockPercentage(ingredient) + '%' }"></div>
            </div>
            <span>Stock: {{ ingredient.stock }} {{ ingredient.unit }}</span>
          </div>
          <div class="actions">
            <button @click="editIngredient(ingredient)" class="btn">✏️ Modifier</button>
            <button @click="deleteIngredient(ingredient.id)" class="btn danger">🗑️ Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <div v-if="showModal" class="modal">
      <!-- Contenu du modal -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ingredients: [],
      showModal: false
    }
  },
  methods: {
    showAddModal() {
      this.showModal = true
    },
    getStockPercentage(ingredient) {
      return (ingredient.stock / ingredient.maxStock) * 100
    },
    editIngredient(ingredient) {
      // Logic pour éditer
    },
    deleteIngredient(id) {
      // Logic pour supprimer
    }
  }
}
</script> 