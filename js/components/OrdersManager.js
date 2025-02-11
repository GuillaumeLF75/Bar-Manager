class OrdersManager {
    static orders = [];

    static initialize() {
        console.log('OrdersManager initializing...');
        this.loadOrders();
    }

    static loadOrders() {
        this.orders = DATABASE.orders.getAll() || [];
    }

    static getTemplate() {
        return `
            <div class="orders-page">
                <header class="page-header">
                    <h1>Commandes</h1>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="OrdersManager.showNewOrderModal()">
                            + Nouvelle commande
                        </button>
                    </div>
                </header>

                <div class="orders-list">
                    ${this.renderOrders()}
                </div>

                <!-- Modal nouvelle commande -->
                <div id="newOrderModal" class="modal">
                    <div class="modal-content">
                        <h2>Nouvelle commande</h2>
                        <form id="orderForm" onsubmit="OrdersManager.handleSubmit(event)">
                            <div class="form-group">
                                <label>Table</label>
                                <input type="number" id="tableNumber" required min="1">
                            </div>
                            <div class="modal-actions">
                                <button type="button" class="btn" onclick="UI.hideModal('newOrderModal')">
                                    Annuler
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    Créer la commande
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
                    📝 Aucune commande. Créez-en une nouvelle !
                </div>
            `;
        }

        return this.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <h3>Table ${order.tableNumber}</h3>
                    <span class="order-status ${order.status}">${this.getStatusLabel(order.status)}</span>
                </div>
                <div class="order-content">
                    <p>Total: ${order.total || 0}€</p>
                    <p>Créée le: ${new Date(order.date).toLocaleString()}</p>
                </div>
                <div class="order-actions">
                    <button class="btn" onclick="OrdersManager.showOrderDetails('${order.id}')">
                        👁️ Voir
                    </button>
                    ${this.renderStatusButton(order)}
                </div>
            </div>
        `).join('');
    }

    static getStatusLabel(status) {
        const labels = {
            'pending': 'En attente',
            'preparing': 'En préparation',
            'ready': 'Prêt',
            'delivered': 'Livré',
            'paid': 'Payé'
        };
        return labels[status] || status;
    }

    static renderStatusButton(order) {
        if (order.status === 'paid') return '';
        
        const nextStatus = {
            'pending': 'preparing',
            'preparing': 'ready',
            'ready': 'delivered',
            'delivered': 'paid'
        };

        const nextLabel = this.getStatusLabel(nextStatus[order.status]);
        
        return `
            <button class="btn btn-primary" onclick="OrdersManager.updateOrderStatus('${order.id}', '${nextStatus[order.status]}')">
                ➡️ Marquer ${nextLabel}
            </button>
        `;
    }

    static showNewOrderModal() {
        UI.showModal('newOrderModal');
    }

    static handleSubmit(event) {
        event.preventDefault();
        
        const order = {
            id: Date.now().toString(),
            tableNumber: parseInt(document.getElementById('tableNumber').value),
            date: new Date().toISOString(),
            status: 'pending',
            items: [],
            total: 0
        };

        DATABASE.orders.add(order);
        this.loadOrders();
        UI.hideModal('newOrderModal');
        Router.refreshPage();
        UI.showToast('Commande créée avec succès', 'success');
    }

    static updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            DATABASE.orders.update(orderId, order);
            this.loadOrders();
            Router.refreshPage();
            UI.showToast('Statut mis à jour', 'success');
        }
    }

    static showOrderDetails(orderId) {
        // TODO: Implémenter la vue détaillée d'une commande
        alert('Vue détaillée à venir');
    }
}

window.OrdersManager = OrdersManager; 