class HomeManager {
    static initialize() {
        console.log('HomeManager initialized');
    }

    static getTemplate() {
        return `
            <div class="home-page">
                <header class="page-header">
                    <h1>Tableau de bord</h1>
                </header>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card welcome-card">
                        <h2>👋 Bienvenue sur Bar Manager</h2>
                        <p>Gérez votre établissement en toute simplicité.</p>
                    </div>
                    
                    <div class="quick-actions">
                        <a href="#ingredients" class="quick-action-card">
                            <h3>🧂 Ingrédients</h3>
                            <p>Gérer vos ingrédients</p>
                        </a>
                        <a href="#orders" class="quick-action-card">
                            <h3>📝 Commandes</h3>
                            <p>Voir les commandes</p>
                        </a>
                        <a href="#stats" class="quick-action-card">
                            <h3>📊 Statistiques</h3>
                            <p>Voir les statistiques</p>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    static getStockCount() {
        const ingredients = DATABASE.ingredients.getAll();
        return ingredients.length;
    }

    static getOrderCount() {
        const orders = DATABASE.orders.getAll();
        const today = new Date().toDateString();
        return orders.filter(order => 
            new Date(order.date).toDateString() === today
        ).length;
    }

    static getSalesTotal() {
        const orders = DATABASE.orders.getAll();
        const today = new Date().toDateString();
        return orders
            .filter(order => new Date(order.date).toDateString() === today)
            .reduce((total, order) => total + order.total, 0)
            .toFixed(2);
    }
}

window.HomeManager = HomeManager; 