
import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { analyzeFood } from "./services/analyzeFood.js";
import "dotenv/config"; 

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// LOAD YOLO MODEL AT STARTUP
//await loadModel();

console.log("🤖 Bot started and model loaded");

bot.on("message", async (msg) => {
     console.log("Message received");
  const chatId = msg.chat.id;

  if (msg.photo) return;

  const text = (msg.text || "").toLowerCase();

  if (
    text === "/start" ||
    text.includes("hii") ||
    text.includes("hello") ||
    text.includes("hey")
  ) {
    await bot.sendMessage(
    chatId,
    `👋 *Welcome to Indian Food Nutrition Bot!* 🍽️

    I can analyze your food photo and give you an *estimated* nutrition breakdown using AI.

    🧠 *What I do*
    • Detect Indian food items from your image  
    • Estimate calories  
    • Show protein, carbs, fats  
    • Include vitamins & minerals (when available)

    📸 *How to use*
    1️⃣ Take a clear photo of your food  
    2️⃣ Make sure the food is visible (no blur)  
    3️⃣ Send the photo here  
    4️⃣ Wait a few seconds ⏳

    ⚠️ *Note*
    • Nutrition values are estimates  
    • Portion size affects accuracy  
    • Not medical advice

    👉 *Send a food photo to get started!*`,
    { parse_mode: "Markdown" }
    );

  }
});

//Photo
bot.on("photo", async (msg) => {

  try {
    console.log("📸 Photo received");

    const chatId = msg.chat.id;
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    const file = await bot.getFile(fileId);
    console.log("📂 File path:", file.file_path);

    const url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

    const imageBuffer = (
      await axios.get(url, { responseType: "arraybuffer" })
    ).data;

    console.log("🖼 Image downloaded, size:", imageBuffer.length);

    const analysis = await analyzeFood(imageBuffer);
    //console.log("🍽 Analysis:", analysis);

    let reply = "🍽 *Food Nutrition Analysis*\n\n";

    for (const item of analysis) {
      reply += `*${item.food}*\n`;
      for (const [k, v] of Object.entries(item.nutrition || {})) {
        reply += `• ${k}: ${v}\n`;
      }
      reply += "\n";
    }

    await bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });

  } catch (err) {
    console.error("❌ Internal Error:", err);
    await bot.sendMessage(
        msg.chat.id,
        `😕 I couldn’t analyze this image right now.

        📸 Please try again with:
        • A clearer food photo  
        • Better lighting  
        • One meal at a time  

        🙏 Thanks for your patience!`,
        { parse_mode: "Markdown" }
        );
  }
});
