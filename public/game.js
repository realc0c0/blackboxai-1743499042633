// Telegram WebApp initialization
const tg = window.Telegram.WebApp;

// Game state
let gameState = {
    tokens: 50,
    health: 100,
    maxHealth: 100,
    currentRegion: 'frostbyte',
    enemiesDefeated: 0
};

// Initialize the game
function initGame() {
    tg.expand();
    tg.enableClosingConfirmation();
    
    // Load user data from backend
    fetchUserData();
    
    // Update UI
    updateUI();
    
    // Load current region
    loadRegion(gameState.currentRegion);
}

// Fetch user data from backend
async function fetchUserData() {
    try {
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                initData: tg.initData
            })
        });
        
        const data = await response.json();
        Object.assign(gameState, data);
        updateUI();
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Update UI elements
function updateUI() {
    document.getElementById('token-count').textContent = gameState.tokens;
    // Add more UI updates as needed
}

// Load region content
function loadRegion(region) {
    fetch(`/regions/${region}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('game-content').innerHTML = html;
            // Initialize region-specific event listeners
            initRegionEvents();
        });
}

// Initialize region events
function initRegionEvents() {
    // Attack button
    document.getElementById('attack-btn').addEventListener('click', () => {
        if (gameState.tokens >= 3) {
            gameState.tokens -= 3;
            updateUI();
            // Add combat logic here
        }
    });
    
    // Defend button
    document.getElementById('defend-btn').addEventListener('click', () => {
        if (gameState.tokens >= 10) {
            gameState.tokens -= 10;
            gameState.health = Math.min(gameState.health + 20, gameState.maxHealth);
            updateUI();
        }
    });
    
    // Special button
    document.getElementById('special-btn').addEventListener('click', () => {
        if (gameState.tokens >= 20) {
            gameState.tokens -= 20;
            updateUI();
            // Add special ability logic here
        }
    });
}

// Initialize game when Telegram WebApp is ready
tg.ready();
initGame();