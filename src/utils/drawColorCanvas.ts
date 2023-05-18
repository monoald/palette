export function drawColorCanvas(canvas: HTMLCanvasElement, hue: number) {
  const colorCtx = canvas?.getContext('2d', { 'willReadFrequently': true }) as  CanvasRenderingContext2D;

  const gradientH = colorCtx.createLinearGradient(0, 0, colorCtx.canvas.width, 0);
  gradientH.addColorStop(0, `hsl(${hue}, 100%, 100%)`);
  gradientH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
  colorCtx.fillStyle = gradientH;
  colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);

  const gradientV = colorCtx.createLinearGradient(0, 0, 0, colorCtx.canvas.height);
  gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradientV.addColorStop(1, `hsl(${hue}, 0%, 0%)`);
  colorCtx.fillStyle = gradientV;
  colorCtx.fillRect(0, 0, colorCtx.canvas.width, colorCtx.canvas.height);


  colorCtx.fillStyle = `#fff`;
  colorCtx.fillRect(0, 0, 1, 1)
  colorCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
  colorCtx.fillRect(canvas.width - 1, 0, 1, 1)
}