// Only declare DATABASE if it doesn't exist
if (typeof DATABASE === 'undefined') {
    window.DATABASE = {
        stock: {
            data: [],
            initialize() {
                const savedStock = localStorage.getItem('stock');
                this.data = savedStock ? JSON.parse(savedStock) : [
                    // Add some default stock items for testing
                    {
                        id: 1739041326142,
                        name: "Zubrowka",
                        costPerUnit: 0.5,
                        unit: "cl",
                        vat: 21 // Ajout du taux de TVA
                    },
                    // Add more default items as needed
                ];
                localStorage.setItem('stock', JSON.stringify(this.data));
                console.log('Stock initialized:', this.data);
            },
            save() {
                localStorage.setItem('stock', JSON.stringify(this.data));
            },
            getAll() {
                const savedStock = localStorage.getItem('stock');
                if (savedStock) {
                    this.data = JSON.parse(savedStock);
                }
                return this.data || [];
            },
            find(id) {
                const items = this.getAll();
                return items.find(item => item.id === id);
            },
            findByName(name) {
                const items = this.getAll();
                return items.find(item => item.name === name);
            }
        },
        menu: {
            data: {
                cocktails: []  // Initialize empty cocktails array
            },
            initialize() {
                const savedMenu = localStorage.getItem('menu');
                if (savedMenu) {
                    this.data = JSON.parse(savedMenu);
                    // Migration: ajouter TVA si non existante
                    if (this.data.cocktails) {
                        this.data.cocktails = this.data.cocktails.map(item => ({
                            ...item,
                            vat: item.vat || 21 // TVA par défaut
                        }));
                        this.save();
                    }
                } else {
                    // If no saved menu exists, keep the current data
                    localStorage.setItem('menu', JSON.stringify(this.data));
                }
                console.log('Menu initialized:', this.data);
            },
            save() {
                localStorage.setItem('menu', JSON.stringify(this.data));
                console.log('Menu saved:', this.data);
            },
            getAll(category) {
                // Always check localStorage first
                const savedMenu = localStorage.getItem('menu');
                if (savedMenu) {
                    this.data = JSON.parse(savedMenu);
                }
                return category ? this.data[category] || [] : this.data;
            },
            getById: function(category, id) {
                const menuData = DATABASE.menu.initialize();
                if (menuData[category]) {
                    return menuData[category].find(item => item.id === id);
                }
                return null;
            },
            update: function(category, id, updatedItem) {
                const menuData = DATABASE.menu.initialize();
                if (menuData[category]) {
                    const index = menuData[category].findIndex(item => item.id === id);
                    if (index !== -1) {
                        menuData[category][index] = updatedItem;
                        DATABASE.menu.save();
                        return true;
                    }
                }
                return false;
            },
            add(category, item) {
                // Get latest data first
                const savedMenu = localStorage.getItem('menu');
                if (savedMenu) {
                    this.data = JSON.parse(savedMenu);
                }
                
                if (!this.data[category]) {
                    this.data[category] = [];
                }
                this.data[category].push(item);
                this.save();
            },
            delete: function(category, id) {
                const menuData = DATABASE.menu.initialize();
                if (menuData[category]) {
                    menuData[category] = menuData[category].filter(item => item.id !== id);
                    DATABASE.menu.save();
                    return true;
                }
                return false;
            },
            remove(category, id) {
                // Get latest data first
                const savedMenu = localStorage.getItem('menu');
                if (savedMenu) {
                    this.data = JSON.parse(savedMenu);
                }
                
                if (this.data[category]) {
                    this.data[category] = this.data[category].filter(item => item.id !== id);
                    this.save();
                    return true;
                }
                return false;
            },
            removeMultiple(category, ids) {
                // Get latest data first
                const savedMenu = localStorage.getItem('menu');
                if (savedMenu) {
                    this.data = JSON.parse(savedMenu);
                }
                
                if (this.data[category]) {
                    this.data[category] = this.data[category].filter(item => !ids.includes(item.id));
                    this.save();
                    return true;
                }
                return false;
            }
        },
        utils: {
            checkStockAvailability: function(menuItem) {
                const missingIngredients = [];
                menuItem.ingredients.forEach(ingredient => {
                    const stockItem = DATABASE.stock.data.find(item => item.id === ingredient.id);
                    if (!stockItem) {
                        missingIngredients.push(ingredient.name);
                    }
                });
                return {
                    available: missingIngredients.length === 0,
                    missingIngredients
                };
            },
            calculateMenuItemCost: function(menuItem) {
                if (!menuItem || !menuItem.ingredients) {
                    console.log('Invalid menu item:', menuItem);
                    return 0;
                }
                return menuItem.ingredients.reduce((total, ingredient) => {
                    const stockItem = DATABASE.stock.data.find(item => 
                        item.id === ingredient.id
                    );
                    if (stockItem) {
                        return total + (stockItem.costPerUnit * ingredient.quantity);
                    }
                    return total;
                }, 0);
            }
        },
        initialize() {
            this.stock.initialize();
            this.menu.initialize();
            console.log('Database initialized');
        }
    };
}

// Initialize database when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Try to recover any existing data
    const savedMenu = localStorage.getItem('menu');
    if (savedMenu) {
        DATABASE.menu.data = JSON.parse(savedMenu);
    }
    
    DATABASE.stock.initialize();
    DATABASE.menu.initialize();
    console.log('Database initialized:', DATABASE);
}); 