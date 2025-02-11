class CostsManager {
    static initialize() {
        this.loadData();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="costs-page">
                <header class="page-header">
                    <h1>Coûts et marges</h1>
                </header>

                <div class="costs-grid">
                    <!-- Carte des coûts globaux -->
                    <div class="cost-card summary-card">
                        <h2>Résumé global</h2>
                        <div class="cost-details">
                            <div class="detail-row">
                                <span>Coût total des stocks</span>
                                <span>${this.calculateTotalStockCost()}</span>
                            </div>
                            <div class="detail-row">
                                <span>Marge moyenne</span>
                                <span>${this.calculateAverageMargin()}%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Carte des cocktails -->
                    <div class="cost-card">
                        <h2>Cocktails</h2>
                        <div class="cost-details">
                            ${this.renderCocktailsCosts()}
                        </div>
                    </div>

                    <!-- Carte des plats -->
                    <div class="cost-card">
                        <h2>Plats</h2>
                        <div class="cost-details">
                            ${this.renderDishesCosts()}
                        </div>
                    </div>

                    <!-- Carte des paramètres -->
                    <div class="cost-card settings-card">
                        <h2>Paramètres de marge</h2>
                        <form id="marginSettings" onsubmit="CostsManager.saveSettings(event)">
                            <div class="form-group">
                                <label for="defaultMargin">Marge par défaut (%)</label>
                                <input type="number" id="defaultMargin" 
                                       value="${this.getSettings().defaultMargin}" 
                                       min="0" max="1000" step="5">
                            </div>
                            <div class="form-group">
                                <label for="cocktailMargin">Marge cocktails (%)</label>
                                <input type="number" id="cocktailMargin" 
                                       value="${this.getSettings().cocktailMargin}" 
                                       min="0" max="1000" step="5">
                            </div>
                            <div class="form-group">
                                <label for="dishMargin">Marge plats (%)</label>
                                <input type="number" id="dishMargin" 
                                       value="${this.getSettings().dishMargin}" 
                                       min="0" max="1000" step="5">
                            </div>
                            <button type="submit" class="btn btn-primary">
                                Sauvegarder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static calculateTotalStockCost() {
        const ingredients = DATABASE.ingredients.getAll();
        const total = ingredients.reduce((sum, ing) => {
            return sum + (ing.price * ing.stock);
        }, 0);
        return Calculations.formatCurrency(total);
    }

    static calculateAverageMargin() {
        const settings = this.getSettings();
        const avg = (settings.defaultMargin + settings.cocktailMargin + settings.dishMargin) / 3;
        return avg.toFixed(1);
    }

    static renderCocktailsCosts() {
        // TODO: Implémenter quand nous aurons la gestion des cocktails
        return `<div class="empty-state">Les cocktails seront affichés ici</div>`;
    }

    static renderDishesCosts() {
        // TODO: Implémenter quand nous aurons la gestion des plats
        return `<div class="empty-state">Les plats seront affichés ici</div>`;
    }

    static getSettings() {
        const defaultSettings = {
            defaultMargin: 200,
            cocktailMargin: 250,
            dishMargin: 180
        };

        const saved = localStorage.getItem('marginSettings');
        return saved ? JSON.parse(saved) : defaultSettings;
    }

    static saveSettings(event) {
        event.preventDefault();
        const settings = {
            defaultMargin: parseFloat(document.getElementById('defaultMargin').value),
            cocktailMargin: parseFloat(document.getElementById('cocktailMargin').value),
            dishMargin: parseFloat(document.getElementById('dishMargin').value)
        };

        localStorage.setItem('marginSettings', JSON.stringify(settings));
        UI.showToast('Paramètres sauvegardés', 'success');
    }

    static loadData() {
        // Pour l'instant, nous n'avons que les paramètres à charger
        this.getSettings();
    }

    static setupEventListeners() {
        // Les event listeners sont gérés via les attributs onsubmit dans le template
    }
}

window.CostsManager = CostsManager; 