// blink.js adapté pour un proxy local sur 192.168.1.32:3001

const PROXY_BASE = "http://192.168.1.32:3001/proxy?url=";

// Gestion des vues
const views = {
    'home': document.getElementById('home-view'),
    'browser': document.getElementById('browser-view'),
    'apps': document.getElementById('apps-view'),
    'android': document.getElementById('android-view')
};

// Navigation
function showView(viewId) {
    Object.values(views).forEach(view => {
        view.style.display = 'none';
    });
    if (views[viewId]) {
        views[viewId].style.display = 'block';
    }
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.footer-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const navItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
    if (navItem) navItem.classList.add('active');
    const footerBtn = document.querySelector(`.footer-btn[data-view="${viewId}"]`);
    if (footerBtn) footerBtn.classList.add('active');
}

// Initialiser les écouteurs d'événements
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        if (viewId) showView(viewId);
    });
});
document.querySelectorAll('.footer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const viewId = btn.getAttribute('data-view');
        if (viewId) showView(viewId);
    });
});

// Toggle sidebar
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
});

// Toggle plein écran
document.getElementById('fullscreen-toggle').addEventListener('click', () => {
    document.querySelector('.app-container').classList.toggle('fullscreen-mode');
});

// Navigation dans le navigateur
const webview = document.getElementById('webview');
const urlInput = document.getElementById('url-input');
const searchInput = document.getElementById('search-input');

// Navigation via le proxy
function navigateToUrl() {
    let url = urlInput.value.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    webview.src = PROXY_BASE + encodeURIComponent(url);
}

// Bouton go
document.getElementById('go-btn').addEventListener('click', navigateToUrl);
urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') navigateToUrl();
});

// Recherche Google via proxy
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            showView('browser');
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            webview.src = PROXY_BASE + encodeURIComponent(googleUrl);
            urlInput.value = googleUrl;
        }
    }
});

// Navigation (retour/avant/refresh)
document.getElementById('back-btn').addEventListener('click', () => {
    try { webview.contentWindow.history.back(); } catch (e) {}
});
document.getElementById('forward-btn').addEventListener('click', () => {
    try { webview.contentWindow.history.forward(); } catch (e) {}
});
document.getElementById('refresh-btn').addEventListener('click', () => {
    try { webview.contentWindow.location.reload(); } catch (e) {}
});

// Mise à jour de l'URL lors de la navigation
webview.addEventListener('load', () => {
    try {
        urlInput.value = webview.contentWindow.location.href;
    } catch (e) {}
});

// Lancement d'applications via proxy
document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const app = card.getAttribute('data-app');
        let url = '';
        switch(app) {
            case 'netflix':
                url = 'https://netflix.com';
                break;
            case 'youtube':
                url = 'https://youtube.com';
                break;
            case 'twitter':
                url = 'https://twitter.com';
                break;
            case 'spotify':
                url = 'https://open.spotify.com';
                break;
            case 'gaming':
                url = 'https://geforcenow.com';
                break;
            case 'emulator':
                url = 'https://retroarch.com';
                break;
            case 'apetize':
                url = 'https://appetize.io';
                break;
            case 'wasm':
                createNotification('Lancement d\'une application WebAssembly optimisée pour la Switch!');
                return;
        }
        showView('browser');
        webview.src = PROXY_BASE + encodeURIComponent(url);
        urlInput.value = url;
    });
});

// Contrôles Joy-Con
document.querySelectorAll('.joycon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.id.replace('joycon-', '');
        let message = '';
        switch(action) {
            case 'up':
                message = 'Navigation vers le haut';
                try { webview.contentWindow.scrollBy(0, -50); } catch (e) {}
                break;
            case 'down':
                message = 'Navigation vers le bas';
                try { webview.contentWindow.scrollBy(0, 50); } catch (e) {}
                break;
            case 'left':
                message = 'Navigation vers la gauche';
                try { webview.contentWindow.scrollBy(-50, 0); } catch (e) {}
                break;
            case 'right':
                message = 'Navigation vers la droite';
                try { webview.contentWindow.scrollBy(50, 0); } catch (e) {}
                break;
            case 'a':
                message = 'Action principale (clic)';
                try {
                    const event = new MouseEvent('click', {
                        view: webview.contentWindow,
                        bubbles: true,
                        cancelable: true
                    });
                    webview.contentWindow.document.elementFromPoint(100, 100).dispatchEvent(event);
                } catch (e) {}
                break;
        }
        createNotification(message);
    });
});

// Notification
function createNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2s forwards';
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 2300);
}

// Lancer Android Cloud via proxy
document.getElementById('start-android').addEventListener('click', () => {
    createNotification('Démarrage de l\'environnement Android...');
    setTimeout(() => {
        showView('browser');
        const url = 'https://appetize.io/';
        webview.src = PROXY_BASE + encodeURIComponent(url);
        urlInput.value = url;
        createNotification('Android Cloud prêt! Utilisez les Joy-Con pour naviguer.');
    }, 1500);
});

// Vue par défaut
showView('home');

// Styles anim notif
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translate(-50%, 0); }
        to { opacity: 0; transform: translate(-50%, 20px); }
    }
`;
document.head.appendChild(style);
