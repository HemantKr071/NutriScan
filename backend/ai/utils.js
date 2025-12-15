// Intersection over Union (IoU)
export function iou(box1, box2) {
  return intersection(box1, box2) / union(box1, box2);
}

function intersection(b1, b2) {
  const x1 = Math.max(b1[0], b2[0]);
  const y1 = Math.max(b1[1], b2[1]);
  const x2 = Math.min(b1[2], b2[2]);
  const y2 = Math.min(b1[3], b2[3]);
  return Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
}

function union(b1, b2) {
  const area1 = (b1[2] - b1[0]) * (b1[3] - b1[1]);
  const area2 = (b2[2] - b2[0]) * (b2[3] - b2[1]);
  return area1 + area2 - intersection(b1, b2);
}
