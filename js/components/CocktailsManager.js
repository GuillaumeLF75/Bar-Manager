class CocktailsManager {
    static cocktails = [];
    static ingredients = [];

    static initialize() {
        console.log('CocktailsManager initializing...');
        this.loadData();
    }

    static loadData() {
        console.log('Loading cocktails data...');
        this.cocktails = DATABASE.cocktails.getAll() || [];
        this.ingredients = DATABASE.ingredients.getAll() || [];
        console.log('Loaded ingredients:', this.ingredients);
    }

    static getTemplate() {
        return `
            <div class="cocktails-page">
                <header class="page-header">
                    <h1>Fiches Cocktails</h1>
                    <button class="btn btn-primary" onclick="CocktailsManager.showAddModal()">
                        + Nouveau cocktail
                    </button>
                </header>

                <div class="cocktails-grid">
                    ${this.renderCocktails()}
                </div>

                <!-- Modal d'ajout -->
                <div id="addCocktailModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouveau cocktail</h2>
                        <form id="cocktailForm" onsubmit="CocktailsManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Nom</label>
                                <input type="text" id="cocktailName" required>
                            </div>
                            <div class="form-group">
                                <label>Prix de vente (€)</label>
                                <input type="number" id="sellingPrice" step="0.01" required 
                                       onchange="CocktailsManager.updateCostSummary()">
                            </div>
                            
                            <div class="form-group">
                                <label>Ingrédients</label>
                                <div id="ingredientsList">
                                    ${this.renderIngredientRow()}
                                </div>
                                <button type="button" class="btn" onclick="CocktailsManager.addIngredientRow()">
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
                                <button type="button" class="btn" onclick="UI.hideModal('addCocktailModal')">
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

    static renderIngredientRow() {
        return `
            <div class="ingredient-row">
                <select class="ingredient-select" onchange="CocktailsManager.updateCostSummary()">
                    <option value="">Sélectionner un ingrédient</option>
                    ${this.ingredients.map(ing => `
                        <option value="${ing.id}" data-price="${ing.price}" data-unit="${ing.unit}">
                            ${ing.name} (${ing.price}€/${ing.unit})
                        </option>
                    `).join('')}
                </select>
                <input type="number" class="ingredient-quantity" 
                       placeholder="Quantité" step="0.1" 
                       onchange="CocktailsManager.updateCostSummary()">
                <button type="button" class="btn btn-danger" onclick="this.parentElement.remove(); CocktailsManager.updateCostSummary();">
                    🗑️
                </button>
            </div>
        `;
    }

    static addIngredientRow() {
        const list = document.getElementById('ingredientsList');
        if (list) {
            const div = document.createElement('div');
            div.innerHTML = this.renderIngredientRow();
            list.appendChild(div.firstElementChild);
        }
    }

    static updateCostSummary() {
        const summary = document.getElementById('costSummary');
        if (!summary) return;

        let totalCost = 0;
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;

        document.querySelectorAll('.ingredient-row').forEach(row => {
            const select = row.querySelector('.ingredient-select');
            const quantity = parseFloat(row.querySelector('.ingredient-quantity').value) || 0;
            const option = select.selectedOptions[0];
            
            if (option && option.value) {
                const price = parseFloat(option.dataset.price);
                totalCost += price * quantity;
            }
        });

        const margin = sellingPrice ? ((sellingPrice - totalCost) / sellingPrice * 100).toFixed(1) : 0;

        summary.innerHTML = `
            <h4>Résumé</h4>
            <p>Coût total: ${totalCost.toFixed(2)}€</p>
            <p>Prix de vente: ${sellingPrice.toFixed(2)}€</p>
            <p>Marge: ${margin}%</p>
        `;
    }

    static showAddModal() {
        UI.showModal('addCocktailModal');
        this.updateCostSummary();
    }

    static renderCocktails() {
        if (!this.cocktails.length) {
            return `
                <div class="empty-state">
                    🍸 Aucun cocktail. Commencez par en créer un !
                </div>
            `;
        }

        return this.cocktails.map(cocktail => `
            <div class="cocktail-card">
                <h3>${cocktail.name}</h3>
                <div class="cocktail-details">
                    <div class="price-info">
                        <p>Prix de vente: ${cocktail.sellingPrice}€</p>
                        <p>Coût: ${this.calculateCost(cocktail).toFixed(2)}€</p>
                        <p>Marge: ${this.calculateMargin(cocktail)}%</p>
                    </div>
                    <div class="ingredients-list">
                        <h4>Recette:</h4>
                        ${cocktail.ingredients.map(ing => {
                            const ingredient = this.findIngredient(ing.id);
                            return `<p>${ing.quantity} ${ingredient.unit} de ${ingredient.name}</p>`;
                        }).join('')}
                    </div>
                </div>
                <div class="cocktail-actions">
                    <button class="btn" onclick="CocktailsManager.showEditModal('${cocktail.id}')">
                        ✏️ Modifier
                    </button>
                    <button class="btn btn-danger" onclick="CocktailsManager.deleteCocktail('${cocktail.id}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    static calculateCost(cocktail) {
        return cocktail.ingredients.reduce((total, ing) => {
            const ingredient = this.findIngredient(ing.id);
            if (!ingredient) return total;
            return total + (ingredient.price * ing.quantity);
        }, 0);
    }

    static calculateMargin(cocktail) {
        const cost = this.calculateCost(cocktail);
        return ((cocktail.sellingPrice - cost) / cocktail.sellingPrice * 100).toFixed(1);
    }

    static findIngredient(id) {
        const ingredients = DATABASE.ingredients.getAll() || [];
        return ingredients.find(i => i.id === id);
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const cocktail = {
            id: Date.now().toString(),
            name: document.getElementById('cocktailName').value,
            sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
            ingredients: this.getIngredientInputsData().filter(ing => ing.id && ing.quantity)
        };

        DATABASE.cocktails.add(cocktail);
        this.loadData();
        UI.hideModal('addCocktailModal');
        Router.refreshPage();
        UI.showToast('Cocktail ajouté avec succès', 'success');
    }

    static deleteCocktail(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) {
            DATABASE.cocktails.delete(id);
            this.loadData();
            Router.refreshPage();
            UI.showToast('Cocktail supprimé avec succès', 'success');
        }
    }
}

window.CocktailsManager = CocktailsManager; 