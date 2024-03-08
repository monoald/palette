import { getMainContrastColor } from "@/app/utils/createColorObject";
import { ImageResponse } from "@vercel/og";
import { hexToRgb } from "colors-kit";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const color = request.nextUrl.searchParams.get("content");

  const contrast = getMainContrastColor(hexToRgb("#" + color));

  const data = await fetch(
    "https://paleta-v3.vercel.app/fonts/Geist-Bold.otf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100vh",
          padding: "34px",
          background: "#03050c",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            "border-radius": "24px",
            display: "flex",
            "align-items": "center",
            "justify-content": "center",
            "font-size": "80px",
            "text-transform": "uppercase",
            background: "#" + color,
            color: contrast + 99,
          }}
        >
          <h1>#{color}</h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: data,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}
