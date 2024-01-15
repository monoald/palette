import React from "react";
import Link from "next/link";

const navContent = [
  {
    name: "Palettes",
    subNav: [
      {
        name: "Explore",
        route: "/palettes",
      },
      {
        name: "Craft",
        route: "/palettes/craft",
      },
    ],
  },
  {
    name: "Colors",
    subNav: [
      {
        name: "Explore",
        route: "/colors",
      },
    ],
  },
  {
    name: "Gradients",
    subNav: [
      {
        name: "Explore",
        route: "/gradients",
      },
      {
        name: "Craft",
        route: "/gradients/craft",
      },
    ],
  },
  {
    name: "Font Icons",
    subNav: [
      {
        name: "Craft",
        route: "/font-icons/craft",
      },
    ],
  },
];

export default function Header() {
  return (
    <header className="px-8 pt-8 w-full h-fit flex items-center justify-center gap-20 bg-main text-secondary">
      <div className="">
        <h1 className="text-2xl">
          <Link href="/">Berbon</Link>
        </h1>
      </div>

      <nav className="mx-auto h-10 select-none border border-primary-border rounded-full px-6">
        <ul className="h-11 flex gap-10">
          {navContent.map((element) => (
            <li
              key={element.name}
              className="group relative hover:text-tertiary py-2 transition-all duration-300"
            >
              <p>{element.name}</p>
              <ul className="absolute opacity-0 top-[100%] group-hover:opacity-100 flex flex-col gap-3 p-7 border border-primary-border z-[1] text-secondary rounded-2xl backdrop-blur-md bg-[rgba(10,10,10,0.5)] transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                {element.subNav.map((subElement) => (
                  <li
                    key={`${element.name}-${subElement.name}`}
                    className="hover:text-tertiary"
                  >
                    <Link href={subElement.route}>{subElement.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex gap-6">
        <button className="w-28 h-10 bg-tertiary rounded-full text-main">
          Sign Up
        </button>
        <button className="w-28 h-10 border border-primary-border rounded-full">
          Sign In
        </button>
      </div>
    </header>
  );
}
