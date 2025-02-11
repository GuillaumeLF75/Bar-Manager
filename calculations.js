function calculatePrices() {
    const priceHT = parseFloat(document.getElementById('priceHT').value) || 0;
    const vatRate = parseFloat(document.getElementById('vatRate').value) || 21;
    const volumeWeight = parseFloat(document.getElementById('volumeWeight').value) || 0;

    // Calcul TVA et TTC
    const vatAmount = priceHT * (vatRate / 100);
    const priceTTC = priceHT + vatAmount;

    // Calcul coûts unitaires
    const costPerUnitHT = volumeWeight ? priceHT / volumeWeight : 0;
    const costPerUnitTTC = volumeWeight ? priceTTC / volumeWeight : 0;

    // Mise à jour de l'interface
    updateCalculatedValues({
        priceTTC,
        vatAmount,
        costPerUnitHT,
        costPerUnitTTC
    });
}

function updateCalculatedValues(values) {
    document.getElementById('priceTTC').textContent = 
        formatCurrency(values.priceTTC);
    document.getElementById('vatAmount').textContent = 
        formatCurrency(values.vatAmount);
    document.getElementById('costPerUnitHT').textContent = 
        formatCurrency(values.costPerUnitHT, 4);
    document.getElementById('costPerUnitTTC').textContent = 
        formatCurrency(values.costPerUnitTTC, 4);
}

function formatCurrency(value, decimals = 2) {
    return `€${value.toFixed(decimals)}`;
}

// Mise à jour dynamique
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['priceHT', 'vatRate', 'volumeWeight'];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculatePrices);
    });
}); 