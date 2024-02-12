"use client";

import { useUserStore } from "@/store";
import { useEffect, useLayoutEffect, useState } from "react";
import { getUserCollections } from "../me/action";

export default function User({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState(false);
  const [fullyLoad, setFullyLoad] = useState(false);

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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      updateUser(
        JSON.parse(localStorage.getItem("user") as string),
        JSON.parse(localStorage.getItem("token") as string)
      );
    }

    setFullyLoad(true);
  }, [client, updateUser]);

  if (user || fullyLoad) {
    return <>{children}</>;
  }
  return (
    <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
      <span className="mx-auto" id="loader"></span>
    </div>
  );
}
