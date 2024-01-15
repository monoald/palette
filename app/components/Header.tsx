import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-7 w-full h-16 flex items-center justify-center border border-hover-secondary gap-20 bg-main text-secondary">
      <div className="">
        <h1 className="text-2xl">
          <Link href="/">Berbon</Link>
        </h1>
      </div>

      <nav className="ml-auto">
        <ul className="flex gap-10">
          <li className="relative hover:text-[#7462cb]">
            <p>Palettes</p>
            <ul className="absolute top-[130%] p-7 border border-hover-secondary z-[1] ">
              <li>Generate</li>
              <li>Explore</li>
            </ul>
          </li>
          <li className="relative hover:text-[#7462cb]">
            <p>Colors</p>
            <ul className="absolute hidden top-[130%] p-7 border border-hover-secondary z-[1] ">
              <li>Explore</li>
            </ul>
          </li>
          <li className="relative hover:text-[#7462cb]">
            <p>Gradients</p>
            <ul className="absolute hidden top-[130%] p-7 border border-hover-secondary z-[1] ">
              <li>Make</li>
              <li>Palette</li>
              <li>Explore</li>
            </ul>
          </li>
          <li className="relative hover:text-[#7462cb]">
            <p>Icon Fonts</p>
            <ul className="absolute hidden top-[130%] p-7 border border-hover-secondary z-[1] ">
              <li>Make</li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="flex gap-6">
        <button className="w-28 h-9 text-sm rounded-lg bg-[#7462cb]">
          Sign Up
        </button>
        <button className="w-28 h-9 border border-hover-secondary text-sm rounded-lg">
          Sign In
        </button>
      </div>
    </header>
  );
}
