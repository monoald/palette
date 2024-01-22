import { Rgb } from "colors-kit";

export function drawColorCanvas(canvas: HTMLCanvasElement, hue: number) {
  const colorCtx = canvas?.getContext("2d", {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;

  const gradientH = colorCtx.createLinearGradient(
    0,
    0,
    colorCtx.canvas.width,
    0
  );
  gradientH.addColorStop(0, `hsl(${hue}, 100%, 100%)`);
  gradientH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
  colorCtx.fillStyle = gradientH;
  colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

  const gradientV = colorCtx.createLinearGradient(
    0,
    0,
    0,
    colorCtx.canvas.height
  );
  gradientV.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradientV.addColorStop(1, `hsl(${hue}, 0%, 0%)`);
  colorCtx.fillStyle = gradientV;
  colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

  colorCtx.fillStyle = `#fff`;
  colorCtx.fillRect(0, 0, 1, 1);
  colorCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  colorCtx.fillRect(canvas.width - 1, 0, 1, 1);
}

export function findColorCoordinates(canvas: HTMLCanvasElement, color: Rgb) {
  const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const data = imageData.data;

  const closestColor = {
    distance: Infinity,
    coordinates: { x: 0, y: 0 },
  };

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const red = data[(canvas.width * y + x) * 4];
      const green = data[(canvas.width * y + x) * 4 + 1];
      const blue = data[(canvas.width * y + x) * 4 + 2];
      const currentColor = { r: red, g: green, b: blue };
      const distance = colorDistance(currentColor, color);

      if (distance === 0) {
        return { x, y };
      }

      if (distance < closestColor.distance) {
        closestColor.distance = distance;
        closestColor.coordinates = { x, y };
      }
    }
  }
  return closestColor.coordinates;
}

function colorDistance(color1: Rgb, color2: Rgb) {
  const rmean = (color1.r + color2.r) / 2;
  const r = color1.r - color2.r;
  const g = color1.g - color2.g;
  const b = color1.b - color2.b;
  return Math.sqrt(
    (((512 + rmean) * r * r) >> 8) + 4 * g * g + (((767 - rmean) * b * b) >> 8)
  );
}
