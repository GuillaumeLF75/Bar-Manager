class DishesManager {
    static initialize() {
        this.loadDishes();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="dishes-page">
                <header class="page-header">
                    <h1>Gestion des plats</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="DishesManager.showNewDishModal()">
                            + Nouveau plat
                        </button>
                    </div>
                </header>
                
                <div class="empty-state">
                    🍽️ La gestion des plats sera bientôt disponible !
                </div>
            </div>
        `;
    }

    static loadDishes() {
        // TODO: Implémenter la gestion des plats
        console.log('Loading dishes...');
    }

    static setupEventListeners() {
        // Les event listeners seront ajoutés plus tard
    }
}

window.DishesManager = DishesManager; 