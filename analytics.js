class Analytics {
    static async initialize() {
        this.setupCharts();
        this.loadData();
        this.setupEventListeners();
    }

    static setupCharts() {
        // Configuration des graphiques avec Chart.js
        this.setupMarginChart();
        this.setupCostAnalysisChart();
        this.setupTopProductsChart();
    }

    static async loadData() {
        const data = await this.calculateAnalytics();
        this.updateDashboard(data);
    }

    static async calculateAnalytics() {
        const menuItems = DATABASE.menu.getAll('cocktails');
        const stockItems = DATABASE.stock.getAll();

        return {
            averageMargin: this.calculateAverageMargin(menuItems),
            averageCost: this.calculateAverageCost(menuItems),
            stockValue: this.calculateStockValue(stockItems),
            costByCategory: this.analyzeCostsByCategory(menuItems),
            topProducts: this.analyzeTopProducts(menuItems)
        };
    }

    static updateDashboard(data) {
        // Mise à jour des KPIs
        document.querySelector('#marginChart').textContent = `${data.averageMargin.toFixed(1)}%`;
        document.querySelector('#costChart').textContent = `€${data.averageCost.toFixed(2)}`;
        document.querySelector('#stockChart').textContent = `€${data.stockValue.toFixed(2)}`;

        // Mise à jour des graphiques
        this.updateCostAnalysisChart(data.costByCategory);
        this.updateTopProductsChart(data.topProducts);
        this.updateAnalysisTable(data.topProducts);
    }

    static setupEventListeners() {
        // Période
        document.querySelector('#costPeriod').addEventListener('change', (e) => {
            this.updateCostAnalysisChart(e.target.value);
        });

        // Toggle vue
        document.querySelectorAll('.chart-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.updateTopProductsChart(e.target.dataset.view);
            });
        });

        // Export
        document.querySelector('.export-btn').addEventListener('click', () => {
            this.exportAnalytics();
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => Analytics.initialize()); 