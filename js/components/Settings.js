class Settings {
    static getTemplate() {
        return `
            <div class="settings-page">
                <header class="page-header">
                    <h1>Paramètres</h1>
                </header>

                <div class="settings-grid">
                    <!-- TVA Settings -->
                    <div class="settings-card card">
                        <h3>Gestion des TVA</h3>
                        <div class="vat-settings">
                            <div class="vat-rates">
                                <h4>Taux de TVA</h4>
                                <div class="vat-rate-list" id="vatRatesList">
                                    <div class="vat-rate-item">
                                        <span>21%</span>
                                        <span>Standard</span>
                                    </div>
                                    <div class="vat-rate-item">
                                        <span>10%</span>
                                        <span>Réduit</span>
                                    </div>
                                    <div class="vat-rate-item">
                                        <span>4%</span>
                                        <span>Super réduit</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Categories Settings -->
                    <div class="settings-card card">
                        <h3>Catégories</h3>
                        <div class="categories-settings">
                            <div class="category-list" id="categoriesList">
                                <!-- Filled dynamically -->
                            </div>
                            <button class="btn btn-secondary" onclick="Settings.addCategory()">
                                Ajouter une catégorie
                            </button>
                        </div>
                    </div>

                    <!-- Units Settings -->
                    <div class="settings-card card">
                        <h3>Unités de mesure</h3>
                        <div class="units-settings">
                            <div class="unit-list" id="unitsList">
                                <!-- Filled dynamically -->
                            </div>
                            <button class="btn btn-secondary" onclick="Settings.addUnit()">
                                Ajouter une unité
                            </button>
                        </div>
                    </div>

                    <!-- Preferences -->
                    <div class="settings-card card">
                        <h3>Préférences</h3>
                        <div class="preferences-form">
                            <div class="form-group">
                                <label>Devise</label>
                                <select class="form-control" id="currencySelect">
                                    <option value="EUR">Euro (€)</option>
                                    <option value="USD">Dollar ($)</option>
                                    <option value="GBP">Livre (£)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Format de date</label>
                                <select class="form-control" id="dateFormatSelect">
                                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ... méthodes de gestion des paramètres
} 