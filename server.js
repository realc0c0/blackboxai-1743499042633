require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
const path = require('path');
app.use(express.static('public'));

// Serve region files
app.get('/regions/:region', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'regions', req.params.region + '.html'));
});

// In-memory user data (replace with DB in production)
const users = new Map();

// Telegram WebApp validation middleware
function validateTelegram(req, res, next) {
  const initData = new URLSearchParams(req.body.initData);
  const hash = initData.get('hash');
  initData.delete('hash');
  
  const secret = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN)
    .digest();
  
  const dataCheckString = Array.from(initData.entries())
    .map(([key, val]) => `${key}=${val}`)
    .sort()
    .join('\n');
  
  const computedHash = crypto.createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');
    
  if (hash !== computedHash) {
    return res.status(403).send('Invalid Telegram data');
  }
  next();
}

// Routes
app.post('/api/webhook', validateTelegram, (req, res) => {
  const { user } = req.body;
  if (!users.has(user.id)) {
    users.set(user.id, {
      tokens: 50,
      health: 100,
      region: 'frostbyte',
      inventory: []
    });
  }
  res.json(users.get(user.id));
});

app.get('/api/user/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).send('User not found');
  res.json(user);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});