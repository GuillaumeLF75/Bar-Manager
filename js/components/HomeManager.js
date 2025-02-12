class HomeManager {
    static initialize() {
        console.log('HomeManager initialized');
    }

    static getTemplate() {
        return `
            <div class="dashboard">
                <h1>Tableau de bord</h1>
                
                <div class="welcome-card">
                    <h2>👋 Bienvenue sur Bar Manager</h2>
                    <p>Gérez votre établissement en toute simplicité.</p>
                </div>

                <div class="quick-access-grid">
                    <a href="#ingredients" class="quick-access-card">
                        <span class="icon">🧂</span>
                        <h3>Ingrédients</h3>
                        <p>Gérer vos ingrédients</p>
                    </a>

                    <a href="#cocktails" class="quick-access-card">
                        <span class="icon">🍸</span>
                        <h3>Cocktails</h3>
                        <p>Gérer vos cocktails</p>
                    </a>

                    <a href="#food" class="quick-access-card">
                        <span class="icon">🍽️</span>
                        <h3>Plats & Snacks</h3>
                        <p>Gérer votre menu</p>
                    </a>

                    <a href="#orders" class="quick-access-card">
                        <span class="icon">📝</span>
                        <h3>Commandes</h3>
                        <p>Voir les commandes</p>
                    </a>
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