import { Icon } from "../craft/page";

export function generateThumbnail(icons: Icon[]): Promise<string> {
  return new Promise((resolve) => {
    let loadedImageCount = 0;
    const canvas = document.createElement("canvas");
    canvas.width = 220;
    canvas.height = 132;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#111217";
    ctx.fillRect(0, 0, 220, 132);

    icons.forEach((svgIcon, index) => {
      const i = index > 2 ? index - 3 : index;
      const x = (i % 3) * 48 + (i + 1) * 24;
      const y = index < 3 ? 24 : 78;

      const img = new Image();
      img.src = "data:image/svg+xml," + encodeURIComponent(svgIcon.content);

      img.onload = () => {
        loadedImageCount++;
        ctx.drawImage(img, x, y, 30, 30);

        if (loadedImageCount === icons.length) {
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        }
      };
    });
  });
}
