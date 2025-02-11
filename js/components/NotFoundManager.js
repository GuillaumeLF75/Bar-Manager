class NotFoundManager {
    static initialize() {
        // Pas besoin d'initialisation spéciale
    }

    static getTemplate() {
        return `
            <div class="not-found-page">
                <div class="not-found-content">
                    <h1>404</h1>
                    <p>Oups ! La page que vous cherchez n'existe pas.</p>
                    <a href="#" class="btn btn-primary">Retour à l'accueil</a>
                </div>
            </div>
        `;
    }
}

window.NotFoundManager = NotFoundManager; 