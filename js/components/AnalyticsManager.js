class AnalyticsManager {
    static initialize() {
        this.loadData();
        this.setupCharts();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="analytics-page">
                <header class="page-header">
                    <h1>Analyses & Marges</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="Analytics.exportReport()">
                            Exporter le rapport
                        </button>
                    </div>
                </header>

                <!-- KPI Cards -->
                <div class="kpi-container">
                    ${this.renderKPICards()}
                </div>

                <!-- Charts -->
                <div class="charts-container">
                    <div class="chart-card">
                        <h3>Analyse des marges par catégorie</h3>
                        <canvas id="marginChart"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Top 10 produits rentables</h3>
                        <canvas id="topProductsChart"></canvas>
                    </div>
                </div>

                <!-- Detailed Analysis -->
                <div class="analysis-table card">
                    <h3>Analyse détaillée</h3>
                    <table id="analysisTable">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Prix HT</th>
                                <th>TVA</th>
                                <th>Prix TTC</th>
                                <th>Coût</th>
                                <th>Marge €</th>
                                <th>Marge %</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Filled dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    static renderKPICards() {
        return `
            <div class="kpi-card">
                <h4>Marge moyenne</h4>
                <div class="kpi-value" id="averageMargin">---%</div>
            </div>
            <div class="kpi-card">
                <h4>Valeur du stock</h4>
                <div class="kpi-value" id="stockValue">--- €</div>
            </div>
            <div class="kpi-card">
                <h4>Produits en stock</h4>
                <div class="kpi-value" id="productCount">---</div>
            </div>
        `;
    }

    static async loadData() {
        const products = await DATABASE.products.getAll();
        const ingredients = await DATABASE.ingredients.getAll();

        this.updateKPIs(products, ingredients);
        this.updateCharts(products);
        this.updateAnalysisTable(products);
    }

    static updateKPIs(products, ingredients) {
        const averageMargin = Calculations.calculateAverageMargin(products);
        const stockValue = Calculations.calculateStockValue(ingredients);

        document.getElementById('averageMargin').textContent = 
            Calculations.formatPercent(averageMargin);
        document.getElementById('stockValue').textContent = 
            Calculations.formatCurrency(stockValue);
        document.getElementById('productCount').textContent = 
            products.length.toString();
    }

    // ... autres méthodes
} 