// main.js
// ==========
// Annule et remplace tout le contenu précédent du fichier.

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/main.css';
import './assets/styles/components.css';
import './assets/styles/sidebar.css';
import './assets/styles/forms.css';
// Si tu veux utiliser des managers (ex. FoodManager), importe-les aussi :
// import FoodManager from './components/FoodManager.js';
// import CocktailsManager from './components/CocktailsManager.js';
// etc.

// 1) Définir la route "/" (page d'accueil ou dashboard)
router.addRoute('/', () => `
  <div class="dashboard">
    <h1>Tableau de bord</h1>
    <p>Ceci est l'accueil de mon application.</p>
  </div>
`);

// 2) Exemple de route "food" : on initialise le manager FoodManager avant de retourner son template
router.addRoute('/food', () => {
  // FoodManager.initialize();      // Décommente si tu as vraiment un FoodManager
  // return FoodManager.getTemplate();
  return `
    <h2>Food</h2>
    <p>Contenu de la page Food</p>
  `;
});

// 3) Autres routes possibles (à toi d'ajouter les managers et templates voulus)
// router.addRoute('/cocktails', () => {
//   CocktailsManager.initialize();
//   return CocktailsManager.getTemplate();
// });

// 4) Navigation initiale (affiche la route "/")
router.navigate('/');

const app = createApp(App);
app.use(router);
app.mount('#app');