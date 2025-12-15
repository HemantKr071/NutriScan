#  NutriScan – Telegram Food Nutrition Bot

NutriScan is an AI-powered Telegram bot that detects food items from images and provides detailed nutritional information about your meal. The bot is designed to make nutrition tracking simple, fast, and accessible directly through Telegram.

---

## Project Overview
NutriScan uses a **YOLOv8 deep learning model** specifically designed for **traditional food detection**.  
The base model has been further trained and fine-tuned on **4,000+ Indian food images**, covering **80+ distinct Indian food classes**.

The model accurately identifies food items from user-uploaded images and provides detailed nutritional insights, including **calorie estimates** and **macro-level nutrition information**.

By focusing on traditional Indian cuisine, NutriScan is especially useful for users who want to understand the nutritional value of home-cooked meals and regional dishes.

🔗 **Try the Telegram Bot:** https://t.me/indian_food_nutrition_bot
---

## 🤖 How the Telegram Bot Works

1. Open the NutriScan Telegram bot  
2. Send **“Hi”** to start the interaction 
3. Upload an image of your food  
4. The bot detects the food items in the image  
5. Nutritional details of the detected food are returned to the user  
<p align="center">
  <img src="https://github.com/user-attachments/assets/25751fef-ec1b-41da-affe-ce21f4fbe0f2" width="45%" />
  <img src="https://github.com/user-attachments/assets/6dd1757b-c132-4ead-8901-833d3a06f2c9" width="45%" />
</p>

All processing happens automatically, requiring no manual input beyond the image.

---

## Model & Dataset

- **Model:** YOLOv8 (Object Detection)
- **Training Data:** 4,000+ images
- **Food Classes:** 80+ Indian food items
- **Domain:** Indian cuisine
- **Task:** Food detection and nutrition analysis

---

##  Key Features

- Telegram-based AI bot interface  
- Real-time food detection from images  
- Nutrition information for detected food items  
- Trained specifically on Indian food dishes  
- Simple and user-friendly interaction  

---

## Use Case

NutriScan helps users:
- Understand what they are eating  
- Track nutritional intake effortlessly  
- Make healthier food choices  
- Analyze meals without manual food logging  

---

##  Future Enhancements

- Portion size estimation  
- Multi-food plate analysis  
- Personalized dietary recommendations  
- Expanded food dataset and nutrition accuracy  

---
## ⚠️ Model Limitations & Future Improvements

The current NutriScan model is **not 100% accurate** and is still under active development.  
Although it performs well for traditional Indian food detection, some food items may be misclassified due to similarities in appearance, portion size, or image quality.

To improve accuracy and robustness, the model will be further trained on **a larger and more diverse dataset**, including **additional Indian dishes and other global cuisines**.  
The long-term goal is to build a comprehensive food recognition system capable of accurately detecting **all major food categories** and providing more precise nutritional insights.

---
## Author

**Hemant Kumar**  
GitHub: [HemantKr071](https://github.com/HemantKr071)

---

⭐ If you find NutriScan useful, consider starring the repository!
