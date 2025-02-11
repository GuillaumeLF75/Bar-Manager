function calculatePrices() {
    const volumeWeight = parseFloat(document.getElementById('volumeWeight').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const vatRate = parseFloat(document.getElementById('vatRate').value) || 21;

    // Calculate TTC price
    const vatAmount = purchasePrice * (vatRate / 100);
    const priceTTC = purchasePrice + vatAmount;

    // Calculate cost per unit
    const costPerUnitHT = volumeWeight ? (purchasePrice / volumeWeight) : 0;
    const costPerUnitTTC = volumeWeight ? (priceTTC / volumeWeight) : 0;

    // Update display
    document.getElementById('priceTTC').textContent = priceTTC.toFixed(2);
    document.getElementById('costPerUnitHT').textContent = costPerUnitHT.toFixed(4);
    document.getElementById('costPerUnitTTC').textContent = costPerUnitTTC.toFixed(4);
}

function addStockItem(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const volumeWeight = parseFloat(document.getElementById('volumeWeight').value);
    const unit = document.getElementById('unit').value;
    const purchasePriceHT = parseFloat(document.getElementById('purchasePrice').value);
    const vatRate = parseFloat(document.getElementById('vatRate').value);

    // Validation
    if (!productName || !volumeWeight || !purchasePriceHT) {
        UI.showToast('Please fill in all required fields', 'error');
        return;
    }

    // Calculate values
    const vatAmount = purchasePriceHT * (vatRate / 100);
    const priceTTC = purchasePriceHT + vatAmount;
    const costPerUnitHT = purchasePriceHT / volumeWeight;
    const costPerUnitTTC = priceTTC / volumeWeight;

    const stockItem = {
        id: Date.now(),
        name: productName,
        volume: volumeWeight,
        unit: unit,
        purchasePriceHT: purchasePriceHT,
        priceTTC: priceTTC,
        vatRate: vatRate,
        vatAmount: vatAmount,
        costPerUnitHT: costPerUnitHT,
        costPerUnitTTC: costPerUnitTTC,
        createdAt: Date.now()
    };

    try {
        DATABASE.stock.add(stockItem);
        UI.showToast('Item added successfully', 'success');
        document.getElementById('stockForm').reset();
        calculatePrices(); // Reset calculations
    } catch (error) {
        UI.showToast('Failed to add item', 'error');
        console.error('Error adding stock item:', error);
    }
} 