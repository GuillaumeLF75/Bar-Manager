class StockManager {
    static initialize() {
        this.loadStockHistory();
        this.setupEventListeners();
    }

    static getTemplate() {
        return `
            <div class="stock-page">
                <header class="page-header">
                    <h1>Gestion des stocks</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="StockManager.showStockModal()">
                            + Mouvement de stock
                        </button>
                    </div>
                </header>

                <div class="stock-grid">
                    <!-- Alertes de stock -->
                    <div class="stock-card alerts-card">
                        <h2>🚨 Alertes</h2>
                        <div class="alerts-list">
                            ${this.renderStockAlerts()}
                        </div>
                    </div>

                    <!-- Niveaux de stock -->
                    <div class="stock-card levels-card">
                        <h2>📊 Niveaux actuels</h2>
                        <div class="stock-levels">
                            ${this.renderStockLevels()}
                        </div>
                    </div>

                    <!-- Historique des mouvements -->
                    <div class="stock-card history-card">
                        <h2>📝 Historique des mouvements</h2>
                        <div class="stock-history">
                            ${this.renderStockHistory()}
                        </div>
                    </div>
                </div>

                <!-- Modal de mouvement de stock -->
                <div id="stockModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouveau mouvement de stock</h2>
                        <form id="stockForm" onsubmit="StockManager.handleStockMovement(event)">
                            <div class="form-group">
                                <label for="ingredient">Ingrédient</label>
                                <select id="ingredient" required>
                                    ${this.renderIngredientOptions()}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="movementType">Type de mouvement</label>
                                <select id="movementType" required>
                                    <option value="in">Entrée (+)</option>
                                    <option value="out">Sortie (-)</option>
                                </select>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="quantity">Quantité</label>
                                    <input type="number" id="quantity" required min="0" step="0.01">
                                </div>
                                <div class="form-group unit-display">
                                    <label>Unité</label>
                                    <span id="unitDisplay">-</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="reason">Raison</label>
                                <select id="reason" required>
                                    <option value="purchase">Achat</option>
                                    <option value="loss">Perte</option>
                                    <option value="inventory">Inventaire</option>
                                    <option value="other">Autre</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="notes">Notes</label>
                                <textarea id="notes" rows="3"></textarea>
                            </div>
                            <div class="modal-actions">
                                <button type="button" onclick="UI.hideModal('stockModal')" class="btn">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Valider
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static renderStockAlerts() {
        const alerts = this.getStockAlerts();
        if (alerts.length === 0) {
            return '<div class="empty-state">Aucune alerte de stock</div>';
        }

        return alerts.map(alert => `
            <div class="alert-item ${alert.level}">
                <div class="alert-icon">${alert.level === 'critical' ? '🔴' : '⚠️'}</div>
                <div class="alert-content">
                    <strong>${alert.ingredient.name}</strong>
                    <span>${alert.message}</span>
                </div>
            </div>
        `).join('');
    }

    static renderStockLevels() {
        const ingredients = DATABASE.ingredients.getAll();
        return ingredients.map(ingredient => `
            <div class="stock-level-item">
                <div class="level-info">
                    <span class="ingredient-name">${ingredient.name}</span>
                    <span class="stock-amount">
                        ${ingredient.stock} ${ingredient.unit}
                    </span>
                </div>
                <div class="level-bar">
                    <div class="level-fill" style="width: ${this.calculateStockLevel(ingredient)}%"></div>
                </div>
            </div>
        `).join('');
    }

    static renderStockHistory() {
        if (this.stockHistory.length === 0) {
            return '<div class="empty-state">Aucun mouvement enregistré</div>';
        }

        return this.stockHistory.map(movement => `
            <div class="history-item">
                <div class="movement-header">
                    <span class="movement-date">
                        ${new Date(movement.date).toLocaleDateString()}
                    </span>
                    <span class="movement-type ${movement.type}">
                        ${movement.type === 'in' ? '+' : '-'}${movement.quantity} ${movement.unit}
                    </span>
                </div>
                <div class="movement-details">
                    <strong>${movement.ingredientName}</strong>
                    <span class="movement-reason">${movement.reason}</span>
                </div>
                ${movement.notes ? `<div class="movement-notes">${movement.notes}</div>` : ''}
            </div>
        `).join('');
    }

    static renderIngredientOptions() {
        const ingredients = DATABASE.ingredients.getAll();
        return ingredients.map(ing => 
            `<option value="${ing.id}">${ing.name} (${ing.stock} ${ing.unit})</option>`
        ).join('');
    }

    static calculateStockLevel(ingredient) {
        // TODO: Implémenter la logique des seuils de stock
        return (ingredient.stock / 100) * 100; // Temporaire
    }

    static getStockAlerts() {
        const alerts = [];
        const ingredients = DATABASE.ingredients.getAll();
        
        ingredients.forEach(ing => {
            if (ing.stock <= 0) {
                alerts.push({
                    ingredient: ing,
                    level: 'critical',
                    message: 'Stock épuisé'
                });
            } else if (ing.stock < 20) { // Seuil d'alerte à paramétrer
                alerts.push({
                    ingredient: ing,
                    level: 'warning',
                    message: 'Stock faible'
                });
            }
        });

        return alerts;
    }

    static async handleStockMovement(event) {
        event.preventDefault();
        
        const formData = {
            ingredientId: document.getElementById('ingredient').value,
            type: document.getElementById('movementType').value,
            quantity: parseFloat(document.getElementById('quantity').value),
            reason: document.getElementById('reason').value,
            notes: document.getElementById('notes').value,
            date: new Date().toISOString()
        };

        const ingredient = DATABASE.ingredients.get(formData.ingredientId);
        if (!ingredient) return;

        // Mettre à jour le stock
        const newStock = formData.type === 'in' 
            ? ingredient.stock + formData.quantity
            : ingredient.stock - formData.quantity;

        if (newStock < 0) {
            UI.showToast('Stock insuffisant', 'error');
            return;
        }

        // Sauvegarder le mouvement
        this.stockHistory.unshift({
            ...formData,
            ingredientName: ingredient.name,
            unit: ingredient.unit
        });
        localStorage.setItem('stockHistory', JSON.stringify(this.stockHistory));

        // Mettre à jour l'ingrédient
        await DATABASE.ingredients.update(ingredient.id, {
            ...ingredient,
            stock: newStock
        });

        UI.hideModal('stockModal');
        UI.showToast('Mouvement de stock enregistré', 'success');
        router.refreshPage();
    }

    static loadStockHistory() {
        this.stockHistory = JSON.parse(localStorage.getItem('stockHistory') || '[]');
    }

    static setupEventListeners() {
        // Mise à jour de l'unité lors du changement d'ingrédient
        document.getElementById('ingredient')?.addEventListener('change', (e) => {
            const ingredient = DATABASE.ingredients.get(e.target.value);
            if (ingredient) {
                document.getElementById('unitDisplay').textContent = ingredient.unit;
            }
        });
    }
}

window.StockManager = StockManager; 