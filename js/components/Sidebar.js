class Sidebar {
    static getTemplate() {
        return `
            <aside class="sidebar">
                <h1>Bar Manager</h1>
                <nav>
                    <a href="#" class="nav-item ${!window.location.hash ? 'active' : ''}">
                        <span>🏠</span> Accueil
                    </a>
                    <a href="#ingredients" class="nav-item ${window.location.hash === '#ingredients' ? 'active' : ''}">
                        <span>🧂</span> Ingrédients
                    </a>
                    <a href="#cocktails" class="nav-item ${window.location.hash === '#cocktails' ? 'active' : ''}">
                        <span>🍸</span> Cocktails
                    </a>
                    <a href="#food" class="nav-item ${window.location.hash === '#food' ? 'active' : ''}">
                        <span>🍽️</span> Snacks
                    </a>
                    <a href="#orders" class="nav-item ${window.location.hash === '#orders' ? 'active' : ''}">
                        <span>📝</span> Commandes
                    </a>
                    <a href="#statistics" class="nav-item ${window.location.hash === '#statistics' ? 'active' : ''}">
                        <span>📊</span> Statistiques
                    </a>
                </nav>
            </aside>
        `;
    }
}

window.Sidebar = Sidebar; 