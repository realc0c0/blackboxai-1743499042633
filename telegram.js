const TelegramBot = require('node-telegram-bot-api');

// Replace with your bot token
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Tokenheim!', {
    reply_markup: {
      inline_keyboard: [[{
        text: 'Play Now',
        web_app: { url: process.env.WEBAPP_URL }
      }]]
    }
  });
});

// Handle WebApp data
bot.on('message', (msg) => {
  if (msg.web_app_data) {
    const data = JSON.parse(msg.web_app_data.data);
    console.log('WebApp data received:', data);
  }
});

module.exports = bot;