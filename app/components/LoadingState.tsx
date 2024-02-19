"use client";

import { useState } from "react";
import useStateHandler from "../(core)/hooks/useStateHandler";

export default function LoadingState() {
  const [load, setLoad] = useState(false);

  const loadHandler = (e: Event) => {
    const event = e as CustomEvent;

    setLoad(event.detail.load);
  };

  useStateHandler([loadHandler], ["custom:load"]);

  return (
    <>
      {load && (
        <div className="fixed inset-0 bg-[#00000044] flex items-center justify-center">
          <span className="mx-auto" id="loader"></span>
        </div>
      )}
    </>
  );
}
