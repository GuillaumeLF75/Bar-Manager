const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const app = express();

// Servir les fichiers statiques depuis le répertoire courant
app.use(express.static(__dirname));

// Middleware pour gérer les routes SPA
app.get('*', (req, res) => {
    // Renvoyer index.html pour toutes les routes
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Configuration du serveur HTTP
const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Configuration du WebSocket sur un port différent
const wsPort = 3001;
const wss = new WebSocket.Server({ port: wsPort }, () => {
    console.log(`WebSocket server running at ws://localhost:${wsPort}`);
});

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('received:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
}); 