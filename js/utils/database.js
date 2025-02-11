class Database {
    static initialize() {
        console.log('Database initializing...');
        
        // Gestion des ingrédients
        this.ingredients = {
            getAll: () => {
                const items = localStorage.getItem('ingredients');
                return items ? JSON.parse(items) : [];
            },
            add: (ingredient) => {
                const items = this.ingredients.getAll();
                items.push(ingredient);
                localStorage.setItem('ingredients', JSON.stringify(items));
            },
            update: (id, updatedIngredient) => {
                let items = this.ingredients.getAll();
                items = items.map(item => 
                    item.id === id ? {...item, ...updatedIngredient} : item
                );
                localStorage.setItem('ingredients', JSON.stringify(items));
            },
            delete: (id) => {
                let items = this.ingredients.getAll();
                items = items.filter(item => item.id !== id);
                localStorage.setItem('ingredients', JSON.stringify(items));
            }
        };

        // Gestion des cocktails
        this.cocktails = {
            getAll: () => {
                const items = localStorage.getItem('cocktails');
                return items ? JSON.parse(items) : [];
            },
            add: (cocktail) => {
                const items = this.cocktails.getAll();
                items.push(cocktail);
                localStorage.setItem('cocktails', JSON.stringify(items));
            },
            update: (id, updatedCocktail) => {
                let items = this.cocktails.getAll();
                items = items.map(item => 
                    item.id === id ? {...item, ...updatedCocktail} : item
                );
                localStorage.setItem('cocktails', JSON.stringify(items));
            },
            delete: (id) => {
                let items = this.cocktails.getAll();
                items = items.filter(item => item.id !== id);
                localStorage.setItem('cocktails', JSON.stringify(items));
            }
        };

        this.orders = {
            getAll: () => {
                const items = localStorage.getItem('orders');
                return items ? JSON.parse(items) : [];
            },
            add: (order) => {
                const items = this.orders.getAll();
                items.push(order);
                localStorage.setItem('orders', JSON.stringify(items));
            },
            update: (id, updatedOrder) => {
                let items = this.orders.getAll();
                items = items.map(item => 
                    item.id === id ? {...item, ...updatedOrder} : item
                );
                localStorage.setItem('orders', JSON.stringify(items));
            },
            delete: (id) => {
                let items = this.orders.getAll();
                items = items.filter(item => item.id !== id);
                localStorage.setItem('orders', JSON.stringify(items));
            }
        };

        console.log('Database initialized');
    }
}

window.DATABASE = Database; 