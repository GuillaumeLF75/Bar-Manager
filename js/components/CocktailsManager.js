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
                <div class="quantity-wrapper">
                    <input type="number" 
                           class="ingredient-quantity" 
                           placeholder="Quantité"
                           step="1" 
                           min="0"
                           onchange="CocktailsManager.updateCostSummary()">
                    <select class="unit-select" onchange="CocktailsManager.updateCostSummary()">
                        <option value="cl">cl</option>
                        <option value="ml">ml</option>
                        <option value="g">g</option>
                    </select>
                </div>
                <button type="button" 
                        class="btn btn-danger" 
                        onclick="this.closest('.ingredient-row').remove(); CocktailsManager.updateCostSummary();">
                    🗑️
                </button>
            </div>
        `;
    }

    static updateIngredientUnit(selectElement) {
        const row = selectElement.closest('.ingredient-row');
        const unitDisplay = row.querySelector('.unit-display');
        const selectedOption = selectElement.selectedOptions[0];
        
        if (selectedOption && selectedOption.value) {
            const ingredient = this.ingredients.find(ing => ing.id === selectedOption.value);
            if (ingredient) {
                unitDisplay.textContent = ingredient.unit;
            }
        } else {
            unitDisplay.textContent = '';
        }
    }

    static addIngredientRow(mode = 'add') {
        const listId = mode === 'edit' ? 'editIngredientsList' : 'ingredientsList';
        const list = document.getElementById(listId);
        if (list) {
            const div = document.createElement('div');
            div.innerHTML = this.renderIngredientRow();
            list.appendChild(div.firstElementChild);
        }
    }

    static updateCostSummary(mode = 'add') {
        const summaryId = mode === 'edit' ? 'editCostSummary' : 'costSummary';
        const summary = document.getElementById(summaryId);
        if (!summary) return;

        const ingredients = this.getIngredientInputsData(mode);
        const totalCost = this.calculateTotalCost(ingredients);
        const sellingPrice = parseFloat(document.getElementById(mode === 'edit' ? 'editSellingPrice' : 'sellingPrice').value) || 0;
        const margin = this.calculateMargin(sellingPrice, totalCost);

        summary.innerHTML = `
            <h4>Résumé</h4>
            <p>Coût total: ${totalCost.toFixed(2)}€</p>
            <p>Prix de vente: ${sellingPrice.toFixed(2)}€</p>
            <p>Marge: ${margin}%</p>
        `;
    }

    static calculateMargin(sellingPrice, totalCost) {
        if (sellingPrice === 0) return 0;
        return (((sellingPrice - totalCost) / sellingPrice) * 100).toFixed(1);
    }

    static calculateTotalCost(ingredients) {
        const conversionRates = {
            'cl': 1,
            'ml': 0.1, // 1 cl = 10 ml
            'g': 0.1   // Assuming 1 g = 1 ml for water-based liquids
        };

        return ingredients.reduce((total, ing) => {
            const baseUnit = 'cl'; // Assuming the base unit for price is 'cl'
            const conversionRate = conversionRates[ing.unit] / conversionRates[baseUnit];
            const adjustedPrice = ing.price * conversionRate;
            return total + (adjustedPrice * ing.quantity);
        }, 0);
    }

    static getIngredientInputsData(mode = 'add') {
        const listId = mode === 'edit' ? 'editIngredientsList' : 'ingredientsList';
        const ingredients = [];
        document.querySelectorAll(`#${listId} .ingredient-row`).forEach(row => {
            const select = row.querySelector('.ingredient-select');
            const quantity = row.querySelector('.ingredient-quantity');
            const unitSelect = row.querySelector('.unit-select');
            
            if (select && select.value && quantity && quantity.value) {
                const ingredient = this.ingredients.find(ing => ing.id === select.value);
                if (ingredient) {
                    ingredients.push({
                        id: select.value,
                        name: ingredient.name,
                        quantity: parseFloat(quantity.value),
                        unit: unitSelect.value,
                        price: ingredient.price
                    });
                }
            }
        });
        return ingredients;
    }

    static showAddModal() {
        UI.showModal('addCocktailModal');
        this.updateCostSummary();
    }

    static renderCocktails() {
        if (!this.cocktails.length) {
            return `
                <div class="empty-state">
                    <h3>🍸 Aucun cocktail</h3>
                    <p>Commencez par en créer un !</p>
                </div>
            `;
        }

        return `
            <div class="cocktails-grid">
                ${this.cocktails.map(cocktail => `
                    <div class="cocktail-card">
                        <div class="cocktail-header">
                            <h3>${cocktail.name}</h3>
                            <div class="price-tag">
                                <span class="price">${cocktail.sellingPrice.toFixed(2)}€</span>
                            </div>
                        </div>
                        
                        <div class="ingredients-list">
                            <h4>Ingrédients :</h4>
                            <ul>
                                ${cocktail.ingredients.map(ing => `
                                    <li>
                                        <span class="ingredient-name">${ing.name}</span>
                                        <span class="ingredient-quantity">
                                            ${ing.quantity} ${ing.unit}
                                        </span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>

                        <div class="cost-info">
                            <div class="cost-row">
                                <span>Coût total:</span>
                                <strong>${cocktail.totalCost.toFixed(2)}€</strong>
                            </div>
                            <div class="cost-row">
                                <span>Marge:</span>
                                <strong class="${this.getMarginClass(cocktail.sellingPrice, cocktail.totalCost)}">
                                    ${this.calculateMargin(cocktail.sellingPrice, cocktail.totalCost)}%
                                </strong>
                            </div>
                        </div>

                        <div class="cocktail-actions">
                            <button class="btn btn-edit" onclick="CocktailsManager.editCocktail('${cocktail.id}')">
                                ✏️ Modifier
                            </button>
                            <button class="btn btn-danger" onclick="CocktailsManager.deleteCocktail('${cocktail.id}')">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static getMarginClass(sellingPrice, totalCost) {
        const margin = this.calculateMargin(sellingPrice, totalCost);
        if (margin >= 70) return 'margin-high';
        if (margin >= 50) return 'margin-good';
        if (margin >= 30) return 'margin-medium';
        return 'margin-low';
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const ingredients = this.getIngredientInputsData();
        if (ingredients.length === 0) {
            UI.showToast('Ajoutez au moins un ingrédient', 'error');
            return;
        }

        const cocktail = {
            id: Date.now().toString(),
            name: document.getElementById('cocktailName').value,
            sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
            ingredients: ingredients,
            totalCost: this.calculateTotalCost(ingredients)
        };

        DATABASE.cocktails.add(cocktail);
        this.loadData();
        UI.hideModal('addCocktailModal');
        router.refreshPage();
        UI.showToast('Cocktail ajouté avec succès', 'success');
    }

    static editCocktail(id) {
        const cocktail = this.cocktails.find(c => c.id === id);
        if (!cocktail) return;

        const modalContent = `
            <div class="modal-content">
                <h2>Modifier ${cocktail.name}</h2>
                <form id="editCocktailForm" onsubmit="CocktailsManager.handleEdit(event, '${id}')">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" id="editCocktailName" value="${cocktail.name}" required>
                    </div>
                    <div class="form-group">
                        <label>Prix de vente (€)</label>
                        <input type="number" id="editSellingPrice" value="${cocktail.sellingPrice}" 
                               step="0.01" required onchange="CocktailsManager.updateCostSummary('edit')">
                    </div>
                    
                    <div class="form-group">
                        <label>Ingrédients</label>
                        <div id="editIngredientsList">
                            ${cocktail.ingredients.map(ing => `
                                <div class="ingredient-row">
                                    <select class="ingredient-select" onchange="CocktailsManager.updateCostSummary('edit')">
                                        <option value="">Sélectionner un ingrédient</option>
                                        ${this.ingredients.map(i => `
                                            <option value="${i.id}" ${i.id === ing.id ? 'selected' : ''}>
                                                ${i.name} (${i.price}€/${i.unit})
                                            </option>
                                        `).join('')}
                                    </select>
                                    <div class="quantity-wrapper">
                                        <input type="number" 
                                               class="ingredient-quantity" 
                                               value="${ing.quantity}"
                                               step="1" 
                                               min="0"
                                               onchange="CocktailsManager.updateCostSummary('edit')">
                                        <select class="unit-select">
                                            <option value="cl" ${ing.unit === 'cl' ? 'selected' : ''}>cl</option>
                                            <option value="ml" ${ing.unit === 'ml' ? 'selected' : ''}>ml</option>
                                            <option value="g" ${ing.unit === 'g' ? 'selected' : ''}>g</option>
                                        </select>
                                    </div>
                                    <button type="button" 
                                            class="btn btn-danger" 
                                            onclick="this.closest('.ingredient-row').remove(); CocktailsManager.updateCostSummary('edit');">
                                        🗑️
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <button type="button" class="btn" onclick="CocktailsManager.addIngredientRow('edit')">
                            + Ajouter un ingrédient
                        </button>
                    </div>

                    <div class="cost-summary" id="editCostSummary">
                        <h4>Résumé</h4>
                        <p>Coût total: ${cocktail.totalCost.toFixed(2)}€</p>
                        <p>Prix de vente: ${cocktail.sellingPrice.toFixed(2)}€</p>
                        <p>Marge: ${this.calculateMargin(cocktail.sellingPrice, cocktail.totalCost)}%</p>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn" onclick="UI.hideModal('editCocktailModal')">
                            Annuler
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        `;

        const modal = document.createElement('div');
        modal.id = 'editCocktailModal';
        modal.className = 'modal';
        modal.innerHTML = modalContent;
        
        const existingModal = document.getElementById('editCocktailModal');
        if (existingModal) {
            existingModal.remove();
        }
        document.body.appendChild(modal);
        
        UI.showModal('editCocktailModal');
    }

    static handleEdit(event, id) {
        event.preventDefault();
        
        const ingredients = this.getIngredientInputsData('edit');
        if (ingredients.length === 0) {
            UI.showToast('Ajoutez au moins un ingrédient', 'error');
            return;
        }

        const updatedCocktail = {
            id: id,
            name: document.getElementById('editCocktailName').value,
            sellingPrice: parseFloat(document.getElementById('editSellingPrice').value),
            ingredients: ingredients,
            totalCost: this.calculateTotalCost(ingredients)
        };

        DATABASE.cocktails.update(id, updatedCocktail);
        this.loadData();
        UI.hideModal('editCocktailModal');
        router.refreshPage();
        UI.showToast('Cocktail modifié avec succès', 'success');
    }

    static deleteCocktail(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) {
            DATABASE.cocktails.delete(id);
            this.loadData();
            router.refreshPage();
            UI.showToast('Cocktail supprimé avec succès', 'success');
        }
    }
}

window.CocktailsManager = CocktailsManager; 