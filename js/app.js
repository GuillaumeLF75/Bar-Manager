document.addEventListener('DOMContentLoaded', () => {
    // Initialize core components
    UI.initialize();
    DATABASE.initialize();
    
    // Initialize router
    window.router = new Router();
    
    // Add routes
    router.addRoute('/ingredients', () => {
        document.getElementById('mainContent').innerHTML = IngredientsManager.getTemplate();
        IngredientsManager.initialize();
    });

    router.addRoute('/products', () => {
        document.getElementById('mainContent').innerHTML = ProductsManager.getTemplate();
        ProductsManager.initialize();
    });

    router.addRoute('/dishes', () => {
        document.getElementById('mainContent').innerHTML = DishesManager.getTemplate();
        DishesManager.initialize();
    });

    router.addRoute('/costs', () => {
        document.getElementById('mainContent').innerHTML = CostsManager.getTemplate();
        CostsManager.initialize();
    });

    router.addRoute('/stock', () => {
        document.getElementById('mainContent').innerHTML = StockManager.getTemplate();
        StockManager.initialize();
    });

    router.addRoute('/orders', () => {
        document.getElementById('mainContent').innerHTML = OrdersManager.getTemplate();
        OrdersManager.initialize();
    });

    router.addRoute('/stats', () => {
        document.getElementById('mainContent').innerHTML = StatsManager.getTemplate();
        StatsManager.initialize();
    });

    // Navigate to initial route
    const initialRoute = window.location.hash.slice(1) || '/ingredients';
    router.navigate(initialRoute);
}); 