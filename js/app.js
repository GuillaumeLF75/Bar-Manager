class App {
    static initialize() {
        // Initialisation de la base de données
        DATABASE.initialize();
        
        // Création de la structure de base
        document.getElementById('app').innerHTML = `
            <div id="sidebar"></div>
            <div id="content"></div>
        `;
        
        // Initialisation des composants
        document.getElementById('sidebar').innerHTML = Sidebar.getTemplate();
        
        // Initialisation du router
        Router.initialize();
    }
}

// Démarrage de l'application
window.addEventListener('DOMContentLoaded', () => {
    App.initialize();
});

window.App = App; 