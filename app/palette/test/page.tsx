"use client";

import React from "react";

export default function page() {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    // target.style.left = "40px";
    // target.style.display = "none";
    // target.style.width = "0px";
    // target.style.animation = "1s ease shrink";
    // target.style.animationFillMode = "forwards";
    // (target.nextSibling as HTMLElement).style.display = "block";
    target.style.position = "absolute";
    target.style.left = "100px";
    target.style.transition = "0.5s";
    setTimeout(() => {
      target.style.position = "relative";
      target.style.left = "0px";
    }, 1000);
    console.log(target.nextSibling);
  };
  return (
    <div
      id="test"
      className="relative flex w-40 h-40 bg-slate-900"
      // style={{ transition: "1s" }}
      data-img="url('data:image/jpeg;base64,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')"
    >
      <div
        className="relative w-10 h-10 bg-slate-400 left-0"
        // style={{ transition: "1s" }}
        onClick={handleClick}
      ></div>
      <div
        className="relative hidden w-10 h-10 bg-transparent left-0"
        style={{
          transition: "1s",
          animation: "1s ease grow",
          animationFillMode: "forwards",
        }}
        // onClick={handleClick}
      ></div>

      <div
        className="relative w-10 h-10 bg-slate-500 left-0"
        // style={{ transition: "1s" }}
        onClick={handleClick}
      ></div>
      <div
        className="relative w-10 h-10 bg-slate-600 left-0"
        // style={{ transition: "1s" }}
        onClick={handleClick}
      ></div>
    </div>
  );
}
