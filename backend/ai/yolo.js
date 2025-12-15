import ort from "onnxruntime-node";
import sharp from "sharp";
import { YOLO_CLASSES } from "./classes.js";
import { iou } from "./utils.js";

let session; //  shared session

// Load model ONCE
export async function loadModel() {
  if (!session) {
    session = await ort.InferenceSession.create(
      "./models/indian_food_yolov8_v1.onnx"
    );
    console.log("✅ YOLO model loaded");
  }
}


/**
 * Main function called by your backend (Telegram / API / etc.)
 * @param {Buffer} imageBuffer - raw image buffer
 * @returns {Array} detected bounding boxes
 */
export async function detectObjects(imageBuffer) {
  if (!session) {
    throw new Error("YOLO model not loaded. Call loadModel() first.");
  }

  const [input, imgW, imgH] = await prepareInput(imageBuffer);
  const output = await runModel(input);
  return processOutput(output, imgW, imgH);
}

/**
 * Convert input image into YOLO-compatible tensor
 * - Resize to 640x640
 * - Normalize pixel values (0–1)
 * - Convert HWC → CHW
 */
async function prepareInput(buffer) {
  const image = sharp(buffer);
  const meta = await image.metadata();

  const pixels = await image
    .removeAlpha()
    .resize(640, 640)
    .raw()
    .toBuffer();

  const red = [];
  const green = [];
  const blue = [];

  // Split RGB channels (CHW format)
  for (let i = 0; i < pixels.length; i += 3) {
    red.push(pixels[i] / 255);
    green.push(pixels[i + 1] / 255);
    blue.push(pixels[i + 2] / 255);
  }

  return [[...red, ...green, ...blue], meta.width, meta.height];
}

/**
 * Run inference using ONNX Runtime
 */
async function runModel(input) {
  const tensor = new ort.Tensor(
    "float32",
    Float32Array.from(input),
    [1, 3, 640, 640]
  );

  const outputs = await session.run({ images: tensor });

  // YOLOv8 outputs are stored in "output0"
  return outputs.output0.data;
}

/**
 * Convert raw YOLO output into bounding boxes
 * Output format:
 * [x1, y1, x2, y2, class_name, confidence]
 */
function processOutput(output, imgW, imgH) {
  let boxes = [];

  const numClasses = YOLO_CLASSES.length;
  const numPredictions = 8400; // YOLOv8 fixed grid size

  for (let i = 0; i < numPredictions; i++) {
    // Find best class for this prediction
    let bestClass = -1;
    let bestScore = 0;

    for (let c = 0; c < numClasses; c++) {
      const score = output[numPredictions * (c + 4) + i];
      if (score > bestScore) {
        bestScore = score;
        bestClass = c;
      }
    }

    // Confidence threshold
    if (bestScore < 0.5) continue;

    // Bounding box (center format)
    const xc = output[i];
    const yc = output[numPredictions + i];
    const w = output[2 * numPredictions + i];
    const h = output[3 * numPredictions + i];

    // Convert to corner format & scale to original image
    const x1 = (xc - w / 2) / 640 * imgW;
    const y1 = (yc - h / 2) / 640 * imgH;
    const x2 = (xc + w / 2) / 640 * imgW;
    const y2 = (yc + h / 2) / 640 * imgH;

    boxes.push([
      x1,
      y1,
      x2,
      y2,
      YOLO_CLASSES[bestClass],
      bestScore
    ]);
  }

  /**
   * Non-Max Suppression (NMS)
   * Removes overlapping boxes of the same object
   */
  boxes.sort((a, b) => b[5] - a[5]);
  const finalDetections = [];

  while (boxes.length > 0) {
    const chosen = boxes.shift();
    finalDetections.push(chosen);
    boxes = boxes.filter(b => iou(chosen, b) < 0.7);
  }

  return finalDetections;
}
