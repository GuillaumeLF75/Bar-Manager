class Router {
    static currentRoute = 'home';
    static routes = {
        'home': HomeManager,
        'ingredients': IngredientsManager,
        'cocktails': CocktailsManager,
        'orders': OrdersManager,
        'stats': StatsManager,
        'notfound': NotFoundManager
    };

    static initialize() {
        console.log('Router initializing...');
        
        // Gérer le changement de hash dans l'URL
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Gérer la route initiale
        this.handleRoute();
        
        console.log('Router initialized');
    }

    static handleRoute() {
        // Récupérer la route depuis le hash de l'URL
        let route = window.location.hash.slice(1) || 'home';
        console.log('Handling route:', route);

        // Trouver le composant correspondant
        const component = this.getComponent(route);
        
        if (!component) {
            console.warn('Route not found:', route);
            route = 'notfound';
        }

        // Mettre à jour la navigation
        this.updateNavigation(route);
        
        // Initialiser et afficher le composant
        this.renderComponent(component);
    }

    static getComponent(route) {
        return this.routes[route];
    }

    static updateNavigation(route) {
        // Mettre à jour la classe active dans la navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.route === route);
        });
    }

    static renderComponent(component) {
        const app = document.getElementById('app');
        if (!app) return;

        try {
            // Initialiser le composant
            if (component && typeof component.initialize === 'function') {
                component.initialize();
            }

            // Récupérer et afficher le template
            if (component && typeof component.getTemplate === 'function') {
                app.innerHTML = component.getTemplate();
            } else {
                console.error('Component missing getTemplate method');
                app.innerHTML = NotFoundManager.getTemplate();
            }
        } catch (error) {
            console.error('Error rendering component:', error);
            app.innerHTML = `
                <div class="error-page">
                    <h1>🚨 Une erreur est survenue</h1>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    static refreshPage() {
        this.handleRoute();
    }
}

window.Router = Router;

// Rendre le Router disponible globalement
console.log('📦 Router loaded');

// Vérifier que le Router est bien défini
console.log('Router loaded:', typeof Router);

// Initialize router with routes
const router = new Router();

// Add routes
router.addRoute('/', () => `
    <div class="dashboard">
        <h1>Tableau de bord</h1>
        <!-- Dashboard content -->
    </div>
`);

router.addRoute('/ingredients', () => `
    <div class="ingredients-page">
        <h1>Gestion des ingrédients</h1>
        <!-- Ingredients content -->
    </div>
`);

// Add more routes...

// Initialize with current path
router.navigate(window.location.pathname); 