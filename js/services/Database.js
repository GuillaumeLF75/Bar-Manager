class Database {
    static collections = {
        ingredients: new Collection('ingredients'),
        cocktails: new Collection('cocktails'),
        foods: new Collection('foods'),
        orders: new Collection('orders'),
        statistics: new Collection('statistics')
    };

    static initialize() {
        console.log('Database initializing...');
        Object.values(this.collections).forEach(collection => {
            collection.initialize();
        });
    }

    static get ingredients() { return this.collections.ingredients; }
    static get cocktails() { return this.collections.cocktails; }
    static get foods() { return this.collections.foods; }
    static get orders() { return this.collections.orders; }
    static get statistics() { return this.collections.statistics; }
}

window.DATABASE = Database; 