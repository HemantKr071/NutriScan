import axios from "axios";

export async function getNutrition(foodName) {
  const res = await axios.post(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_TOKEN}`,
    { query: foodName, pageSize: 1 }
  );

  const food = res.data.foods[0];
  if (!food) return null;

  const nutrients = {};
  for (const n of food.foodNutrients) {
    nutrients[n.nutrientName] = `${n.value} ${n.unitName}`;
  }

  return nutrients;
}
