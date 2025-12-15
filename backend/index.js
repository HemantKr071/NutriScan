import "./server.js";
import "./bot.js";
import { loadModel } from "./ai/yolo.js";

await loadModel();

console.log("Application is running : Bot and Server running!!");
