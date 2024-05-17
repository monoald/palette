import { Icon } from "../craft/page";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generateThumbnail(icons: Icon[]): Promise<string> {
  return new Promise((resolve) => {
    let loadedImageCount = 0;
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 130;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.fillStyle = "#00000000";
    ctx.fillRect(0, 0, 300, 130);

    const usedSpace: Array<{ x: number[]; y: number[] }> = [];

    for (let i = 0; i < 15; i++) {
      const svgIcon = icons[randomBetween(0, icons.length - 1)];

      let randomX = 0;
      let randomY = 0;
      let hasSpace = false;

      while (!hasSpace) {
        randomX = randomBetween(0, 282);
        randomY = randomBetween(0, 112);
        hasSpace = true;

        for (const i in usedSpace) {
          if (
            randomX >= usedSpace[i].x[0] &&
            randomX <= usedSpace[i].x[1] &&
            randomY >= usedSpace[i].y[0] &&
            randomY <= usedSpace[i].y[1]
          ) {
            hasSpace = false;
            break;
          }
        }
      }
      usedSpace.push({
        x: [randomX - 28, randomX + 45],
        y: [randomY - 28, randomY + 45],
      });

      const img = new Image();
      img.src =
        "data:image/svg+xml," +
        encodeURIComponent(
          svgIcon.svg.replace(
            'xmlns="http://www.w3.org/2000/svg"',
            `xmlns="http://www.w3.org/2000/svg" transform="rotate(${
              randomBetween(0, 1) === 0
                ? randomBetween(0, 80) * -1
                : randomBetween(0, 80)
            })"`
          )
        );

      img.onload = () => {
        loadedImageCount++;
        ctx.drawImage(img, randomX, randomY, 18, 18);

        if (loadedImageCount === 15) {
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        }
      };
    }
  });
}
