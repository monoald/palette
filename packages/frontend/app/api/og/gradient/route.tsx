import { handleURLToGradient } from "@/app/(core)/gradient/craft/[slug]/handlers";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const [slug, params] = (
    request.nextUrl.searchParams.get("content") as string
  ).split("?");
  const [grad, style] = handleURLToGradient(slug, new URLSearchParams(params));
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
            background:
              style.type.replace("conic", "radial") + style.clrs + style.end,
          }}
        ></div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
