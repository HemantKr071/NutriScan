import { detectObjects } from "../ai/yolo.js";
import { getNutrition } from "../nutrition/usda.js";

export async function analyzeFood(imageBuffer) {
  const detections = await detectObjects(imageBuffer);

  // Extract only food class names
  const foods = detections.map(d => d[4]);

  const results = [];
  for (const food of foods) {
    const nutrition = await getNutrition(food);
    results.push({ food, nutrition });
  }

  return results;
}
