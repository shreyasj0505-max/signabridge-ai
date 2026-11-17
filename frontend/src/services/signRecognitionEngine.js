/**
 * SignaBridge AI - Real-time Hand Gesture Recognition Engine
 * Upgraded multi-factor geometric feature extraction and classification.
 * Electric Blue & Cyan canvas skeleton rendering.
 */

export const LM = {
  WRIST: 0,
  THUMB_CMC: 1, THUMB_MCP: 2, THUMB_IP: 3, THUMB_TIP: 4,
  INDEX_MCP: 5, INDEX_PIP: 6, INDEX_DIP: 7, INDEX_TIP: 8,
  MIDDLE_MCP: 9, MIDDLE_PIP: 10, MIDDLE_DIP: 11, MIDDLE_TIP: 12,
  RING_MCP: 13, RING_PIP: 14, RING_DIP: 15, RING_TIP: 16,
  PINKY_MCP: 17, PINKY_PIP: 18, PINKY_DIP: 19, PINKY_TIP: 20
};

export const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]
];

export function dist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function extractHandFeatures(rawLandmarks) {
  if (!rawLandmarks || rawLandmarks.length < 21) return null;

  const wrist = rawLandmarks[0];
  const middleMcp = rawLandmarks[LM.MIDDLE_MCP];
  const scale = dist(wrist, middleMcp) || 1.0;

  const norm = rawLandmarks.map(p => ({
    x: (p.x - wrist.x) / scale,
    y: (p.y - wrist.y) / scale,
    z: ((p.z || 0) - (wrist.z || 0)) / scale
  }));

  const checkExtension = (tipIdx, pipIdx, mcpIdx) => {
    const dWristTip = dist(norm[0], norm[tipIdx]);
    const dWristPip = dist(norm[0], norm[pipIdx]);
    const dMcpTip = dist(norm[mcpIdx], norm[tipIdx]);
    const dMcpPip = dist(norm[mcpIdx], norm[pipIdx]);

    const ratio = dWristTip / (dWristPip || 1.0);
    return ratio > 1.12 || (dMcpTip > dMcpPip * 1.35);
  };

  const indexOpen = checkExtension(LM.INDEX_TIP, LM.INDEX_PIP, LM.INDEX_MCP);
  const middleOpen = checkExtension(LM.MIDDLE_TIP, LM.MIDDLE_PIP, LM.MIDDLE_MCP);
  const ringOpen = checkExtension(LM.RING_TIP, LM.RING_PIP, LM.RING_MCP);
  const pinkyOpen = checkExtension(LM.PINKY_TIP, LM.PINKY_PIP, LM.PINKY_MCP);

  const dThumbTipPinkyMcp = dist(norm[LM.THUMB_TIP], norm[LM.PINKY_MCP]);
  const dThumbIpPinkyMcp = dist(norm[LM.THUMB_IP], norm[LM.PINKY_MCP]);
  const dThumbTipIndexMcp = dist(norm[LM.THUMB_TIP], norm[LM.INDEX_MCP]);
  const thumbOpen = (dThumbTipPinkyMcp > dThumbIpPinkyMcp * 1.15) && (dThumbTipIndexMcp > 0.40);

  const dThumbIndex = dist(norm[LM.THUMB_TIP], norm[LM.INDEX_TIP]);
  const dThumbMiddle = dist(norm[LM.THUMB_TIP], norm[LM.MIDDLE_TIP]);
  const dIndexMiddle = dist(norm[LM.INDEX_TIP], norm[LM.MIDDLE_TIP]);
  const isPinching = dThumbIndex < 0.28;
  const thumbPointingUp = norm[LM.THUMB_TIP].y < norm[LM.THUMB_MCP].y;

  return {
    norm,
    states: {
      thumb: thumbOpen ? "OPEN" : "CLOSED",
      index: indexOpen ? "OPEN" : "CLOSED",
      middle: middleOpen ? "OPEN" : "CLOSED",
      ring: ringOpen ? "OPEN" : "CLOSED",
      pinky: pinkyOpen ? "OPEN" : "CLOSED"
    },
    distances: {
      thumbIndex: dThumbIndex,
      thumbMiddle: dThumbMiddle,
      indexMiddle: dIndexMiddle,
      thumbTipIndexMcp: dThumbTipIndexMcp
    },
    isPinching,
    thumbPointingUp
  };
}

export function classifyASLGesture(rawLandmarks, handedness = "Right", minConf = 0.55) {
  const feat = extractHandFeatures(rawLandmarks);
  if (!feat) return null;

  const { thumb, index, middle, ring, pinky } = feat.states;
  const t = thumb === "OPEN";
  const i = index === "OPEN";
  const m = middle === "OPEN";
  const r = ring === "OPEN";
  const p = pinky === "OPEN";
  const d = feat.distances;

  let sign = "Detecting...";
  let category = "alphabet";
  let confidence = 0.50;
  let meaning = "Hold hand clearly facing camera";

  // 1. I Love You (ILY)
  if (t && i && !m && !r && p) {
    sign = "I Love You"; category = "phrase"; confidence = 0.96; meaning = "Universal ASL symbol for 'I Love You'";
  }
  // 2. Y / Shaka
  else if (t && !i && !m && !r && p) {
    sign = "Y"; category = "alphabet"; confidence = 0.95; meaning = "ASL Letter 'Y'";
  }
  // 3. L
  else if (t && i && !m && !r && !p) {
    sign = "L"; category = "alphabet"; confidence = 0.96; meaning = "ASL Letter 'L' (Thumb & Index angle)";
  }
  // 4. I
  else if (!t && !i && !m && !r && p) {
    sign = "I"; category = "alphabet"; confidence = 0.94; meaning = "ASL Letter 'I'";
  }
  // 5. V / Peace vs U
  else if (!t && i && m && !r && !p) {
    if (d.indexMiddle > 0.20) {
      sign = "V"; category = "alphabet"; confidence = 0.95; meaning = "ASL Letter 'V' / Peace / Number 2";
    } else {
      sign = "U"; category = "alphabet"; confidence = 0.92; meaning = "ASL Letter 'U' (Fingers together)";
    }
  }
  // 6. W / 3
  else if (!t && i && m && r && !p) {
    sign = "W"; category = "alphabet"; confidence = 0.94; meaning = "ASL Letter 'W' / Number 3";
  }
  // 7. B / 4
  else if (!t && i && m && r && p) {
    sign = "B"; category = "alphabet"; confidence = 0.95; meaning = "ASL Letter 'B' / Flat Hand";
  }
  // 8. Hello / Open Hand / Stop
  else if (t && i && m && r && p) {
    sign = "Hello"; category = "greeting"; confidence = 0.97; meaning = "Open Palm / 'Hello' greeting / Stop";
  }
  // 9. OK / F
  else if (feat.isPinching && m && r && p) {
    sign = "OK"; category = "phrase"; confidence = 0.95; meaning = "ASL Letter 'F' / 'OK' gesture";
  }
  // 10. D / Point / 1
  else if (!t && i && !m && !r && !p) {
    sign = "D"; category = "alphabet"; confidence = 0.93; meaning = "ASL Letter 'D' / Point / Number 1";
  }
  // 11. Thumbs Up (Yes) / Thumbs Down (No)
  else if (t && !i && !m && !r && !p) {
    if (feat.thumbPointingUp) {
      sign = "Yes"; category = "phrase"; confidence = 0.96; meaning = "Thumbs Up / 'Yes' affirmation";
    } else {
      sign = "No"; category = "phrase"; confidence = 0.92; meaning = "Thumbs Down / 'No' negation";
    }
  }
  // 12. A vs S
  else if (!i && !m && !r && !p) {
    if (d.thumbTipIndexMcp < 0.40) {
      sign = "A"; category = "alphabet"; confidence = 0.90; meaning = "ASL Letter 'A' (Fist with thumb on side)";
    } else {
      sign = "S"; category = "alphabet"; confidence = 0.88; meaning = "ASL Letter 'S' (Thumb across fingers)";
    }
  }
  // 13. C
  else if (d.thumbIndex > 0.28 && d.thumbIndex < 0.60 && !i && !m) {
    sign = "C"; category = "alphabet"; confidence = 0.88; meaning = "ASL Letter 'C' (Curved arc hand)";
  }

  return {
    sign,
    category,
    confidence: Math.round(confidence * 100),
    meaning,
    fingerStates: feat.states,
    handedness,
    landmarks: feat.norm,
    isRecognized: confidence >= minConf
  };
}

export function drawNeonSkeleton(ctx, landmarks, width, height, handedness = "Right") {
  if (!ctx || !landmarks || landmarks.length < 21) return;
  ctx.save();
  ctx.shadowBlur = 14;
  ctx.shadowColor = handedness === "Left" ? "#3B82F6" : "#06B6D4";

  HAND_CONNECTIONS.forEach(([s, e]) => {
    const p1 = landmarks[s];
    const p2 = landmarks[e];
    const x1 = p1.x * width;
    const y1 = p1.y * height;
    const x2 = p2.x * width;
    const y2 = p2.y * height;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    grad.addColorStop(0, "#1D4ED8");
    grad.addColorStop(0.5, "#2563EB");
    grad.addColorStop(1, "#38BDF8");

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.stroke();
  });

  landmarks.forEach((p, idx) => {
    const cx = p.x * width;
    const cy = p.y * height;
    const isTip = [4, 8, 12, 16, 20].includes(idx);
    const radius = isTip ? 6.5 : (idx === 0 ? 7 : 4);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.fillStyle = isTip ? "#38BDF8" : "#FFFFFF";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  ctx.restore();
}
