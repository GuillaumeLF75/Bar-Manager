class Ingredient {
    constructor(data = {}) {
        this.id = data.id || Date.now().toString();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.unit = data.unit || 'cl';
        this.stock = {
            current: data.stock?.current || 0,
            minimum: data.stock?.minimum || 0
        };
    }

    static fromForm(formData) {
        return new Ingredient({
            name: formData.get('name'),
            price: parseFloat(formData.get('price')),
            unit: formData.get('unit'),
            stock: {
                current: parseInt(formData.get('stockInitial')),
                minimum: parseInt(formData.get('stockMinimum'))
            }
        });
    }

    updateStock(quantity) {
        this.stock.current += quantity;
        if (this.stock.current < this.stock.minimum) {
            UI.showToast(`Stock bas pour ${this.name}`, 'warning');
        }
    }

    get stockStatus() {
        if (this.stock.current <= 0) return 'out';
        if (this.stock.current <= this.stock.minimum) return 'low';
        return 'ok';
    }
} 