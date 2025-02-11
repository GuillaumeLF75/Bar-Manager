function addIngredientRow() {
    const tbody = document.getElementById('ingredientsList');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" class="ingredient-name" placeholder="Ingredient name"></td>
        <td><input type="number" class="volume" step="0.01"></td>
        <td><input type="number" class="cost-per-unit" step="0.01"></td>
        <td class="total-cost">€0.00</td>
        <td class="margin-percentage"></td>
        <td class="mark-up"></td>
        <td class="suggested-price"></td>
    `;
    tbody.appendChild(newRow);
}

function calculateTotals() {
    const rows = document.querySelectorAll('#ingredientsList tr');
    let totalVolume = 0;
    let totalCost = 0;

    // Calculate individual rows
    rows.forEach(row => {
        const volume = parseFloat(row.querySelector('.volume').value) || 0;
        const costPerUnit = parseFloat(row.querySelector('.cost-per-unit').value) || 0;
        const itemTotalCost = volume * costPerUnit;

        totalVolume += volume;
        totalCost += itemTotalCost;

        // Update row totals
        row.querySelector('.total-cost').textContent = `€${itemTotalCost.toFixed(2)}`;
    });

    // Calculate suggested price (using 80% margin as example)
    const targetMargin = 0.80;
    const markUp = totalCost / (1 - targetMargin);
    const suggestedPrice = markUp;

    // Update footer totals
    document.getElementById('totalVolume').textContent = totalVolume.toFixed(2);
    document.getElementById('totalCost').textContent = `€${totalCost.toFixed(2)}`;
    document.getElementById('totalMargin').textContent = `${(targetMargin * 100).toFixed(0)}%`;
    document.getElementById('totalMarkup').textContent = `€${markUp.toFixed(2)}`;
    document.getElementById('finalPrice').textContent = `€${suggestedPrice.toFixed(2)}`;

    // Update individual row margins
    rows.forEach(row => {
        const itemCost = parseFloat(row.querySelector('.total-cost').textContent.replace('€', '')) || 0;
        const itemMarginPercentage = ((markUp - itemCost) / markUp * 100);
        row.querySelector('.margin-percentage').textContent = `${itemMarginPercentage.toFixed(0)}%`;
        row.querySelector('.mark-up').textContent = `€${(itemCost / (1 - targetMargin)).toFixed(2)}`;
        row.querySelector('.suggested-price').textContent = `€${(itemCost / (1 - targetMargin)).toFixed(2)}`;
    });
}

function showMenuCategory(category) {
    // Hide all menu categories
    const menuCategories = document.getElementsByClassName('menu-category-content');
    for (let content of menuCategories) {
        content.classList.remove('active');
    }
    
    // Remove active class from all menu tab buttons
    const menuButtons = document.getElementsByClassName('menu-tab-button');
    for (let button of menuButtons) {
        button.classList.remove('active');
    }
    
    // Show selected category and activate button
    document.getElementById(category).classList.add('active');
    event.currentTarget.classList.add('active');
}

function addMenuItem(category) {
    const tbody = document.getElementById(`${category}List`);
    let newRow = document.createElement('tr');
    
    if (category === 'spirits') {
        newRow.innerHTML = `
            <td><input type="text" class="item-name" placeholder="Spirit name"></td>
            <td><input type="number" class="volume" value="40" step="1"></td>
            <td class="cost">€0.00</td>
            <td><input type="number" class="selling-price" step="0.01"></td>
            <td class="margin">0%</td>
            <td>
                <button onclick="editItem(this)">Edit</button>
                <button onclick="deleteMenuItem(this)">Delete</button>
            </td>
        `;
    } else {
        newRow.innerHTML = `
            <td><input type="text" class="item-name" placeholder="Item name"></td>
            <td>
                <button onclick="editIngredients(this)">Edit Ingredients</button>
                <ul class="ingredient-list"></ul>
            </td>
            <td class="cost">€0.00</td>
            <td><input type="number" class="selling-price" step="0.01"></td>
            <td class="margin">0%</td>
            <td>
                <button onclick="editItem(this)">Edit</button>
                <button onclick="deleteMenuItem(this)">Delete</button>
            </td>
        `;
    }
    
    tbody.appendChild(newRow);
}

function editIngredients(button) {
    const row = button.closest('tr');
    // Create a modal or popup for ingredient selection
    showIngredientsModal(row);
}

function showIngredientsModal(row) {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Edit Ingredients</h3>
            <div class="ingredient-selector">
                <select id="ingredientSelect">
                    ${getStockItemsAsOptions()}
                </select>
                <input type="number" id="ingredientAmount" placeholder="Amount" step="0.01">
                <button onclick="addIngredientToItem()">Add</button>
            </div>
            <div class="current-ingredients">
                <h4>Current Ingredients</h4>
                <ul id="currentIngredientsList"></ul>
            </div>
            <button onclick="closeIngredientsModal()">Done</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function calculateMargin(row) {
    const cost = parseFloat(row.querySelector('.cost').textContent.replace('€', '')) || 0;
    const price = parseFloat(row.querySelector('.selling-price').value) || 0;
    if (price > 0) {
        const margin = ((price - cost) / price) * 100;
        row.querySelector('.margin').textContent = `${margin.toFixed(1)}%`;
    }
}

function deleteMenuItem(button) {
    button.closest('tr').remove();
}

// Add initial row when page loads
document.addEventListener('DOMContentLoaded', () => {
    calculateTotals();
    
    // Add initial menu items for each category
    addMenuItem('signature');
    addMenuItem('classics');
    addMenuItem('spirits');
    addMenuItem('food');
});

// Updated JavaScript with database management
let DATABASE = {
    // Initialize or load existing stock database
    initializeStock: function() {
        const savedStock = localStorage.getItem('stockDatabase');
        return savedStock ? JSON.parse(savedStock) : [];
    },

    // Save stock database
    saveStock: function(stockData) {
        localStorage.setItem('stockDatabase', JSON.stringify(stockData));
    },

    // Initialize or load existing menu database
    initializeMenu: function() {
        const savedMenu = localStorage.getItem('menuDatabase');
        return savedMenu ? JSON.parse(savedMenu) : {
            cocktails: [],
            food: [],
            other: []
        };
    },

    // Save menu database
    saveMenu: function(menuData) {
        localStorage.setItem('menuDatabase', JSON.stringify(menuData));
    },

    // Helper functions for stock management
    stock: {
        add: function(item) {
            const stockData = DATABASE.initializeStock();
            stockData.push(item);
            DATABASE.saveStock(stockData);
        },

        update: function(id, updatedItem) {
            const stockData = DATABASE.initializeStock();
            const index = stockData.findIndex(item => item.id === id);
            if (index !== -1) {
                stockData[index] = updatedItem;
                DATABASE.saveStock(stockData);
                return true;
            }
            return false;
        },

        delete: function(id) {
            const stockData = DATABASE.initializeStock();
            const filteredData = stockData.filter(item => item.id !== id);
            DATABASE.saveStock(filteredData);
        },

        getAll: function() {
            return DATABASE.initializeStock();
        },

        getById: function(id) {
            const stockData = DATABASE.initializeStock();
            return stockData.find(item => item.id === id);
        },

        findByName: function(name) {
            const stockData = DATABASE.initializeStock();
            return stockData.find(item => item.name === name);
        }
    },

    // Helper functions for menu management
    menu: {
        add: function(category, item) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                menuData[category].push(item);
                DATABASE.saveMenu(menuData);
                return true;
            }
            return false;
        },

        update: function(category, id, updatedItem) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                const index = menuData[category].findIndex(item => item.id === id);
                if (index !== -1) {
                    menuData[category][index] = updatedItem;
                    DATABASE.saveMenu(menuData);
                    return true;
                }
            }
            return false;
        },

        delete: function(category, id) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                menuData[category] = menuData[category].filter(item => item.id !== id);
                DATABASE.saveMenu(menuData);
                return true;
            }
            return false;
        },

        getAll: function(category) {
            const menuData = DATABASE.initializeMenu();
            return category ? menuData[category] : menuData;
        },

        getById: function(category, id) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                return menuData[category].find(item => item.id === id);
            }
            return null;
        },

        remove: function(category, id) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                menuData[category] = menuData[category].filter(item => item.id !== id);
                DATABASE.saveMenu(menuData);
                return true;
            }
            return false;
        },

        removeMultiple: function(category, ids) {
            const menuData = DATABASE.initializeMenu();
            if (menuData[category]) {
                menuData[category] = menuData[category].filter(item => !ids.includes(item.id));
                DATABASE.saveMenu(menuData);
                return true;
            }
            return false;
        }
    }
};

function addStockItem(event) {
    event.preventDefault();
    
    const item = {
        id: Date.now(),
        name: document.getElementById('productName').value,
        volume: parseFloat(document.getElementById('volume').value),
        unit: document.getElementById('unit').value,
        price: parseFloat(document.getElementById('price').value),
        costPerUnit: calculateCostPerUnit(
            parseFloat(document.getElementById('price').value),
            parseFloat(document.getElementById('volume').value)
        )
    };
    
    DATABASE.stock.add(item);
    updateDatabaseView();
    document.getElementById('stockForm').reset();
    showNotification('Stock item added successfully!');
}

function calculateCostPerUnit(price, volume) {
    return price / volume;
}

function updateDatabaseView() {
    const tbody = document.getElementById('stockDatabaseBody');
    tbody.innerHTML = '';
    
    const stockData = DATABASE.stock.getAll();
    stockData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.volume}</td>
            <td>${item.unit}</td>
            <td>€${item.price.toFixed(2)}</td>
            <td>€${item.costPerUnit.toFixed(3)}/${item.unit}</td>
            <td class="action-buttons">
                <button class="edit-btn" onclick="editStockItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStockItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchDatabase() {
    const searchTerm = document.getElementById('searchStock').value.toLowerCase();
    const rows = document.getElementById('stockDatabaseBody').getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function filterDatabase() {
    const filter = document.getElementById('filterStock').value;
    const rows = document.getElementById('stockDatabaseBody').getElementsByTagName('tr');
    
    Array.from(rows).forEach(row => {
        if (filter === 'all' || row.children[2].textContent === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function editStockItem(id) {
    const item = DATABASE.stock.getById(id);
    if (!item) return;
    
    // Populate form with item data
    document.getElementById('productName').value = item.name;
    document.getElementById('volume').value = item.volume;
    document.getElementById('unit').value = item.unit;
    document.getElementById('price').value = item.price;
    
    // Remove old item
    deleteStockItem(id);
}

function deleteStockItem(id) {
    DATABASE.stock.delete(id);
    updateDatabaseView();
    showNotification('Item removed from database');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDatabaseView();
});

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add this CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Add these new functions for menu item management
let stockItems = []; // This would be populated from your database

function toggleIngredientFields() {
    const itemType = document.getElementById('itemType').value;
    // You can add specific logic for different item types if needed
}

// Add this function to populate ingredient selection with items from stockDatabase
function populateIngredientSelect(select) {
    const stockData = DATABASE.stock.getAll();
    select.innerHTML = `
        <option value="">Select ingredient</option>
        ${stockData.map(item => `
            <option value="${item.id}" 
                    data-cost="${item.costPerUnit}" 
                    data-unit="${item.unit}">
                ${item.name} (${item.costPerUnit.toFixed(3)}€/${item.unit})
            </option>
        `).join('')}
    `;
}

function addIngredientField() {
    const ingredientsList = document.getElementById('ingredientsList');
    const ingredientNumber = ingredientsList.children.length + 1;
    
    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    
    newRow.innerHTML = `
        <input list="ingredientOptions" class="ingredient-select form-control" placeholder="Ingredients ${ingredientNumber}">
        <input type="number" class="quantity-input form-control" placeholder="quantity" step="0.1">
        <select class="unit-select form-control">
            <option value="ml">mL</option>
            <option value="g">g</option>
        </select>
    `;
    
    ingredientsList.appendChild(newRow);
}

function updateIngredientOptions() {
    const datalist = document.getElementById('ingredientOptions');
    const stockData = DATABASE.stock.getAll();
    
    // Clear existing options
    datalist.innerHTML = '';
    
    // Add all stock items
    stockData.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.setAttribute('data-id', item.id);
        option.setAttribute('data-unit', item.unit);
        datalist.appendChild(option);
    });
}

// Call this when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateIngredientOptions();
});

function generateStockOptions() {
    const stockData = DATABASE.stock.getAll();
    return stockData.map(item => `
        <option value="${item.name}" data-id="${item.id}" data-unit="${item.unit}">
    `).join('');
}

function updateCost(row) {
    const select = row.querySelector('.ingredient-select');
    const quantity = parseFloat(row.querySelector('.quantity-input').value) || 0;
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        const costPerUnit = parseFloat(selectedOption.dataset.cost);
        const totalCost = costPerUnit * quantity;
        row.querySelector('.price-display').textContent = `€${totalCost.toFixed(2)}`;
    }
    
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    document.querySelectorAll('.ingredient-row').forEach(row => {
        const price = parseFloat(row.querySelector('.price-display').textContent.replace('€', '')) || 0;
        total += price;
    });
    
    document.getElementById('totalCost').textContent = `€${total.toFixed(2)}`;
}

function calculateMargin(price, cost) {
    return price - cost;
}

function calculateMarginPercentage(price, cost) {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
}

function updateMenuList() {
    console.log('Starting updateMenuList...');
    const menuItems = DATABASE.menu.getAll('cocktails');
    console.log('Retrieved menu items:', menuItems);
    
    const tbody = document.getElementById('menuItemsList').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    
    if (!menuItems || menuItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No menu items yet</td></tr>';
        return;
    }

    menuItems.forEach(item => {
        const costs = calculateMenuItemCost(item);
        const margin = calculateMargin(item.price, costs.ttc);
        const marginPercentage = calculateMarginPercentage(item.price, costs.ttc);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" name="menuItem" value="${item.id}" onchange="updateDeleteButtonState()">
            </td>
            <td>${item.name}</td>
            <td>€${item.price.toFixed(2)}</td>
            <td>€${costs.ttc.toFixed(2)}</td>
            <td>${item.vat}%</td>
            <td>€${costs.ht.toFixed(2)}</td>
            <td>€${costs.ttc.toFixed(2)}</td>
            <td>€${margin.toFixed(2)}</td>
            <td>${marginPercentage.toFixed(1)}%</td>
            <td>
                <button onclick="editMenuItem(${item.id})" class="edit-btn">Edit</button>
                <button onclick="deleteMenuItem(${item.id})" class="delete-btn">Delete</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

let currentSortColumn = null;
let currentSortDirection = 'asc';

function editMenuItem(id) {
    const menuItems = DATABASE.menu.getAll('cocktails');
    const item = menuItems.find(item => item.id === id);
    if (!item) return;
    
    // Populate the form with item data
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemPrice').value = item.price;
    
    // Remove existing ingredient rows
    const ingredientContainer = document.querySelector('.ingredients-container');
    while (ingredientContainer.children.length > 0) {
        ingredientContainer.removeChild(ingredientContainer.lastChild);
    }
    
    // Add ingredient rows for existing ingredients
    item.ingredients.forEach(ing => {
        addIngredientRow();
        const lastRow = ingredientContainer.lastChild;
        lastRow.querySelector('.ingredient-select').value = ing.name;
        lastRow.querySelector('.quantity-input').value = ing.quantity;
        lastRow.querySelector('.unit-select').value = ing.unit;
    });
    
    // Change save button to update mode
    const saveButton = document.querySelector('button[onclick="saveMenuItem()"]');
    saveButton.textContent = 'Update Item';
    saveButton.onclick = () => updateMenuItem(id);
    
    // Scroll to form
    document.querySelector('.menu-form').scrollIntoView({ behavior: 'smooth' });
}

function updateMenuItem(id) {
    // Similar to saveMenuItem but updates existing item
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    
    if (!name || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    const ingredients = [];
    document.querySelectorAll('.ingredient-row').forEach(row => {
        const ingredientInput = row.querySelector('.ingredient-select');
        const quantity = parseFloat(row.querySelector('.quantity-input').value);
        const unit = row.querySelector('.unit-select').value;
        
        if (ingredientInput.value && quantity) {
            ingredients.push({
                id: Date.now(),
                name: ingredientInput.value,
                quantity: quantity,
                unit: unit
            });
        }
    });
    
    if (ingredients.length === 0) {
        alert('Please add at least one ingredient');
        return;
    }
    
    // Update the item in the database
    const menuItems = DATABASE.menu.getAll('cocktails');
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        menuItems[itemIndex] = {
            ...menuItems[itemIndex],
            name,
            price,
            ingredients,
            updatedAt: Date.now()
        };
        DATABASE.menu.data.cocktails = menuItems;
        DATABASE.menu.save();
    }
    
    // Reset form
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    const saveButton = document.querySelector('button[onclick="updateMenuItem(' + id + ')"]');
    saveButton.textContent = 'Save Item';
    saveButton.onclick = saveMenuItem;
    
    // Update display
    updateMenuList();
}

function sortMenuItems(criteria) {
    if (currentSortColumn === criteria) {
        // Toggle direction if clicking the same column
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = criteria;
        currentSortDirection = 'asc';
    }
    
    const menuItems = [...DATABASE.menu.getAll('cocktails')];
    
    menuItems.sort((a, b) => {
        const costA = calculateMenuItemCost(a);
        const costB = calculateMenuItemCost(b);
        let comparison = 0;
        
        switch(criteria) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'price':
                comparison = a.price - b.price;
                break;
            case 'cost':
                comparison = costA - costB;
                break;
            case 'margin-amount':
                comparison = (a.price - costA) - (b.price - costB);
                break;
            case 'margin-percent':
                const percentA = ((a.price - costA) / a.price) * 100;
                const percentB = ((b.price - costB) / b.price) * 100;
                comparison = percentA - percentB;
                break;
        }
        
        return currentSortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Update sort indicators
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.textContent = '↕';
    });
    const header = document.querySelector(`th[data-sort="${criteria}"]`);
    if (header) {
        header.querySelector('.sort-indicator').textContent = 
            currentSortDirection === 'asc' ? '↑' : '↓';
    }
    
    DATABASE.menu.data.cocktails = menuItems;
    DATABASE.menu.save();
    updateMenuList();
}

function saveMenuItem() {
    const name = document.getElementById('itemName').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    
    if (!name || !price) {
        alert('Please fill in all fields');
        return;
    }
    
    const ingredients = [];
    document.querySelectorAll('.ingredient-row').forEach(row => {
        const ingredientInput = row.querySelector('.ingredient-select');
        const quantity = parseFloat(row.querySelector('.quantity-input').value);
        const unit = row.querySelector('.unit-select').value;
        
        if (ingredientInput.value && quantity) {
            ingredients.push({
                id: Date.now(),
                name: ingredientInput.value,
                quantity: quantity,
                unit: unit
            });
        }
    });
    
    if (ingredients.length === 0) {
        alert('Please add at least one ingredient');
        return;
    }
    
    const menuItem = {
        id: Date.now(),
        name: name,
        price: price,
        ingredients: ingredients,
        createdAt: Date.now()
    };
    
    DATABASE.menu.add('cocktails', menuItem);
    
    // Clear form
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.querySelectorAll('.ingredient-row').forEach(row => {
        if (row !== document.querySelector('.ingredient-row')) {
            row.remove();
        }
    });
    
    // Update the display
    updateMenuList();
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateMenuList();
});

// Add delete functionality
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        DATABASE.menu.remove('cocktails', id);
        updateMenuList();
    }
}

// Add these functions at the top
function toggleAllCheckboxes(source) {
    const checkboxes = document.getElementsByName('menuItem');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
    updateDeleteButtonState();
}

function updateDeleteButtonState() {
    const checkboxes = document.getElementsByName('menuItem');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const anyChecked = Array.from(checkboxes).some(cb => cb.checked);
    deleteSelectedBtn.disabled = !anyChecked;
}

function deleteSelectedItems() {
    const checkboxes = document.getElementsByName('menuItem');
    const selectedIds = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedIds.length} item(s)?`)) {
        DATABASE.menu.removeMultiple('cocktails', selectedIds);
        updateMenuList();
    }
}

// Add these calculation functions
function calculateMenuItemCost(menuItem) {
    if (!menuItem || !menuItem.ingredients) {
        return { ht: 0, ttc: 0, vat: 0 };
    }

    const costHT = menuItem.ingredients.reduce((total, ingredient) => {
        const stockItem = DATABASE.stock.find(ingredient.id);
        if (stockItem) {
            const ingredientCostHT = stockItem.costPerUnit * ingredient.quantity;
            return total + ingredientCostHT;
        }
        return total;
    }, 0);

    const vatAmount = calculateVAT(costHT, menuItem.vat);
    const costTTC = costHT + vatAmount;

    return {
        ht: costHT,
        ttc: costTTC,
        vat: vatAmount
    };
}

function calculateVAT(amount, vatRate) {
    return amount * (vatRate / 100);
}

function calculateHT(ttc, vatRate) {
    return ttc / (1 + vatRate / 100);
}

function calculateMargin(price, cost) {
    return price - cost;
}

function calculateMarginPercentage(price, cost) {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
}

// Add search functionality
function searchMenuItems(query) {
    const menuItems = DATABASE.menu.getAll('cocktails');
    const filtered = menuItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.ingredients.some(ing => ing.name.toLowerCase().includes(query.toLowerCase()))
    );
    renderMenuItems(filtered);
}

// Add export functionality
function exportMenuItems(format = 'csv') {
    const menuItems = DATABASE.menu.getAll('cocktails');
    
    if (format === 'csv') {
        const headers = [
            'Name',
            'Prix TTC',
            'Prix HT',
            'TVA (%)',
            'TVA (€)',
            'Coût HT',
            'Coût TTC',
            'Marge HT',
            'Marge (%)',
            'Ingredients'
        ];
        
        const csvContent = [
            headers.join(','),
            ...menuItems.map(item => {
                const costs = calculateMenuItemCost(item);
                const marginHT = item.priceHT - costs.ht;
                const marginPercentage = (marginHT / item.priceHT) * 100;
                const ingredients = item.ingredients
                    .map(i => `${i.quantity}${i.unit} ${i.name}`)
                    .join('; ');
                
                return [
                    item.name,
                    item.price.toFixed(2),
                    item.priceHT.toFixed(2),
                    item.vat,
                    (item.price - item.priceHT).toFixed(2),
                    costs.ht.toFixed(2),
                    costs.ttc.toFixed(2),
                    marginHT.toFixed(2),
                    marginPercentage.toFixed(1),
                    ingredients
                ].join(',');
            })
        ].join('\n');
        
        downloadFile(csvContent, 'menu-items.csv', 'text/csv');
    }
}

// Add import functionality
function importMenuItems(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        // Skip header row
        rows.slice(1).forEach(row => {
            const [name, price, , , , ingredients] = row.split(',');
            // Parse ingredients string and create menu item
            const ingredientsList = ingredients.split(';').map(ing => {
                const match = ing.trim().match(/(\d+)(\w+)\s+(.+)/);
                if (match) {
                    return {
                        quantity: parseFloat(match[1]),
                        unit: match[2],
                        name: match[3].trim()
                    };
                }
                return null;
            }).filter(Boolean);
            
            const menuItem = {
                id: Date.now(),
                name: name.trim(),
                price: parseFloat(price),
                ingredients: ingredientsList
            };
            
            DATABASE.menu.add('cocktails', menuItem);
        });
        updateMenuList();
    };
    reader.readAsText(file);
} 