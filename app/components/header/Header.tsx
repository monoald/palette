"use client";

import React, { useLayoutEffect, useState } from "react";
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
    name: "Colors",
    subNav: [
      {
        name: "Explore",
        route: "/colors/explore",
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
  const [toggleMenu, setToggleMenu] = useState(false);

  const [windowSize, setWindowSize] = useState([0, 0]);
  const updateWindowSize = () => {
    // setWindowSize([window.innerWidth, window.innerHeight]);
    setToggleMenu(window.innerWidth >= 662);
  };
  useLayoutEffect(() => {
    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  return (
    <header className="relative px-8 pt-8 w-full h-fit flex items-center justify-center gap-9 bg-main text-secondary text-sm">
      <div className="">
        <h1 className="text-2xl">
          <Link href="/">Paleta</Link>
        </h1>
      </div>

      <div className="bp:static ml-auto bp:mx-auto">
        <button
          className="bp:hidden w-10 h-10 color-secondary"
          onClick={() => setToggleMenu(!toggleMenu)}
        >
          <span className="block w-8 h-8 bg-[url('/menu.svg')] bg-no-repeat bg-center bg-cover"></span>
        </button>

        <nav
          className="absolute bp:relative top-full right-0 w-full max-w-80 bp:w-auto bp:max-w-none p-7 bp:p-0 border border-secondary-border rounded-2xl max-bp:backdrop-blur-md bg-transparent-main bp:h-10 bp:select-none bp:border bp:border-primary-border bp:rounded-full bp:px-6 z-10"
          style={{
            display: toggleMenu ? "block" : "none",
          }}
        >
          <ul className="bp:h-10 flex flex-wrap bp:flex-nowrap max-bp:justify-between items-start bp:items-center gap-3 bp:gap-10">
            {navContent.map((element) => (
              <li
                key={element.name}
                className="w-28 bp:w-auto max-bp:flex max-bp:flex-col max-bp:items-center group relative py-2 transition-all duration-300 secondary-hover"
              >
                <p className="max-bp:font-semibold max-bp:text-base">
                  {element.name}
                </p>
                <ul className="bp:absolute bp:opacity-0 top-full -left-7 w-full bp:w-32 group-hover:opacity-100 group-active:opacity-100 bp:group-focus-visible:opacity-100 flex flex-col max-bp:items-center gap-5 p-3 bp:p-7 bp:border bp:border-secondary-border z-50 text-secondary bp:rounded-2xl bp:backdrop-blur-sm bp:bg-transparent-main transition-all duration-300 pointer-events-none group-hover:pointer-events-auto group-active:pointer-events-auto group-focus-visible:pointer-events-auto">
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
      </div>

      <UserArea />
    </header>
  );
}
