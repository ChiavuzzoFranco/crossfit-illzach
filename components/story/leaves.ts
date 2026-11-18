import * as THREE from 'three';

// Textures de feuilles dessinées à la main en Canvas 2D, dans le style graphique du logo.
// Canaux : R = ombrage du limbe, G = masque nervures/contour, A = forme.
// La couleur finale est appliquée par instance dans le shader.
const W = 256;
const H = 512;

const FILL = 'rgb(225,0,0)';
const VEIN = 'rgb(225,255,0)';

function canvas() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d')!;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  return { c, ctx };
}

// Feuille pointue (base en bas, pointe en haut)
function pointed() {
  const { c, ctx } = canvas();
  const shape = new Path2D();
  shape.moveTo(W / 2, H - 6);
  shape.bezierCurveTo(W / 2 - 150, H * 0.7, W / 2 - 115, H * 0.18, W / 2, 8);
  shape.bezierCurveTo(W / 2 + 115, H * 0.18, W / 2 + 150, H * 0.7, W / 2, H - 6);
  ctx.fillStyle = FILL;
  ctx.fill(shape);
  ctx.save();
  ctx.clip(shape);
  ctx.strokeStyle = VEIN;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(W / 2, H - 6);
  ctx.quadraticCurveTo(W / 2 + 6, H / 2, W / 2, 20);
  ctx.stroke();
  ctx.lineWidth = 2.5;
  for (let i = 1; i < 9; i++) {
    const y = H - 40 - i * 50;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(W / 2, y + 22);
      ctx.quadraticCurveTo(W / 2 + s * 50, y + 6, W / 2 + s * 110, y - 26);
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.strokeStyle = VEIN;
  ctx.lineWidth = 6;
  ctx.stroke(shape);
  return c;
}

// Palme (tige centrale + folioles fines)
function palm() {
  const { c, ctx } = canvas();
  const stem = (t: number) => ({ x: W / 2 + Math.sin(t * 2.2) * 18 * t, y: H - 4 - t * (H - 24) });
  ctx.fillStyle = FILL;
  ctx.strokeStyle = VEIN;
  for (let i = 0; i < 26; i++) {
    const t = 0.06 + (i / 26) * 0.92;
    const p = stem(t);
    const len = 40 + Math.sin(t * Math.PI) * 92;
    for (const s of [-1, 1]) {
      const ang = -Math.PI / 2 + s * (0.95 - t * 0.35);
      const tx = p.x + Math.cos(ang) * len;
      const ty = p.y + Math.sin(ang) * len + 18 * (1 - t);
      const nx = -Math.sin(ang) * 7;
      const ny = Math.cos(ang) * 7;
      const leaf = new Path2D();
      leaf.moveTo(p.x, p.y);
      leaf.quadraticCurveTo((p.x + tx) / 2 + nx, (p.y + ty) / 2 + ny, tx, ty);
      leaf.quadraticCurveTo((p.x + tx) / 2 - nx, (p.y + ty) / 2 - ny, p.x, p.y);
      ctx.fill(leaf);
      ctx.lineWidth = 1.5;
      ctx.stroke(leaf);
    }
  }
  ctx.lineWidth = 6;
  ctx.beginPath();
  for (let t = 0; t <= 1.001; t += 0.02) {
    const p = stem(t);
    if (t === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  }
  ctx.stroke();
  return c;
}

// Feuille fendue (type monstera, simplifiée)
function split() {
  const { c, ctx } = canvas();
  const shape = new Path2D();
  shape.moveTo(W / 2, H - 10);
  shape.bezierCurveTo(-30, H * 0.78, -10, H * 0.08, W / 2, 30);
  shape.bezierCurveTo(W + 10, H * 0.08, W + 30, H * 0.78, W / 2, H - 10);
  ctx.fillStyle = FILL;
  ctx.fill(shape);
  ctx.strokeStyle = VEIN;
  ctx.lineWidth = 6;
  ctx.stroke(shape);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(W / 2, H - 10);
  ctx.lineTo(W / 2, 40);
  ctx.stroke();
  // fentes
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < 5; i++) {
    const y = 110 + i * 70;
    for (const s of [-1, 1]) {
      ctx.lineWidth = 13 - i;
      ctx.beginPath();
      ctx.moveTo(W / 2 + s * (130), y - 30);
      ctx.quadraticCurveTo(W / 2 + s * 70, y - 4, W / 2 + s * 34, y + 14);
      ctx.stroke();
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  return c;
}

export function makeLeafTextures() {
  return [pointed(), palm(), split()].map((cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.NoColorSpace; // données (masques), pas des couleurs
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  });
}

// Palette du logo
export const LEAF_COLORS = {
  black: new THREE.Color('#0e0b0a'),
  blood: new THREE.Color('#8E1A0E'),
  red: new THREE.Color('#E0281A'),
  ember: new THREE.Color('#E8642A'),
  peach: new THREE.Color('#F2A273'),
};
