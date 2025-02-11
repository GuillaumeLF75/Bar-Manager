class DishesManager {
    static initialize() {
        console.log('DishesManager initializing...');
        this.loadDishes();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="dishes-page">
                <header class="page-header">
                    <h1>Gestion des plats</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="DishesManager.showAddModal()">
                            + Nouveau plat
                        </button>
                    </div>
                </header>
                
                <div class="dishes-grid">
                    ${this.renderDishes()}
                </div>
            </div>
        `;
    }

    static loadDishes() {
        // Pour l'instant, on utilise des données statiques
        this.dishes = [];
    }

    static renderDishes() {
        if (this.dishes.length === 0) {
            return `
                <div class="empty-state">
                    🍽️ Aucun plat pour le moment. Commencez par en ajouter un !
                </div>
            `;
        }
        
        return this.dishes.map(dish => `
            <div class="dish-card">
                <h3>${dish.name}</h3>
                <p class="price">${dish.price}€</p>
            </div>
        `).join('');
    }

    static setupEventListeners() {
        // Les event listeners seront gérés via les attributs onclick dans le template
    }
}

window.DishesManager = DishesManager; 