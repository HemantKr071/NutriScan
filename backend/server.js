import express from "express";
import "dotenv/config";
import { bot } from "./bot.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const isProd = process.env.NODE_ENV === "production";

// HEALTH CHECK
app.get("/", (_, res) => {
  res.send("✅ NutriScan Server is running");
});

// TELEGRAM WEBHOOK (PROD ONLY)
if (isProd) {
  app.post(`/webhook/${process.env.TELEGRAM_BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  if (isProd) {
    const webhookUrl =
      `${process.env.RENDER_EXTERNAL_URL}/webhook/${process.env.TELEGRAM_BOT_TOKEN}`;

    await bot.setWebHook(webhookUrl);
    console.log("Webhook set:", webhookUrl);
  } else {
    console.log(" Running in DEV mode (polling enabled)");
  }
});
