class Food {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || '';
        this.sellingPrice = data.sellingPrice || 0;
        this.ingredients = data.ingredients || [];
        this.totalCost = data.totalCost || 0;
    }

    static fromForm(formData) {
        return new Food({
            name: formData.get('name'),
            sellingPrice: parseFloat(formData.get('sellingPrice')),
            ingredients: [], // À remplir avec les ingrédients sélectionnés
            totalCost: 0 // À calculer
        });
    }
}

window.Food = Food; 