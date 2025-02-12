<template>
  <div class="cocktails">
    <header class="page-header">
      <h1>Gestion des cocktails</h1>
      <button @click="showAddModal" class="btn primary">+ Nouveau cocktail</button>
    </header>

    <div class="cocktails-list">
      <div v-if="cocktails.length === 0" class="empty-state">
        <h3>🍸 Aucun cocktail</h3>
        <p>Commencez par ajouter des cocktails à votre carte !</p>
      </div>
      
      <div v-else class="cocktail-grid">
        <div v-for="cocktail in cocktails" :key="cocktail.id" class="cocktail-card">
          <div class="cocktail-header">
            <h3>{{ cocktail.name }}</h3>
            <span class="price">{{ cocktail.price }}€</span>
          </div>
          <div class="ingredients-list">
            <h4>Ingrédients :</h4>
            <ul>
              <li v-for="ing in cocktail.ingredients" :key="ing.id">
                {{ ing.quantity }}{{ ing.unit }} {{ ing.name }}
              </li>
            </ul>
          </div>
          <div class="cost-info">
            <p>Coût : {{ cocktail.cost }}€</p>
            <p>Marge : {{ calculateMargin(cocktail) }}%</p>
          </div>
          <div class="actions">
            <button @click="editCocktail(cocktail)" class="btn">✏️ Modifier</button>
            <button @click="deleteCocktail(cocktail.id)" class="btn danger">🗑️ Supprimer</button>
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
      cocktails: []
    }
  },
  methods: {
    calculateMargin(cocktail) {
      return ((cocktail.price - cocktail.cost) / cocktail.price * 100).toFixed(1)
    },
    showAddModal() {
      // Logic pour afficher le modal d'ajout
    },
    editCocktail(cocktail) {
      // Logic pour éditer
    },
    deleteCocktail(id) {
      // Logic pour supprimer
    }
  }
}
</script> 