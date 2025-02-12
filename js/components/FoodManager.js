class FoodManager {
    static foods = [];
    static ingredients = [];
    static viewMode = 'grid';

    static initialize() {
        this.viewMode = localStorage.getItem('foodViewMode') || 'grid';
        this.loadData();
    }

    static loadData() {
        this.foods = DATABASE.foods.getAll() || [];
        this.ingredients = DATABASE.ingredients.getAll() || [];
    }

    static getTemplate() {
        return `
            <div class="food-page">
                <header class="page-header">
                    <div class="header-main">
                        <h1>Plats & Snacks</h1>
                        <button class="btn btn-primary" onclick="FoodManager.showAddModal()">
                            + Nouveau plat
                        </button>
                    </div>
                    <div class="view-controls">
                        <button class="btn ${this.viewMode === 'grid' ? 'active' : ''}" 
                                onclick="FoodManager.setViewMode('grid')">
                            📱 Mosaïque
                        </button>
                        <button class="btn ${this.viewMode === 'list' ? 'active' : ''}" 
                                onclick="FoodManager.setViewMode('list')">
                            📋 Liste
                        </button>
                    </div>
                </header>

                <div class="food-container ${this.viewMode}">
                    ${this.renderFoods()}
                </div>

                <div id="addFoodModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouveau plat</h2>
                        <form id="foodForm" onsubmit="FoodManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Nom</label>
                                <input type="text" id="foodName" required>
                            </div>
                            <div class="form-group">
                                <label>Prix de vente (€)</label>
                                <input type="number" id="sellingPrice" step="0.01" required 
                                       onchange="FoodManager.updateCostSummary()">
                            </div>
                            
                            <div class="form-group">
                                <label>Ingrédients</label>
                                <div id="ingredientsList">
                                    ${this.renderIngredientRow()}
                                </div>
                                <button type="button" class="btn" onclick="FoodManager.addIngredientRow()">
                                    + Ajouter un ingrédient
                                </button>
                            </div>

                            <div class="cost-summary" id="costSummary">
                                <h4>Résumé</h4>
                                <p>Coût total: 0.00€</p>
                                <p>Prix de vente: 0.00€</p>
                                <p>Marge: 0%</p>
                            </div>

                            <div class="modal-actions">
                                <button type="button" class="btn" onclick="UI.hideModal('addFoodModal')">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Créer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static renderFoods() {
        if (!this.foods.length) {
            return `
                <div class="empty-state">
                    <h3>🍽️ Aucun plat</h3>
                    <p>Commencez par ajouter des plats à votre menu !</p>
                </div>
            `;
        }

        return this.foods.map(food => `
            <div class="food-card">
                <div class="food-header">
                    <h3>${food.name}</h3>
                    <span class="price">${food.sellingPrice.toFixed(2)}€</span>
                </div>
                
                <div class="ingredients-list">
                    <h4>Ingrédients :</h4>
                    ${food.ingredients.map(ing => `
                        <p>${ing.quantity} ${ing.unit} ${ing.name}</p>
                    `).join('')}
                </div>

                <div class="cost-info">
                    <p>Coût total: ${food.totalCost.toFixed(2)}€</p>
                    <p>Marge: ${this.calculateMargin(food.sellingPrice, food.totalCost)}%</p>
                </div>

                <div class="food-actions">
                    <button class="btn" onclick="FoodManager.editFood('${food.id}')">
                        ✏️ Modifier
                    </button>
                    <button class="btn btn-danger" onclick="FoodManager.deleteFood('${food.id}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ... Copier les autres méthodes de CocktailsManager en remplaçant "cocktail" par "food" ...
}

window.FoodManager = FoodManager; 