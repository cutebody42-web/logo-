import { 
  ProductConfig, 
  ProductAngle, 
  LightingCondition, 
  BackgroundScene, 
  LogoSettings 
} from '../types/mockup';

interface RenderOptions {
  product: ProductConfig;
  productColor: string;
  angle: ProductAngle;
  lighting: LightingCondition;
  scene: BackgroundScene;
  logoImg: HTMLImageElement | null;
  logoSettings: LogoSettings;
  width?: number;
  height?: number;
}

export function renderMockupToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderOptions
): void {
  const {
    product,
    productColor,
    angle,
    lighting,
    scene,
    logoImg,
    logoSettings,
    width = 1200,
    height = 1200,
  } = options;

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Background Scene
  drawBackgroundScene(ctx, scene, width, height);

  // 2. Draw Ambient Lighting and Drop Shadows
  drawProductDropShadow(ctx, product.id, angle, width, height);

  // 3. Render Product Body
  renderProductBody(ctx, product, productColor, angle, lighting, width, height);

  // 4. Render Logo in Print Zone
  if (logoImg) {
    renderLogoOnProduct(ctx, product, angle, logoImg, logoSettings, width, height);
  }

  // 5. Render Highlights, Lighting Overlays, and Material Reflections
  renderMaterialOverlays(ctx, product, angle, lighting, width, height);
}

/**
 * 1. Background Scene Renderer
 */
function drawBackgroundScene(
  ctx: CanvasRenderingContext2D,
  scene: BackgroundScene,
  w: number,
  h: number
) {
  if (scene === 'transparent') {
    return;
  }

  if (scene === 'white') {
    const grad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, w * 0.75);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.7, '#F8FAFC');
    grad.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    return;
  }

  if (scene === 'dark_studio') {
    const grad = ctx.createRadialGradient(w / 2, h * 0.4, 50, w / 2, h / 2, w * 0.8);
    grad.addColorStop(0, '#27272A');
    grad.addColorStop(0.5, '#18181B');
    grad.addColorStop(1, '#09090B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    return;
  }

  if (scene === 'warm_studio') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#FDFBF7');
    grad.addColorStop(0.5, '#F5EDE2');
    grad.addColorStop(1, '#E8DAC9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle sun flare in corner
    const sunGrad = ctx.createRadialGradient(w * 0.15, h * 0.1, 10, w * 0.15, h * 0.1, 400);
    sunGrad.addColorStop(0, 'rgba(255, 245, 230, 0.45)');
    sunGrad.addColorStop(1, 'rgba(255, 245, 230, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
    return;
  }

  if (scene === 'office_desk') {
    // Rich wooden table top bottom half
    const tableGrad = ctx.createLinearGradient(0, h * 0.4, 0, h);
    tableGrad.addColorStop(0, '#D4B996');
    tableGrad.addColorStop(0.3, '#BA9B73');
    tableGrad.addColorStop(1, '#8C6C47');
    ctx.fillStyle = tableGrad;
    ctx.fillRect(0, h * 0.35, w, h * 0.65);

    // Warm office wall top half
    const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.4);
    wallGrad.addColorStop(0, '#EAECEF');
    wallGrad.addColorStop(1, '#D8DCE2');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h * 0.35);

    // Horizon depth blur shadow
    const horizonGrad = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.38);
    horizonGrad.addColorStop(0, 'rgba(0,0,0,0.18)');
    horizonGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, h * 0.34, w, h * 0.04);
    return;
  }

  if (scene === 'outdoor_sun') {
    // Soft blurred garden & sky outdoor setting
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#DDF2FD');
    skyGrad.addColorStop(0.4, '#EBF4F6');
    skyGrad.addColorStop(0.7, '#DCE7D4');
    skyGrad.addColorStop(1, '#B9CCA7');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Dappled sunlight / bokeh circles
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(w * 0.2, h * 0.25, 120, 0, Math.PI * 2);
    ctx.arc(w * 0.8, h * 0.3, 90, 0, Math.PI * 2);
    ctx.arc(w * 0.7, h * 0.15, 60, 0, Math.PI * 2);
    ctx.arc(w * 0.3, h * 0.8, 140, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (scene === 'urban_concrete') {
    const concreteGrad = ctx.createLinearGradient(0, 0, w, h);
    concreteGrad.addColorStop(0, '#C4C4C6');
    concreteGrad.addColorStop(0.5, '#B2B2B6');
    concreteGrad.addColorStop(1, '#96969B');
    ctx.fillStyle = concreteGrad;
    ctx.fillRect(0, 0, w, h);

    // Soft architectural ground line
    const groundGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
    groundGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
    groundGrad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);
  }
}

/**
 * 2. Ground Drop Shadows
 */
function drawProductDropShadow(
  ctx: CanvasRenderingContext2D,
  productId: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
  ctx.filter = 'blur(28px)';

  if (productId === 'mug' || productId === 'tumbler') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.82, w * 0.24, h * 0.05, 0, 0, Math.PI * 2);
    ctx.fill();
    // Inner darker core shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.filter = 'blur(12px)';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.81, w * 0.16, h * 0.025, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'tshirt' || productId === 'hoodie') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.85, w * 0.32, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'hat') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.78, w * 0.26, h * 0.06, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'tote') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.88, w * 0.28, h * 0.045, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'phonecase') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.84, w * 0.18, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (productId === 'sticker') {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.65, w * 0.22, h * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * 3. Render Product Body
 */
function renderProductBody(
  ctx: CanvasRenderingContext2D,
  product: ProductConfig,
  color: string,
  angle: ProductAngle,
  _lighting: LightingCondition,
  w: number,
  h: number
) {
  ctx.save();

  switch (product.id) {
    case 'mug':
      renderMug(ctx, color, angle, w, h);
      break;
    case 'tshirt':
      renderTShirt(ctx, color, angle, w, h);
      break;
    case 'hat':
      renderHat(ctx, color, angle, w, h);
      break;
    case 'tote':
      renderToteBag(ctx, color, angle, w, h);
      break;
    case 'phonecase':
      renderPhoneCase(ctx, color, angle, w, h);
      break;
    case 'sticker':
      renderSticker(ctx, color, angle, w, h);
      break;
    case 'hoodie':
      renderHoodie(ctx, color, angle, w, h);
      break;
    case 'tumbler':
      renderTumbler(ctx, color, angle, w, h);
      break;
  }

  ctx.restore();
}

/**
 * Mug Geometry & Ceramic Shading
 */
function renderMug(
  ctx: CanvasRenderingContext2D,
  color: string,
  angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const topY = h * 0.28;
  const botY = h * 0.78;
  const bodyW = w * 0.28;
  const leftX = cx - bodyW;
  const rightX = cx + bodyW;
  const isPersp = angle === 'perspective';

  // Handle (Rendered behind or at side)
  ctx.save();
  ctx.beginPath();
  const handleX = isPersp ? rightX + 10 : rightX;
  ctx.moveTo(handleX - 10, topY + 70);
  ctx.bezierCurveTo(handleX + 110, topY + 60, handleX + 110, botY - 90, handleX - 10, botY - 80);
  ctx.bezierCurveTo(handleX + 65, botY - 100, handleX + 65, topY + 80, handleX - 10, topY + 70);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Handle inner shadow
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fill();
  ctx.restore();

  // Main Cylinder Body
  ctx.save();
  ctx.beginPath();
  // Top rim ellipse
  ctx.ellipse(cx, topY, bodyW, isPersp ? 36 : 28, 0, Math.PI, 0, false);
  // Right side
  ctx.lineTo(rightX, botY);
  // Bottom curved base
  ctx.ellipse(cx, botY, bodyW, isPersp ? 32 : 24, 0, 0, Math.PI, false);
  // Left side
  ctx.lineTo(leftX, topY);
  ctx.closePath();

  // Ceramic base fill
  ctx.fillStyle = color;
  ctx.fill();

  // 3D Cylindrical Shader Gradient
  const cylGrad = ctx.createLinearGradient(leftX, 0, rightX, 0);
  cylGrad.addColorStop(0, 'rgba(0,0,0,0.32)');
  cylGrad.addColorStop(0.12, 'rgba(0,0,0,0.1)');
  cylGrad.addColorStop(0.35, 'rgba(255,255,255,0.4)'); // Highlight streak
  cylGrad.addColorStop(0.55, 'rgba(255,255,255,0.1)');
  cylGrad.addColorStop(0.85, 'rgba(0,0,0,0.12)');
  cylGrad.addColorStop(1, 'rgba(0,0,0,0.35)');
  ctx.fillStyle = cylGrad;
  ctx.fill();

  // Inner Mug Well (Coffee/Interior Depth)
  ctx.beginPath();
  ctx.ellipse(cx, topY, bodyW - 12, isPersp ? 28 : 22, 0, 0, Math.PI * 2);
  const innerGrad = ctx.createLinearGradient(0, topY - 20, 0, topY + 25);
  innerGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
  innerGrad.addColorStop(0.5, 'rgba(0,0,0,0.25)');
  innerGrad.addColorStop(1, color);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // Mug Rim Specular Highlight
  ctx.beginPath();
  ctx.ellipse(cx, topY, bodyW, isPersp ? 36 : 28, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

/**
 * Crewneck T-Shirt Geometry
 */
function renderTShirt(
  ctx: CanvasRenderingContext2D,
  color: string,
  angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const topY = h * 0.18;
  const botY = h * 0.84;

  ctx.save();

  // If hanger angle, draw wooden clothes hanger first
  if (angle === 'hanger') {
    ctx.save();
    // Metal hook
    ctx.beginPath();
    ctx.arc(cx, topY - 50, 22, Math.PI, 0, false);
    ctx.lineTo(cx + 2, topY - 10);
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Wooden bar
    ctx.beginPath();
    ctx.moveTo(cx - 160, topY + 15);
    ctx.lineTo(cx, topY - 10);
    ctx.lineTo(cx + 160, topY + 15);
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // T-Shirt Contour Path
  ctx.beginPath();
  // Collar back curve
  ctx.moveTo(cx - 75, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 8, cx + 75, topY + 20);

  // Right shoulder
  ctx.lineTo(cx + 230, topY + 70);
  // Right sleeve outer
  ctx.lineTo(cx + 340, topY + 200);
  // Right sleeve opening
  ctx.lineTo(cx + 280, topY + 250);
  // Right armpit
  ctx.lineTo(cx + 210, topY + 220);
  // Right body side
  ctx.quadraticCurveTo(cx + 220, (topY + botY) / 2, cx + 215, botY);
  // Bottom hem
  ctx.quadraticCurveTo(cx, botY + (angle === 'flatlay' ? 10 : 25), cx - 215, botY);
  // Left body side
  ctx.quadraticCurveTo(cx - 220, (topY + botY) / 2, cx - 210, topY + 220);
  // Left armpit & sleeve
  ctx.lineTo(cx - 280, topY + 250);
  ctx.lineTo(cx - 340, topY + 200);
  ctx.lineTo(cx - 230, topY + 70);
  // Left shoulder
  ctx.closePath();

  // Solid garment base fill
  ctx.fillStyle = color;
  ctx.fill();

  // Fabric Shading, Folds, and Contour Highlights
  const shadeGrad = ctx.createLinearGradient(0, topY, 0, botY);
  shadeGrad.addColorStop(0, 'rgba(255,255,255,0.08)');
  shadeGrad.addColorStop(0.5, 'rgba(0,0,0,0.02)');
  shadeGrad.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = shadeGrad;
  ctx.fill();

  // Side and underarm depth shadows
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  // Left crease
  ctx.beginPath();
  ctx.moveTo(cx - 210, topY + 220);
  ctx.quadraticCurveTo(cx - 160, topY + 360, cx - 180, botY - 50);
  ctx.quadraticCurveTo(cx - 175, topY + 360, cx - 210, topY + 220);
  ctx.fill();

  // Right crease
  ctx.beginPath();
  ctx.moveTo(cx + 210, topY + 220);
  ctx.quadraticCurveTo(cx + 160, topY + 360, cx + 180, botY - 50);
  ctx.quadraticCurveTo(cx + 175, topY + 360, cx + 210, topY + 220);
  ctx.fill();
  ctx.restore();

  // Ribbed Collar Neckband
  ctx.beginPath();
  ctx.moveTo(cx - 75, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 68, cx + 75, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 54, cx - 75, topY + 20);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 75, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 68, cx + 75, topY + 20);
  ctx.strokeStyle = 'rgba(0,0,0,0.22)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Interior Collar Hole
  ctx.beginPath();
  ctx.moveTo(cx - 72, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 12, cx + 72, topY + 20);
  ctx.quadraticCurveTo(cx, topY + 48, cx - 72, topY + 20);
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fill();

  ctx.restore();
}

/**
 * Structured Baseball Cap Geometry
 */
function renderHat(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const crownTop = h * 0.28;
  const crownBottom = h * 0.60;
  const visorFront = h * 0.76;

  ctx.save();

  // 1. Visor / Brim (Pre-curved)
  ctx.beginPath();
  ctx.moveTo(cx - 220, crownBottom - 10);
  ctx.quadraticCurveTo(cx, visorFront + 20, cx + 220, crownBottom - 10);
  ctx.quadraticCurveTo(cx, visorFront - 35, cx - 220, crownBottom - 10);
  ctx.fillStyle = color;
  ctx.fill();

  // Visor under-shadow & edge thickness
  ctx.beginPath();
  ctx.moveTo(cx - 220, crownBottom - 10);
  ctx.quadraticCurveTo(cx, visorFront + 20, cx + 220, crownBottom - 10);
  ctx.quadraticCurveTo(cx, visorFront + 28, cx - 220, crownBottom - 10);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fill();

  // 2. Crown (Front Dome)
  ctx.beginPath();
  ctx.moveTo(cx - 180, crownBottom);
  ctx.bezierCurveTo(cx - 200, crownTop + 40, cx - 100, crownTop - 10, cx, crownTop);
  ctx.bezierCurveTo(cx + 100, crownTop - 10, cx + 200, crownTop + 40, cx + 180, crownBottom);
  ctx.quadraticCurveTo(cx, crownBottom + 25, cx - 180, crownBottom);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Crown 3D Dome Shading
  const domeGrad = ctx.createRadialGradient(cx, crownTop + 80, 20, cx, crownTop + 80, 220);
  domeGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
  domeGrad.addColorStop(0.7, 'rgba(0,0,0,0.05)');
  domeGrad.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = domeGrad;
  ctx.fill();

  // 3. Center Stitching Seam
  ctx.beginPath();
  ctx.moveTo(cx, crownTop);
  ctx.lineTo(cx, crownBottom + 15);
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4. Crown Top Button
  ctx.beginPath();
  ctx.arc(cx, crownTop + 2, 12, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fill();

  // 5. Embroidered Eyelets (Air holes)
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.arc(cx - 70, crownTop + 75, 5, 0, Math.PI * 2);
  ctx.arc(cx + 70, crownTop + 75, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Canvas Tote Bag Geometry
 */
function renderToteBag(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const bagTop = h * 0.38;
  const bagBot = h * 0.86;
  const bagW = w * 0.28;

  ctx.save();

  // Dual Shoulder Straps
  ctx.beginPath();
  // Left strap
  ctx.moveTo(cx - 90, bagTop + 10);
  ctx.bezierCurveTo(cx - 100, h * 0.12, cx - 40, h * 0.12, cx - 40, bagTop + 10);
  // Right strap
  ctx.moveTo(cx + 40, bagTop + 10);
  ctx.bezierCurveTo(cx + 40, h * 0.12, cx + 100, h * 0.12, cx + 90, bagTop + 10);
  ctx.strokeStyle = color;
  ctx.lineWidth = 24;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Strap edge stitching lines
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tote Bag Main Body
  ctx.beginPath();
  ctx.moveTo(cx - bagW, bagTop);
  ctx.lineTo(cx + bagW, bagTop);
  ctx.lineTo(cx + bagW + 15, bagBot);
  ctx.quadraticCurveTo(cx, bagBot + 15, cx - bagW - 15, bagBot);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Canvas Textile Texture & Shading
  const canvasGrad = ctx.createLinearGradient(cx - bagW, 0, cx + bagW, 0);
  canvasGrad.addColorStop(0, 'rgba(0,0,0,0.18)');
  canvasGrad.addColorStop(0.15, 'rgba(0,0,0,0.04)');
  canvasGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
  canvasGrad.addColorStop(0.85, 'rgba(0,0,0,0.04)');
  canvasGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
  ctx.fillStyle = canvasGrad;
  ctx.fill();

  // Top Hem Fold & Double Stitching
  ctx.beginPath();
  ctx.moveTo(cx - bagW - 2, bagTop + 35);
  ctx.lineTo(cx + bagW + 2, bagTop + 35);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

/**
 * Slim Phone Case Geometry
 */
function renderPhoneCase(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const caseW = 320;
  const caseH = 640;
  const r = 52;

  ctx.save();

  // Outer phone case body
  ctx.beginPath();
  ctx.roundRect(cx - caseW / 2, cy - caseH / 2, caseW, caseH, r);
  ctx.fillStyle = color;
  ctx.fill();

  // Polycarbonate Edge Bevel
  const caseGrad = ctx.createLinearGradient(cx - caseW / 2, 0, cx + caseW / 2, 0);
  caseGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  caseGrad.addColorStop(0.08, 'rgba(0,0,0,0.05)');
  caseGrad.addColorStop(0.92, 'rgba(0,0,0,0.1)');
  caseGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = caseGrad;
  ctx.fill();

  // Camera Island Cutout (Top Left)
  const camX = cx - caseW / 2 + 30;
  const camY = cy - caseH / 2 + 30;
  const camSize = 105;

  ctx.beginPath();
  ctx.roundRect(camX, camY, camSize, camSize, 28);
  ctx.fillStyle = '#09090B';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Camera Lenses
  const drawLens = (lx: number, ly: number) => {
    ctx.beginPath();
    ctx.arc(lx, ly, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#18181B';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lx, ly, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#0284C7';
    ctx.fill();
    // Lens specular point
    ctx.beginPath();
    ctx.arc(lx - 4, ly - 4, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  };

  drawLens(camX + 32, camY + 32);
  drawLens(camX + 32, camY + 74);
  drawLens(camX + 74, camY + 53);

  ctx.restore();
}

/**
 * Die-Cut Vinyl Sticker Geometry
 */
function renderSticker(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.save();

  // Rounded Die-cut Vinyl Badge Base
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  // Sticker Vinyl Edge Rim (White border)
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Glossy Vinyl Specular Reflection Across Diagonal
  const glossGrad = ctx.createLinearGradient(cx - 260, cy - 260, cx + 260, cy + 260);
  glossGrad.addColorStop(0, 'rgba(255,255,255,0.3)');
  glossGrad.addColorStop(0.48, 'rgba(255,255,255,0.05)');
  glossGrad.addColorStop(0.52, 'rgba(255,255,255,0)');
  glossGrad.addColorStop(1, 'rgba(0,0,0,0.08)');
  ctx.fillStyle = glossGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Fleece Pullover Hoodie Geometry
 */
function renderHoodie(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const topY = h * 0.16;
  const botY = h * 0.86;

  ctx.save();

  // Hood draped behind
  ctx.beginPath();
  ctx.arc(cx, topY + 40, 110, Math.PI, 0, false);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();

  // Main Garment Body
  ctx.beginPath();
  ctx.moveTo(cx - 80, topY + 40);
  ctx.lineTo(cx + 80, topY + 40);
  ctx.lineTo(cx + 250, topY + 110);
  ctx.lineTo(cx + 360, topY + 280); // right sleeve
  ctx.lineTo(cx + 300, topY + 330);
  ctx.lineTo(cx + 240, topY + 280); // armpit
  ctx.lineTo(cx + 240, botY - 50);
  ctx.lineTo(cx + 230, botY); // ribbed hem
  ctx.lineTo(cx - 230, botY);
  ctx.lineTo(cx - 240, botY - 50);
  ctx.lineTo(cx - 240, topY + 280);
  ctx.lineTo(cx - 300, topY + 330);
  ctx.lineTo(cx - 360, topY + 280);
  ctx.lineTo(cx - 250, topY + 110);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // Kangaroo Pocket
  ctx.beginPath();
  ctx.moveTo(cx - 150, botY - 55);
  ctx.lineTo(cx + 150, botY - 55);
  ctx.lineTo(cx + 120, botY - 200);
  ctx.lineTo(cx - 120, botY - 200);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // White Hoodie Drawstrings
  ctx.beginPath();
  ctx.moveTo(cx - 35, topY + 55);
  ctx.quadraticCurveTo(cx - 45, topY + 150, cx - 35, topY + 220);
  ctx.moveTo(cx + 35, topY + 55);
  ctx.quadraticCurveTo(cx + 45, topY + 150, cx + 35, topY + 220);
  ctx.strokeStyle = '#F1F5F9';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Metal Aglets on tips
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 35, topY + 210);
  ctx.lineTo(cx - 35, topY + 222);
  ctx.moveTo(cx + 35, topY + 210);
  ctx.lineTo(cx + 35, topY + 222);
  ctx.stroke();

  ctx.restore();
}

/**
 * Stainless Steel Tumbler Geometry
 */
function renderTumbler(
  ctx: CanvasRenderingContext2D,
  color: string,
  _angle: ProductAngle,
  w: number,
  h: number
) {
  const cx = w * 0.5;
  const topY = h * 0.22;
  const botY = h * 0.80;
  const topW = w * 0.22;
  const botW = w * 0.16;

  ctx.save();

  // Acrylic Tumbler Lid
  ctx.beginPath();
  ctx.ellipse(cx, topY - 14, topW + 6, 22, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Tumbler Body (Tapered Cylinder)
  ctx.beginPath();
  ctx.moveTo(cx - topW, topY);
  ctx.lineTo(cx + topW, topY);
  ctx.lineTo(cx + botW, botY);
  ctx.quadraticCurveTo(cx, botY + 16, cx - botW, botY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Brushed Metal Vertical Highlights
  const metalGrad = ctx.createLinearGradient(cx - topW, 0, cx + topW, 0);
  metalGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
  metalGrad.addColorStop(0.18, 'rgba(0,0,0,0.05)');
  metalGrad.addColorStop(0.35, 'rgba(255,255,255,0.45)'); // Gloss streak
  metalGrad.addColorStop(0.55, 'rgba(255,255,255,0.1)');
  metalGrad.addColorStop(0.85, 'rgba(0,0,0,0.1)');
  metalGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
  ctx.fillStyle = metalGrad;
  ctx.fill();

  ctx.restore();
}

/**
 * 4. Render Logo on Product
 */
function renderLogoOnProduct(
  ctx: CanvasRenderingContext2D,
  product: ProductConfig,
  angle: ProductAngle,
  logoImg: HTMLImageElement,
  settings: LogoSettings,
  w: number,
  h: number
) {
  ctx.save();

  // Calculate target print zone center
  let zoneCenterX = (product.printZone.x / 100) * w;
  let zoneCenterY = (product.printZone.y / 100) * h;

  // Angle adjustments for print zone center
  if (product.id === 'mug' && angle === 'perspective') {
    zoneCenterX += w * 0.04;
  }
  if (product.id === 'tshirt' && angle === 'hanger') {
    zoneCenterY += h * 0.03;
  }

  // Apply user offsets
  const targetX = zoneCenterX + settings.x;
  const targetY = zoneCenterY + settings.y;

  // Max dimension reference
  const baseDim = Math.min(
    (product.printZone.width / 100) * w,
    (product.printZone.height / 100) * h
  );

  const drawWidth = baseDim * settings.scale;
  const drawHeight = (drawWidth / (logoImg.width || 1)) * (logoImg.height || 1);

  // Set Blend Mode
  const compositeMode: GlobalCompositeOperation = 
    settings.blendMode === 'normal' ? 'source-over' : (settings.blendMode as GlobalCompositeOperation);
  ctx.globalCompositeOperation = compositeMode;
  ctx.globalAlpha = settings.opacity;

  // Move to target center
  ctx.translate(targetX, targetY);

  // Rotation
  if (settings.rotation !== 0) {
    ctx.rotate((settings.rotation * Math.PI) / 180);
  }

  // Pre-process logo with tint, saturation, brightness, contrast
  const processedCanvas = processLogoCanvas(logoImg, settings, drawWidth, drawHeight);

  // Cylindrical wrap for curved objects (mugs, tumblers)
  if (product.printZone.curvature && product.printZone.curvature > 0) {
    drawCurvedLogo(ctx, processedCanvas, drawWidth, drawHeight, product.printZone.curvature);
  } else {
    ctx.drawImage(
      processedCanvas,
      -drawWidth / 2,
      -drawHeight / 2,
      drawWidth,
      drawHeight
    );
  }

  ctx.restore();
}

/**
 * Pre-process logo for color tint, saturation, brightness, contrast
 */
function processLogoCanvas(
  img: HTMLImageElement,
  settings: LogoSettings,
  targetW: number,
  targetH: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // Render at sharp 2x resolution
  canvas.width = Math.max(64, Math.round(targetW * 2));
  canvas.height = Math.max(64, Math.round(targetH * 2));
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Apply CSS filters (saturation, brightness, contrast)
  const filters: string[] = [];
  if (settings.saturation !== 1) {
    filters.push(`saturate(${Math.round(settings.saturation * 100)}%)`);
  }
  if (settings.brightness !== 1) {
    filters.push(`brightness(${Math.round(settings.brightness * 100)}%)`);
  }
  if (settings.contrast !== 1) {
    filters.push(`contrast(${Math.round(settings.contrast * 100)}%)`);
  }

  if (filters.length > 0) {
    ctx.filter = filters.join(' ');
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';

  // Apply Color Tint if specified
  if (settings.colorTint !== 'original') {
    applyColorTint(ctx, settings.colorTint, settings.customTintColor, canvas.width, canvas.height);
  }

  return canvas;
}

/**
 * Tint pixel pass for white, black, gold, silver, custom
 */
function applyColorTint(
  ctx: CanvasRenderingContext2D,
  tint: string,
  customColor: string | undefined,
  w: number,
  h: number
) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-in';

  if (tint === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  } else if (tint === 'black') {
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, w, h);
  } else if (tint === 'gold') {
    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, '#F59E0B');
    goldGrad.addColorStop(0.5, '#FDE68A');
    goldGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = goldGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (tint === 'silver') {
    const silvGrad = ctx.createLinearGradient(0, 0, w, h);
    silvGrad.addColorStop(0, '#94A3B8');
    silvGrad.addColorStop(0.5, '#F8FAFC');
    silvGrad.addColorStop(1, '#64748B');
    ctx.fillStyle = silvGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (tint === 'custom' && customColor) {
    ctx.fillStyle = customColor;
    ctx.fillRect(0, 0, w, h);
  }

  ctx.restore();
}

/**
 * Slices logo into vertical strips and compresses horizontally to simulate 3D cylinder wrap
 */
function drawCurvedLogo(
  ctx: CanvasRenderingContext2D,
  srcCanvas: HTMLCanvasElement,
  w: number,
  h: number,
  curvature: number
) {
  const slices = 24;
  const sliceWidthSrc = srcCanvas.width / slices;
  const sliceWidthDst = w / slices;

  for (let i = 0; i < slices; i++) {
    // Normal coordinate from -1 to 1 across the logo width
    const t = (i / (slices - 1)) * 2 - 1;
    // Cosine compression factor
    const cosFactor = Math.cos(t * Math.PI * 0.42 * curvature);
    // Vertical curvature offset
    const yOffset = (1 - cosFactor) * h * 0.14 * (curvature * 2);

    const destX = -w / 2 + i * sliceWidthDst;
    const destY = -h / 2 + yOffset;

    ctx.drawImage(
      srcCanvas,
      i * sliceWidthSrc,
      0,
      sliceWidthSrc,
      srcCanvas.height,
      destX,
      destY,
      sliceWidthDst * cosFactor,
      h * cosFactor
    );
  }
}

/**
 * 5. Material Overlays (Highlights & Shadows according to lighting condition)
 */
function renderMaterialOverlays(
  ctx: CanvasRenderingContext2D,
  product: ProductConfig,
  _angle: ProductAngle,
  lighting: LightingCondition,
  w: number,
  h: number
) {
  ctx.save();

  if (lighting === 'dramatic') {
    // Top-left strong spotlight
    const spot = ctx.createRadialGradient(w * 0.35, h * 0.25, 40, w * 0.5, h * 0.5, w * 0.65);
    spot.addColorStop(0, 'rgba(255,255,255,0.18)');
    spot.addColorStop(0.6, 'rgba(0,0,0,0.08)');
    spot.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);
  } else if (lighting === 'warm') {
    // Golden warm ambient tint
    const warmOverlay = ctx.createLinearGradient(0, 0, w, h);
    warmOverlay.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
    warmOverlay.addColorStop(1, 'rgba(180, 83, 9, 0.08)');
    ctx.fillStyle = warmOverlay;
    ctx.fillRect(0, 0, w, h);
  } else if (lighting === 'natural') {
    // Diffused directional daylight
    const nat = ctx.createLinearGradient(0, 0, w, 0);
    nat.addColorStop(0, 'rgba(255,255,255,0.1)');
    nat.addColorStop(1, 'rgba(0,0,0,0.06)');
    ctx.fillStyle = nat;
    ctx.fillRect(0, 0, w, h);
  }

  // Specular sheen on ceramic / plastic / vinyl
  if (product.id === 'mug' || product.id === 'phonecase' || product.id === 'sticker') {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(w * 0.45, h * 0.3, w * 0.04, h * 0.45);
    ctx.restore();
  }

  ctx.restore();
}
