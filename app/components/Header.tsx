import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="px-7 w-full h-16 flex items-center justify-center border-b border-primary-border gap-20 bg-main text-secondary">
      <div className="">
        <h1 className="text-2xl">
          <Link href="/">Berbon</Link>
        </h1>
      </div>

      <nav className="ml-auto select-none">
        <ul className="flex gap-10">
          <li className="group relative hover:text-tertiary py-2 transition-all duration-300">
            <p>Palettes</p>
            <ul className="absolute opacity-0 top-[100%] group-hover:opacity-100 flex flex-col gap-3 p-7 border border-secondary-border z-[1] text-secondary rounded-lg backdrop-blur-md bg-[rgba(10,10,10,0.5)] transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <li className="hover:text-tertiary">
                <Link href="/palettes/generate">Generate</Link>
              </li>
              <li className="hover:text-tertiary">
                <Link href="/palettes">Explore</Link>
              </li>
            </ul>
          </li>
          <li className="group relative hover:text-tertiary py-2 transition-all duration-300">
            <p>Colors</p>
            <ul className="absolute opacity-0 top-[100%] group-hover:opacity-100 flex flex-col gap-3 p-7 border border-secondary-border z-[1] text-secondary rounded-lg backdrop-blur-md bg-[rgba(10,10,10,0.5)] transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <li className="hover:text-tertiary">
                <Link href="/colors">Explore</Link>
              </li>
            </ul>
          </li>
          <li className="group relative hover:text-tertiary py-2 transition-all duration-300">
            <p>Gradients</p>
            <ul className="absolute opacity-0 top-[100%] group-hover:opacity-100 flex flex-col gap-3 p-7 border border-secondary-border z-[1] text-secondary rounded-lg backdrop-blur-md bg-[rgba(10,10,10,0.5)] transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <li className="hover:text-tertiary">
                <Link href="/gradients/make">Make</Link>
              </li>
              <li className="hover:text-tertiary">
                <Link href="/gradients/palette">Palette</Link>
              </li>
              <li className="hover:text-tertiary">
                <Link href="/gradients">Explore</Link>
              </li>
            </ul>
          </li>
          <li className="group relative hover:text-tertiary py-2 transition-all duration-300">
            <p>Font Icons</p>
            <ul className="absolute opacity-0 top-[100%] group-hover:opacity-100 flex flex-col gap-3 p-7 border border-secondary-border z-[1] text-secondary rounded-lg backdrop-blur-md bg-[rgba(10,10,10,0.5)] transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
              <li className="hover:text-tertiary">
                <Link href="/font-icons/make">Make</Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <div className="flex gap-6">
        <button className="w-28 h-9 text-sm rounded-lg bg-secondary text-main">
          Sign Up
        </button>
        <button className="w-28 h-9 border border-primary-border text-sm rounded-lg">
          Sign In
        </button>
      </div>
    </header>
  );
}
