"use client";

import { useEffect, useState } from "react";
import useStateHandler from "../(core)/hooks/useStateHandler";

export default function Message() {
  const [info, setInfo] = useState({
    message: undefined,
    type: undefined,
  });

  useEffect(() => {
    if (info.message !== undefined) {
      setTimeout(() => {
        setInfo({
          message: undefined,
          type: undefined,
        });
      }, 5000);
    }
  });

  const updateMessageHandler = (e: Event) => {
    const event = e as CustomEvent;

    setInfo({
      message: event.detail.message,
      type: event.detail.type,
    });
  };

  useStateHandler([updateMessageHandler], ["custom:updateMessage"]);

  const a = "".toUpperCase;

  return (
    <>
      {info.message !== undefined && (
        <div className="fixed bottom-8 left-8 text-base bg-[#03050C88] rounded-lg">
          <div
            className={`min-w-64 p-6 border border-secondary-border rounded-lg backdrop-blur-2xl flex items-center gap-4 text-[#fdfdfd]`}
          >
            {info.type === "general" && (
              <span className="icon-info info-icon text-2xl" />
            )}
            {info.type === "success" && (
              <span className="icon-check-round check-round-icon text-2xl" />
            )}
            {info.type === "warning" && (
              <span className="icon-danger danger-icon text-2xl" />
            )}
            {info.type === "error" && (
              <span className="icon-x-round x-round-icon text-2xl" />
            )}
            {info.message}
          </div>
        </div>
      )}
    </>
  );
}
