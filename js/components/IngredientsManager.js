class IngredientsManager {
    static ingredients = [];
    static commonIngredients = [
        "Tequila", "Vodka", "Gin", "Rhum blanc", "Rhum ambré", "Whisky", 
        "Triple sec", "Vermouth", "Campari", "Jus de citron", "Jus de lime",
        "Jus d'orange", "Jus d'ananas", "Sirop de sucre", "Sirop d'agave",
        "Angostura", "Menthe fraîche", "Tonic", "Soda", "Cola"
    ];

    static initialize() {
        console.log('IngredientsManager initializing...');
        this.viewMode = localStorage.getItem('ingredientsViewMode') || 'grid';
        this.loadIngredients();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="ingredients-page">
                <header class="page-header">
                    <div class="header-main">
                        <h1>Ingrédients</h1>
                        <button class="btn btn-primary" onclick="IngredientsManager.showAddModal()">
                            + Nouvel ingrédient
                        </button>
                    </div>
                    <div class="view-controls">
                        <button class="btn ${this.viewMode === 'grid' ? 'active' : ''}" 
                                onclick="IngredientsManager.setViewMode('grid')">
                            📱 Mosaïque
                        </button>
                        <button class="btn ${this.viewMode === 'list' ? 'active' : ''}" 
                                onclick="IngredientsManager.setViewMode('list')">
                            📋 Liste
                        </button>
                    </div>
                </header>

                <div class="ingredients-container ${this.viewMode}">
                    ${this.renderIngredients()}
                </div>

                <!-- Modal d'ajout -->
                <div id="addIngredientModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouvel ingrédient</h2>
                        <form id="ingredientForm" onsubmit="IngredientsManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Nom</label>
                                <div class="autocomplete-wrapper">
                                    <input type="text" 
                                           id="ingredientName" 
                                           required 
                                           oninput="IngredientsManager.handleNameInput(this)"
                                           autocomplete="off">
                                    <div id="suggestions" class="suggestions-list"></div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Prix unitaire (€)</label>
                                <input type="number" id="ingredientPrice" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label>Unité</label>
                                <select id="ingredientUnit" required>
                                    <option value="cl">Centilitre (cl)</option>
                                    <option value="ml">Millilitre (ml)</option>
                                    <option value="g">Gramme (g)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Stock initial</label>
                                <input type="number" id="ingredientStock" required>
                            </div>
                            <div class="form-group">
                                <label>Stock minimum</label>
                                <input type="number" id="ingredientMinStock" required>
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn" onclick="UI.hideModal('addIngredientModal')">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static loadIngredients() {
        this.ingredients = DATABASE.ingredients.getAll() || [];
        console.log('Loaded ingredients:', this.ingredients);
    }

    static renderIngredients() {
        if (!this.ingredients.length) {
            return `
                <div class="empty-state">
                    🧂 Aucun ingrédient. Commencez par en ajouter un !
                </div>
            `;
        }
        
        return this.ingredients.map(ingredient => `
            <div class="ingredient-card">
                <div class="ingredient-info">
                    <h3>${ingredient.name}</h3>
                    <p>${ingredient.price}€ / ${ingredient.unit}</p>
                    <p>Stock: ${ingredient.stock} ${ingredient.unit}</p>
                    <p>Minimum: ${ingredient.minStock} ${ingredient.unit}</p>
                </div>
                <div class="ingredient-actions">
                    <button class="btn" onclick="IngredientsManager.showEditModal('${ingredient.id}')">
                        ✏️ Modifier
                    </button>
                    <button class="btn btn-danger" onclick="IngredientsManager.deleteIngredient('${ingredient.id}')">
                        🗑️ Supprimer
                    </button>
                </div>
            </div>
        `).join('');
    }

    static deleteIngredient(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet ingrédient ?')) {
            console.log('Deleting ingredient:', id);
            DATABASE.ingredients.delete(id);
            this.loadIngredients();
            router.refreshPage();
            UI.showToast('Ingrédient supprimé avec succès', 'success');
        }
    }

    static showAddModal() {
        UI.showModal('addIngredientModal');
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const ingredient = {
            id: Date.now().toString(),
            name: document.getElementById('ingredientName').value,
            price: parseFloat(document.getElementById('ingredientPrice').value),
            unit: document.getElementById('ingredientUnit').value,
            stock: parseInt(document.getElementById('ingredientStock').value),
            minStock: parseInt(document.getElementById('ingredientMinStock').value)
        };

        DATABASE.ingredients.add(ingredient);
        this.loadIngredients();
        UI.hideModal('addIngredientModal');
        router.refreshPage();
        UI.showToast('Ingrédient ajouté avec succès', 'success');
    }

    static setupEventListeners() {
        // Les event listeners sont gérés via les attributs onclick dans le template
    }

    static handleNameInput(input) {
        const value = input.value.toLowerCase();
        const suggestions = document.getElementById('suggestions');
        
        if (value.length < 2) {
            suggestions.innerHTML = '';
            return;
        }

        const matches = this.commonIngredients.filter(ing => 
            ing.toLowerCase().includes(value)
        );

        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(match => `
                <div class="suggestion-item" onclick="IngredientsManager.selectSuggestion('${match}')">
                    ${match}
                </div>
            `).join('');
            suggestions.style.display = 'block';
        } else {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
        }
    }

    static selectSuggestion(value) {
        document.getElementById('ingredientName').value = value;
        document.getElementById('suggestions').style.display = 'none';
    }

    static setViewMode(mode) {
        this.viewMode = mode;
        localStorage.setItem('ingredientsViewMode', mode);
        router.refreshPage();
    }
}

window.IngredientsManager = IngredientsManager; 