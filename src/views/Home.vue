<template>
  <div class="home">
    <h1>Bienvenue sur Bar Manager</h1>
    <div class="dashboard">
      <div class="quick-access">
        <router-link to="/ingredients" class="card">
          <h2>🧂 Ingrédients</h2>
          <p>Gérer vos ingrédients et stocks</p>
        </router-link>
        <router-link to="/cocktails" class="card">
          <h2>🍸 Cocktails</h2>
          <p>Créer et gérer vos cocktails</p>
        </router-link>
        <router-link to="/food" class="card">
          <h2>🍽️ Snacks</h2>
          <p>Gérer votre menu de snacks</p>
        </router-link>
        <router-link to="/orders" class="card">
          <h2>📝 Commandes</h2>
          <p>Suivre vos commandes</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  margin-top: 2rem;
}

.quick-access {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.card {
  background: var(--surface);
  padding: 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-4px);
}
</style> 