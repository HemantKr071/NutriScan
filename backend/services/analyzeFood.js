import { detectObjects } from "../ai/yolo.js";
import { getNutrition } from "../nutrition/usda.js";

export async function analyzeFood(imageBuffer) {
  const detections = await detectObjects(imageBuffer);

  // Extract only unique food class names
  const foods = [...new Set(detections.map(d => d[4]))];

  const results = [];
  for (const food of foods) {
    const nutrition = await getNutrition(food);
    results.push({ food, nutrition });
  }

  return results;
}
