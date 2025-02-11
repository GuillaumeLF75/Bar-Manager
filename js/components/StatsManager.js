class StatsManager {
    static orders = [];
    static ingredients = [];

    static initialize() {
        console.log('StatsManager initialized');
        this.loadData();
        this.setupEventListeners();
    }

    static getTemplate() {
        // S'assurer que les données sont chargées
        if (!this.orders) this.orders = [];
        if (!this.ingredients) this.ingredients = [];

        return `
            <div class="stats-page">
                <header class="page-header">
                    <h1>Statistiques</h1>
                </header>
                
                <div class="stats-grid">
                    <div class="stats-card">
                        <h3>📊 Chiffres clés</h3>
                        <div class="stats-content">
                            <div class="stat-item">
                                <label>Commandes totales</label>
                                <span>${this.orders.length}</span>
                            </div>
                            <div class="stat-item">
                                <label>Ingrédients en stock</label>
                                <span>${this.ingredients.length}</span>
                            </div>
                            <div class="stat-item">
                                <label>Chiffre d'affaires</label>
                                <span>${this.calculateTotalRevenue()}€</span>
                            </div>
                        </div>
                    </div>

                    <div class="stats-card">
                        <h3>⚠️ Alertes stock</h3>
                        <div class="stats-content">
                            ${this.renderStockAlerts()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static calculateTotalRevenue() {
        if (!this.orders || !this.orders.length) return '0.00';
        return this.orders.reduce((total, order) => total + (order.total || 0), 0).toFixed(2);
    }

    static renderStockAlerts() {
        if (!this.ingredients || !this.ingredients.length) {
            return '<p class="empty-state">Aucun ingrédient enregistré</p>';
        }

        const alerts = this.ingredients.filter(ing => ing.stock <= ing.minStock);
        
        if (alerts.length === 0) {
            return '<p class="empty-state">✅ Tous les stocks sont corrects</p>';
        }

        return alerts.map(ing => `
            <div class="alert-item">
                <span>${ing.name}</span>
                <span class="stock-warning">
                    ${ing.stock} ${ing.unit} (min: ${ing.minStock} ${ing.unit})
                </span>
            </div>
        `).join('');
    }

    static loadData() {
        try {
            console.log('Loading stats data...');
            this.orders = DATABASE.orders.getAll() || [];
            this.ingredients = DATABASE.ingredients.getAll() || [];
            console.log('Stats data loaded:', {
                orders: this.orders,
                ingredients: this.ingredients
            });
        } catch (error) {
            console.error('Error loading stats data:', error);
            this.orders = [];
            this.ingredients = [];
        }
    }

    static setupEventListeners() {
        // Pour l'instant, pas d'event listeners nécessaires
    }
}

window.StatsManager = StatsManager; 