import axios from "axios";

// Map USDA nutrient names → Simple names
const NUTRIENT_MAP = {
  "Energy": "Calories",
  "Protein": "Protein",
  "Total lipid (fat)": "Fat",
  "Carbohydrate, by difference": "Carbs",
  "Fiber, total dietary": "Fiber",
  "Total Sugars": "Sugar",
  "Sodium, Na": "Sodium",
  "Calcium, Ca": "Calcium",
  "Iron, Fe": "Iron",
  "Potassium, K": "Potassium",
  "Vitamin A, IU": "Vitamin A",
  "Vitamin C, total ascorbic acid": "Vitamin C"
};

export async function getNutrition(foodName) {
  const res = await axios.post(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_TOKEN}`,
    {
      query: foodName,
      pageSize: 1
    }
  );

  const food = res.data.foods?.[0];
  if (!food) return null;

  const nutrition = {};

  for (const n of food.foodNutrients) {
    if (NUTRIENT_MAP[n.nutrientName]) {
      let value = n.value;
      let unit = n.unitName;
      
      // Convert kJ → kcal
      if (n.nutrientName === "Energy" && unit === "KJ") {
        value = (value / 4.184).toFixed(0);
        unit = "kcal";
      }
      
      nutrition[NUTRIENT_MAP[n.nutrientName]] = `${value} ${unit}`;
    }
  }

  return nutrition;
}
