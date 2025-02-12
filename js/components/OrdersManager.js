class OrdersManager {
    static orders = [];
    static cocktails = [];

    static initialize() {
        this.loadData();
    }

    static loadData() {
        this.orders = DATABASE.orders.getAll() || [];
        this.cocktails = DATABASE.cocktails.getAll() || [];
    }

    static getTemplate() {
        return `
            <div class="orders-page">
                <header class="page-header">
                    <h1>Commandes</h1>
                    <button class="btn btn-primary" onclick="OrdersManager.showAddModal()">
                        + Nouvelle commande
                    </button>
                </header>

                ${this.renderOrders()}

                <div id="addOrderModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouvelle commande</h2>
                        <form id="orderForm" onsubmit="OrdersManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Table</label>
                                <input type="number" id="tableNumber" min="1" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Cocktails</label>
                                <div id="orderItems">
                                    ${this.renderOrderItemRow()}
                                </div>
                                <button type="button" class="btn" onclick="OrdersManager.addOrderItemRow()">
                                    + Ajouter un cocktail
                                </button>
                            </div>

                            <div class="order-summary" id="orderSummary">
                                <h4>Total: 0.00€</h4>
                            </div>

                            <div class="modal-actions">
                                <button type="button" class="btn" onclick="UI.hideModal('addOrderModal')">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Commander
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    static renderOrders() {
        if (!this.orders.length) {
            return `
                <div class="empty-state">
                    <h3>📝 Aucune commande</h3>
                    <p>Créez votre première commande !</p>
                </div>
            `;
        }

        return `
            <div class="orders-list">
                ${this.orders.map(order => `
                    <div class="order-card">
                        <div class="order-header">
                            <h3>Table ${order.tableNumber}</h3>
                            <span class="order-date">
                                ${new Date(order.date).toLocaleString()}
                            </span>
                        </div>
                        
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <span>${item.name}</span>
                                    <span>x${item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}€</span>
                                </div>
                            `).join('')}
                        </div>

                        <div class="order-total">
                            <strong>Total: ${order.total.toFixed(2)}€</strong>
                        </div>

                        <div class="order-actions">
                            ${order.status !== 'completed' && order.status !== 'final' ? `
                                <button class="btn btn-success" onclick="OrdersManager.completeOrder('${order.id}')">
                                    ✓ Terminer
                                </button>
                                <button class="btn btn-danger" onclick="OrdersManager.deleteOrder('${order.id}')">
                                    🗑️ Annuler
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    static renderOrderItemRow() {
        return `
            <div class="order-item-row">
                <select class="cocktail-select" onchange="OrdersManager.updateOrderSummary()">
                    <option value="">Sélectionner un cocktail</option>
                    ${this.cocktails.map(cocktail => `
                        <option value="${cocktail.id}" data-price="${cocktail.sellingPrice}">
                            ${cocktail.name} (${cocktail.sellingPrice.toFixed(2)}€)
                        </option>
                    `).join('')}
                </select>
                <input type="number" 
                       class="item-quantity" 
                       value="1" 
                       min="1" 
                       onchange="OrdersManager.updateOrderSummary()">
                <button type="button" 
                        class="btn btn-danger" 
                        onclick="this.closest('.order-item-row').remove(); OrdersManager.updateOrderSummary();">
                    🗑️
                </button>
            </div>
        `;
    }

    static addOrderItemRow() {
        const container = document.getElementById('orderItems');
        if (container) {
            const div = document.createElement('div');
            div.innerHTML = this.renderOrderItemRow();
            container.appendChild(div.firstElementChild);
        }
    }

    static updateOrderSummary() {
        const summary = document.getElementById('orderSummary');
        if (!summary) return;

        const total = this.calculateOrderTotal();
        summary.innerHTML = `<h4>Total: ${total.toFixed(2)}€</h4>`;
    }

    static calculateOrderTotal() {
        let total = 0;
        document.querySelectorAll('.order-item-row').forEach(row => {
            const select = row.querySelector('.cocktail-select');
            const quantity = row.querySelector('.item-quantity');
            
            if (select.value && quantity.value) {
                const price = parseFloat(select.selectedOptions[0].dataset.price);
                total += price * parseInt(quantity.value);
            }
        });
        return total;
    }

    static showAddModal() {
        UI.showModal('addOrderModal');
        this.updateOrderSummary();
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const items = [];
        document.querySelectorAll('.order-item-row').forEach(row => {
            const select = row.querySelector('.cocktail-select');
            const quantity = row.querySelector('.item-quantity');
            
            if (select.value && quantity.value) {
                const cocktail = this.cocktails.find(c => c.id === select.value);
                if (cocktail) {
                    items.push({
                        id: cocktail.id,
                        name: cocktail.name,
                        price: cocktail.sellingPrice,
                        quantity: parseInt(quantity.value)
                    });
                }
            }
        });

        if (items.length === 0) {
            UI.showToast('Ajoutez au moins un cocktail', 'error');
            return;
        }

        const order = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            tableNumber: parseInt(document.getElementById('tableNumber').value),
            items: items,
            total: this.calculateOrderTotal(),
            status: 'pending'
        };

        DATABASE.orders.add(order);
        this.loadData();
        UI.hideModal('addOrderModal');
        router.refreshPage();
        UI.showToast('Commande créée avec succès', 'success');
    }

    static completeOrder(id) {
        const order = this.orders.find(o => o.id === id);
        if (order) {
            order.status = 'completed';
            DATABASE.orders.update(id, order);
            this.loadData();
            router.refreshPage();
            UI.showToast('Commande terminée', 'success');
        }
    }

    static deleteOrder(id) {
        if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
            DATABASE.orders.delete(id);
            this.loadData();
            router.refreshPage();
            UI.showToast('Commande annulée', 'success');
        }
    }
}

window.OrdersManager = OrdersManager; 