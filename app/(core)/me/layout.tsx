"use client";

import { useLayoutEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store";
import MainLoader from "./components/MainLoader";
import { getUserCollections } from "./action";
import SecondaryLoader from "./components/SecondaryLoader";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const pathname = usePathname();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const token = useUserStore((state) => state.token);
  const collections = useUserStore((state) => state.collections);
  const updateCollections = useUserStore((state) => state.updateCollections);

  useLayoutEffect(() => {
    async function getCollections() {
      if (collections === null && token) {
        const data = await getUserCollections(token as string);
        updateCollections(data);
      }
    }

    getCollections();
    setClient(true);
  }, [collections, token, updateCollections]);

  if (!user && client) {
    if (localStorage.getItem("token")) {
      updateUser(
        JSON.parse(localStorage.getItem("user") as string),
        JSON.parse(localStorage.getItem("token") as string)
      );
    } else {
      router.push("/login");
    }
  } else if (!user) {
    if (pathname === "/me") {
      return <MainLoader />;
    }
    return <SecondaryLoader />;
  } else {
    return <>{children}</>;
  }
}
