"use client";
import { useUserStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect } from "react";

export default function UserArea() {
  const user = useUserStore((state) => state.user);
  const updatUser = useUserStore((state) => state.updateUser);

  useLayoutEffect(() => {
    updatUser(
      JSON.parse(localStorage.getItem("user") as string),
      JSON.parse(localStorage.getItem("token") as string)
    );
  }, [updatUser]);

  return (
    <>
      {!user ? (
        <div className="flex gap-6">
          <button className="w-28 h-10 bg-tertiary rounded-full text-main">
            Sign Up
          </button>
          <button className="w-28 h-10 border border-primary-border rounded-full">
            Sign In
          </button>
        </div>
      ) : (
        <div className="group/area w-fit h-fit flex">
          <button className="w-[42px] h-[42px] rounded-full overflow-hidden">
            <Image
              className="object-cover"
              src={`data:image/png;base64,${user.avatar}`}
              alt=""
              width={42}
              height={42}
            />
          </button>
          <ul className="absolute right-7 top-full w-44 opacity-0  group-hover/area:opacity-100 group-active/area:opacity-100 group-focus-visible/area:opacity-100 flex flex-col gap-5 p-7 border border-secondary-border z-50 text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all duration-300 pointer-events-none group-hover/area:pointer-events-auto group-active/area:pointer-events-auto group-focus-visible/area:pointer-events-auto">
            <li className="primary-hover">
              <Link href="/me/palettes">My Palettes</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/colors">My Colors</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/gradients">My Gradients</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/font-icons">My Font Icons</Link>
            </li>
            <li className="primary-hover">
              <Link href="/login">Sign out</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
