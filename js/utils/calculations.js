class Calculations {
    static formatCurrency(amount) {
        return amount.toFixed(2) + ' €';
    }

    static formatPercent(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 1
        }).format(value / 100);
    }

    static calculateTTC(priceHT, vatRate) {
        return priceHT * (1 + vatRate / 100);
    }

    static calculateHT(priceTTC, vatRate) {
        return priceTTC / (1 + vatRate / 100);
    }

    static calculateMargin(sellingPrice, costPrice) {
        return ((sellingPrice - costPrice) / sellingPrice * 100).toFixed(1);
    }

    static calculateMarginAmount(costPrice, sellingPrice) {
        return sellingPrice - costPrice;
    }

    static roundTo2Decimals(number) {
        return Math.round(number * 100) / 100;
    }
}

window.Calculations = Calculations; 