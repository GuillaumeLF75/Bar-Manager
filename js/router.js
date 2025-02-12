// router.js
// ==========
// Annule et remplace tout le contenu précédent du fichier.
//
// Objet router simple qui possède addRoute() et navigate().

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('./views/Home.vue')
    },
    {
        path: '/ingredients',
        name: 'Ingredients',
        component: () => import('./views/Ingredients.vue')
    },
    {
        path: '/cocktails',
        name: 'Cocktails',
        component: () => import('./views/Cocktails.vue')
    },
    {
        path: '/food',
        name: 'Food',
        component: () => import('./views/Food.vue')
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('./views/Orders.vue')
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: () => import('./views/Statistics.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;