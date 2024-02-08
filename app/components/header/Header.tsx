import React from "react";
import Link from "next/link";
import UserArea from "./UserArea";

const navContent = [
  {
    name: "Palettes",
    subNav: [
      {
        name: "Explore",
        route: "/palette/explore",
      },
      {
        name: "Craft",
        route: "/palette/craft",
      },
    ],
  },
  {
    name: "Colors",
    subNav: [
      {
        name: "Explore",
        route: "/colors/explore",
      },
    ],
  },
  {
    name: "Gradients",
    subNav: [
      {
        name: "Explore",
        route: "/gradient/explore",
      },
      {
        name: "Craft",
        route: "/gradient/craft",
      },
    ],
  },
  {
    name: "Font Icons",
    subNav: [
      {
        name: "Craft",
        route: "/font-icon/craft",
      },
    ],
  },
];

export default function Header() {
  return (
    <header className="relative px-8 pt-8 w-full h-fit flex items-center justify-center gap-9 bg-main text-secondary text-sm">
      <div className="">
        <h1 className="text-2xl">
          <Link href="/">Berbon</Link>
        </h1>
      </div>

      <nav className="mx-auto h-10 select-none border border-primary-border rounded-full px-6">
        <ul className="h-10 flex items-center gap-10">
          {navContent.map((element) => (
            <li
              key={element.name}
              className="group relative py-2 transition-all duration-300 secondary-hover"
            >
              <p>{element.name}</p>
              <ul className="absolute opacity-0 top-full -left-7 w-32 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100 flex flex-col gap-5 p-7 border border-secondary-border z-50 text-secondary rounded-2xl backdrop-blur-sm bg-transparent-main transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-active:pointer-events-auto group-focus-visible:pointer-events-auto">
                {element.subNav.map((subElement) => (
                  <li
                    key={`${element.name}-${subElement.name}`}
                    className="primary-hover"
                  >
                    <Link href={subElement.route}>{subElement.name}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      <UserArea />
    </header>
  );
}
