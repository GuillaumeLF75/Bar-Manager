<template>
  <div class="app">
    <nav class="sidebar">
      <h1>Bar Manager</h1>
      <router-link to="/">🏠 Accueil</router-link>
      <router-link to="/ingredients">🧂 Ingrédients</router-link>
      <router-link to="/cocktails">🍸 Cocktails</router-link>
      <router-link to="/food">🍽️ Snacks</router-link>
      <router-link to="/orders">📝 Commandes</router-link>
      <router-link to="/statistics">📊 Statistiques</router-link>
    </nav>
    <main class="content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 250px;
  background: var(--surface);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.router-link-active {
  background: var(--primary-container);
  color: var(--primary);
}
</style> 