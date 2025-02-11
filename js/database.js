class Database {
    static initialize() {
        this.ingredients = new Collection('ingredients');
        this.products = new Collection('products');
        this.sales = new Collection('sales');
        this.settings = new Collection('settings');

        // Initialize with default data if empty
        if (this.ingredients.getAll().length === 0) {
            this.initializeDefaultData();
        }
    }

    static initializeDefaultData() {
        // Add some sample ingredients
        this.ingredients.add({
            name: "Vodka",
            category: "spirits",
            priceHT: 15.99,
            vatRate: 21,
            stock: 10,
            unit: "cl"
        });

        this.ingredients.add({
            name: "Jus d'orange",
            category: "juices",
            priceHT: 2.99,
            vatRate: 10,
            stock: 20,
            unit: "cl"
        });

        // Add default settings
        this.settings.add({
            currency: "EUR",
            dateFormat: "DD/MM/YYYY",
            vatRates: [21, 10, 4],
            categories: ["spirits", "liqueurs", "juices", "fruits", "others"],
            units: ["ml", "cl", "l", "g", "kg", "pcs"]
        });
    }
}

class Collection {
    constructor(name) {
        this.name = name;
        this.data = JSON.parse(localStorage.getItem(name) || '[]');
    }

    getAll() {
        return this.data;
    }

    get(id) {
        return this.data.find(item => item.id === id);
    }

    add(item) {
        item.id = Date.now();
        item.createdAt = new Date().toISOString();
        this.data.push(item);
        this.save();
        return item;
    }

    update(id, updates) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updates };
            this.save();
            return this.data[index];
        }
        return null;
    }

    delete(id) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data.splice(index, 1);
            this.save();
            return true;
        }
        return false;
    }

    save() {
        localStorage.setItem(this.name, JSON.stringify(this.data));
    }
} 