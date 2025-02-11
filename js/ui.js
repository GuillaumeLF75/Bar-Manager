class UI {
    static initialize() {
        this.setupTheme();
        this.initializeSidebar();
        this.setupEventListeners();
        this.setupPullToRefresh();
        this.setupSwipeActions();
        this.setupHapticFeedback();
        this.addResetButton();
    }

    static setupTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', theme);
    }

    static toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    static toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const isExpanded = sidebar.getAttribute('data-expanded') === 'true';
        sidebar.setAttribute('data-expanded', !isExpanded);
    }

    static initializeSidebar() {
        const savedState = localStorage.getItem('sidebarExpanded') || 'true';
        const sidebar = document.querySelector('.sidebar');
        sidebar.setAttribute('data-expanded', savedState);
    }

    static setupEventListeners() {
        // Add global event listeners here
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close any open modals
                document.querySelectorAll('.modal.active').forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });

        // Responsive navigation
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.body.classList.toggle('nav-open');
            });
        }

        // Handle scroll position
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 50) {
                document.body.classList.add('scroll-down');
            } else {
                document.body.classList.remove('scroll-down');
            }
            lastScroll = currentScroll;
        });
    }

    static setupPullToRefresh() {
        if ('IntersectionObserver' in window) {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.refreshData();
                    }
                });
            }, options);

            const target = document.querySelector('.pull-to-refresh');
            if (target) observer.observe(target);
        }
    }

    static setupSwipeActions() {
        const items = document.querySelectorAll('.swipeable');
        items.forEach(item => {
            let touchstartX = 0;
            let touchendX = 0;

            item.addEventListener('touchstart', e => {
                touchstartX = e.changedTouches[0].screenX;
            });

            item.addEventListener('touchend', e => {
                touchendX = e.changedTouches[0].screenX;
                this.handleSwipe(item, touchstartX, touchendX);
            });
        });
    }

    static handleSwipe(element, start, end) {
        const threshold = 100;
        const diff = start - end;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swipe left - Delete
                element.classList.add('swipe-delete');
            } else {
                // Swipe right - Edit
                element.classList.add('swipe-edit');
            }
        }
    }

    static setupHapticFeedback() {
        const buttons = document.querySelectorAll('.haptic-feedback');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                if ('vibrate' in navigator) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    static showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 3000);
            }, 3000);
        }, 100);
    }

    static async refreshData() {
        this.showToast('Refreshing data...', 'info');
        try {
            await DATABASE.refresh();
            this.showToast('Data updated successfully', 'success');
        } catch (error) {
            this.showToast('Failed to refresh data', 'error');
        }
    }

    static addResetButton() {
        const footer = document.querySelector('.sidebar-footer');
        if (footer) {
            footer.innerHTML = `
                <button onclick="UI.resetDatabase()" class="btn btn-secondary">
                    🔄 Réinitialiser
                </button>
                <button class="btn btn-secondary">
                    <span class="icon">⚙️</span>
                    <span>Paramètres</span>
                </button>
            `;
        }
    }

    static resetDatabase() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser la base de données ? Toutes les données seront effacées.')) {
            localStorage.clear();
            location.reload();
        }
    }
}

// Initialize UI when document is ready
document.addEventListener('DOMContentLoaded', () => UI.initialize()); 