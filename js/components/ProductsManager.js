class ProductsManager {
    static initialize() {
        this.loadProducts();
        this.setupEventListeners();
        this.currentView = 'grid';
    }

    static getTemplate() {
        return `
            <div class="products-page">
                <header class="page-header">
                    <h1>Gestion des cocktails</h1>
                    <div class="header-actions">
                        <div class="view-toggle">
                            <button onclick="ProductsManager.setView('grid')" class="active" id="productGridView">
                                🔲 Grille
                            </button>
                            <button onclick="ProductsManager.setView('table')" id="productTableView">
                                📋 Tableau
                            </button>
                        </div>
                        <button class="btn btn-primary" onclick="ProductsManager.showAddModal()">
                            + Nouveau cocktail
                        </button>
                    </div>
                </header>

                <div class="filters-bar card">
                    <input type="text" 
                           id="productSearch" 
                           placeholder="Rechercher un cocktail..."
                           class="form-control">
                    <div class="filter-group">
                        <select id="productCategoryFilter" class="form-control">
                            <option value="">Toutes catégories</option>
                            <option value="cocktails">Cocktails</option>
                            <option value="mocktails">Mocktails</option>
                            <option value="shots">Shots</option>
                        </select>
                    </div>
                </div>

                <div id="productsList" class="products-grid">
                    <!-- Rempli dynamiquement -->
                </div>

                <!-- Modal d'ajout/édition -->
                <div class="modal" id="productModal">
                    <div class="modal-content card">
                        <h3>Nouveau cocktail</h3>
                        <form id="productForm" onsubmit="ProductsManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Nom du cocktail</label>
                                <input type="text" name="name" required class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Catégorie</label>
                                <select name="category" required class="form-control">
                                    <option value="cocktails">Cocktail</option>
                                    <option value="mocktails">Mocktail</option>
                                    <option value="shots">Shot</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea name="description" class="form-control" rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Prix de vente HT</label>
                                <input type="number" 
                                       name="priceHT" 
                                       step="0.01" 
                                       required 
                                       class="form-control">
                            </div>
                            <div class="form-group">
                                <label>TVA (%)</label>
                                <input type="number" 
                                       name="vatRate" 
                                       value="20" 
                                       required 
                                       class="form-control">
                            </div>
                            
                            <div class="ingredients-section">
                                <h4>Ingrédients</h4>
                                <div id="productIngredientsList">
                                    <!-- Liste des ingrédients dynamique -->
                                </div>
                                <button type="button" 
                                        class="btn btn-secondary"
                                        onclick="ProductsManager.addIngredientRow()">
                                    + Ajouter un ingrédient
                                </button>
                            </div>

                            <div class="form-actions">
                                <button type="button" 
                                        class="btn btn-secondary"
                                        onclick="ProductsManager.closeModal()">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Enregistrer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static setupEventListeners() {
        document.getElementById('productSearch')?.addEventListener('input', (e) => {
            this.filterProducts(e.target.value);
        });

        document.getElementById('productCategoryFilter')?.addEventListener('change', (e) => {
            this.filterProducts(document.getElementById('productSearch').value, e.target.value);
        });
    }

    static setView(view) {
        this.currentView = view;
        const list = document.getElementById('productsList');
        const gridBtn = document.getElementById('productGridView');
        const tableBtn = document.getElementById('productTableView');

        if (view === 'grid') {
            list.className = 'products-grid';
            gridBtn?.classList.add('active');
            tableBtn?.classList.remove('active');
        } else {
            list.className = 'products-table';
            tableBtn?.classList.add('active');
            gridBtn?.classList.remove('active');
        }

        this.loadProducts();
    }

    static addIngredientRow() {
        const ingredients = DATABASE.ingredients.getAll();
        const container = document.getElementById('productIngredientsList');
        
        const row = document.createElement('div');
        row.className = 'ingredient-row';
        row.innerHTML = `
            <select class="form-control" name="ingredient_id[]" required onchange="ProductsManager.updateIngredientUnit(this)">
                <option value="">Sélectionner un ingrédient</option>
                ${ingredients.map(ing => `
                    <option value="${ing.id}" data-unit="${ing.unit}">${ing.name}</option>
                `).join('')}
            </select>
            <div class="quantity-group">
                <input type="number" 
                       name="quantity[]" 
                       step="0.01" 
                       required 
                       class="form-control" 
                       placeholder="Quantité">
                <span class="unit">cl</span>
            </div>
            <button type="button" 
                    class="btn btn-icon btn-danger"
                    onclick="this.parentElement.remove()">
                🗑️
            </button>
        `;

        container.appendChild(row);
    }

    static updateIngredientUnit(select) {
        const unit = select.options[select.selectedIndex].dataset.unit;
        const unitSpan = select.parentElement.querySelector('.unit');
        if (unitSpan) {
            unitSpan.textContent = unit;
        }
    }

    static calculateCostPrice(ingredients) {
        return ingredients.reduce((total, ing) => {
            const ingredient = DATABASE.ingredients.get(ing.id);
            if (!ingredient) return total;
            return total + (ingredient.priceHT * ing.quantity);
        }, 0);
    }

    static calculateMargin(priceHT, costPrice) {
        return ((priceHT - costPrice) / priceHT) * 100;
    }

    static async handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const editId = form.getAttribute('data-edit-id');
        
        // Récupérer les ingrédients
        const ingredientIds = [...form.elements['ingredient_id[]']].map(el => parseInt(el.value));
        const quantities = [...form.elements['quantity[]']].map(el => parseFloat(el.value));
        
        const ingredients = ingredientIds.map((id, index) => ({
            id: id,
            quantity: quantities[index]
        }));

        const product = {
            name: form.elements.name.value,
            category: form.elements.category.value,
            description: form.elements.description.value,
            priceHT: parseFloat(form.elements.priceHT.value),
            vatRate: parseFloat(form.elements.vatRate.value),
            ingredients: ingredients
        };

        try {
            if (editId) {
                await DATABASE.products.update(parseInt(editId), product);
                UI.showToast('Cocktail modifié avec succès', 'success');
            } else {
                await DATABASE.products.add(product);
                UI.showToast('Cocktail ajouté avec succès', 'success');
            }
            
            this.loadProducts();
            this.closeModal();
        } catch (error) {
            console.error('Error saving product:', error);
            UI.showToast('Erreur lors de l\'enregistrement', 'error');
        }
    }

    static showAddModal() {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        form.reset();
        form.removeAttribute('data-edit-id');
        modal.querySelector('h3').textContent = 'Nouveau cocktail';
        
        // Vider la liste des ingrédients
        const ingredientsList = document.getElementById('productIngredientsList');
        ingredientsList.innerHTML = '';
        
        // Ajouter une première ligne d'ingrédient
        this.addIngredientRow();
        
        modal.style.display = 'flex';
    }

    static showEditModal(id) {
        const product = DATABASE.products.get(id);
        if (!product) return;

        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        
        form.setAttribute('data-edit-id', id);
        modal.querySelector('h3').textContent = 'Modifier le cocktail';
        
        // Remplir le formulaire
        form.elements.name.value = product.name;
        form.elements.category.value = product.category;
        form.elements.description.value = product.description;
        form.elements.priceHT.value = product.priceHT;
        form.elements.vatRate.value = product.vatRate;

        // Remplir les ingrédients
        const ingredientsList = document.getElementById('productIngredientsList');
        ingredientsList.innerHTML = '';
        
        product.ingredients.forEach(ing => {
            this.addIngredientRow();
            const lastRow = ingredientsList.lastElementChild;
            lastRow.querySelector('[name="ingredient_id[]"]').value = ing.id;
            lastRow.querySelector('[name="quantity[]"]').value = ing.quantity;
            this.updateIngredientUnit(lastRow.querySelector('[name="ingredient_id[]"]'));
        });

        modal.style.display = 'flex';
    }

    static closeModal() {
        const modal = document.getElementById('productModal');
        modal.style.display = 'none';
    }

    static async deleteProduct(id) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce cocktail ?')) {
            return;
        }

        try {
            await DATABASE.products.delete(id);
            UI.showToast('Cocktail supprimé avec succès', 'success');
            this.loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            UI.showToast('Erreur lors de la suppression', 'error');
        }
    }

    static filterProducts(search = '', category = '') {
        const products = DATABASE.products.getAll();
        const filtered = products.filter(prod => {
            const matchSearch = prod.name.toLowerCase().includes(search.toLowerCase());
            const matchCategory = category ? prod.category === category : true;
            return matchSearch && matchCategory;
        });
        this.renderProducts(filtered);
    }

    static loadProducts() {
        const products = DATABASE.products.getAll();
        this.renderProducts(products);
    }

    static renderProducts(products) {
        const list = document.getElementById('productsList');
        if (!list) return;

        if (this.currentView === 'table') {
            list.innerHTML = `
                <div class="product-row header-row">
                    <div>Nom</div>
                    <div>Catégorie</div>
                    <div>Prix HT</div>
                    <div>Prix TTC</div>
                    <div>Coût</div>
                    <div>Marge</div>
                    <div>Actions</div>
                </div>
                ${products.map(prod => {
                    const costPrice = this.calculateCostPrice(prod.ingredients);
                    const margin = this.calculateMargin(prod.priceHT, costPrice);
                    const priceTTC = prod.priceHT * (1 + prod.vatRate/100);
                    
                    return `
                        <div class="product-row">
                            <div class="product-name" data-label="Nom">
                                ${prod.name}
                            </div>
                            <div data-label="Catégorie">
                                <span class="badge ${prod.category}">${prod.category}</span>
                            </div>
                            <div data-label="Prix HT">
                                ${Calculations.formatCurrency(prod.priceHT)}
                            </div>
                            <div data-label="Prix TTC">
                                ${Calculations.formatCurrency(priceTTC)}
                            </div>
                            <div data-label="Coût">
                                ${Calculations.formatCurrency(costPrice)}
                            </div>
                            <div data-label="Marge" class="${margin < 0 ? 'negative-margin' : ''}">
                                ${margin.toFixed(1)}%
                            </div>
                            <div class="actions">
                                <button onclick="ProductsManager.showEditModal(${prod.id})"
                                        class="btn btn-icon">
                                    ✏️
                                </button>
                                <button onclick="ProductsManager.deleteProduct(${prod.id})"
                                        class="btn btn-icon btn-danger">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            `;
        } else {
            list.innerHTML = products.map(prod => {
                const costPrice = this.calculateCostPrice(prod.ingredients);
                const margin = this.calculateMargin(prod.priceHT, costPrice);
                const priceTTC = prod.priceHT * (1 + prod.vatRate/100);
                
                return `
                    <div class="product-card card">
                        <div class="product-header">
                            <h3>${prod.name}</h3>
                            <span class="badge ${prod.category}">${prod.category}</span>
                        </div>
                        <p class="product-description">${prod.description || ''}</p>
                        <div class="product-ingredients">
                            ${prod.ingredients.map(ing => {
                                const ingredient = DATABASE.ingredients.get(ing.id);
                                if (!ingredient) return '';
                                return `
                                    <div class="ingredient-tag">
                                        ${ing.quantity} ${ingredient.unit} ${ingredient.name}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="product-details">
                            <div class="detail-row">
                                <span>Prix HT:</span>
                                <span>${Calculations.formatCurrency(prod.priceHT)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Prix TTC:</span>
                                <span>${Calculations.formatCurrency(priceTTC)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Coût:</span>
                                <span>${Calculations.formatCurrency(costPrice)}</span>
                            </div>
                            <div class="detail-row">
                                <span>Marge:</span>
                                <span class="${margin < 0 ? 'negative-margin' : ''}">${margin.toFixed(1)}%</span>
                            </div>
                        </div>
                        <div class="product-actions">
                            <button onclick="ProductsManager.showEditModal(${prod.id})"
                                    class="btn btn-icon">
                                ✏️
                            </button>
                            <button onclick="ProductsManager.deleteProduct(${prod.id})"
                                    class="btn btn-icon btn-danger">
                                🗑️
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
} 