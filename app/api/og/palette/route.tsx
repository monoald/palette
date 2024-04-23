import { getMainContrastColor } from "@/app/utils/createBaseColorObject";
import { ImageResponse } from "@vercel/og";
import { hexToRgb } from "colors-kit";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const palette = request.nextUrl.searchParams
    .get("content")
    ?.split("-")
    .map((clr) => "#" + clr);

  const data = await fetch(
    "https://paleta-v3.vercel.app/fonts/Geist-Medium.otf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          gap: "24px",
          padding: "24px",
          background: "#03050c",
        }}
      >
        {palette?.map((clr) => (
          <div
            key={clr}
            style={{
              background: clr,
              width:
                1200 / palette.length -
                ((palette.length - 1) * 24) / palette.length -
                48 / palette.length +
                "px",
              height: "100%",
              "border-radius": "24px",
              display: "flex",
              justifyContent: "center",
              paddingTop: "30px",
            }}
          >
            <p
              style={{
                color: getMainContrastColor(hexToRgb(clr)) + "99",
                fontSize: "30px",
              }}
            >
              {clr.toUpperCase()}
            </p>
          </div>
        ))}
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
