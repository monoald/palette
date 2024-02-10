"use client";

import { useState } from "react";
import useStateHandler from "../(core)/hooks/useStateHandler";
import { makeRandomID } from "../utils/makeRandomID";

export default function Message() {
  const [info, setInfo] = useState<
    {
      message: string;
      type: string;
      id: string;
    }[]
  >([]);

  const updateMessageHandler = (e: Event) => {
    const event = e as CustomEvent;

    setInfo([
      ...info,
      {
        message: event.detail.message,
        type: event.detail.type,
        id: makeRandomID(),
      },
    ]);
    setTimeout(() => {
      setInfo((prev) => {
        const newInfo = [...prev];
        const messageIndex = newInfo.findIndex(
          (msg) => msg.message === event.detail.message
        );

        if (messageIndex !== -1) {
          newInfo.splice(messageIndex, 1);
        }

        return newInfo;
      });
    }, 5000);
  };

  useStateHandler([updateMessageHandler], ["custom:updateMessage"]);

  return (
    <>
      {info.length !== 0 && (
        <div className="fixed bottom-8 left-8 w-fit h-fit">
          {info.map((message) => (
            <div
              key={message.id}
              className="absolute bottom-0 left-0 w-fit h-fit text-base bg-[#03050C88] rounded-lg"
            >
              <div
                className={`min-w-64 w-fit p-6 border border-secondary-border rounded-lg backdrop-blur-2xl flex items-center gap-4 text-[#fdfdfd]`}
              >
                {message.type === "general" && (
                  <span className="icon-info info-icon text-2xl" />
                )}
                {message.type === "success" && (
                  <span className="icon-check-round check-round-icon text-2xl" />
                )}
                {message.type === "warning" && (
                  <span className="icon-danger danger-icon text-2xl" />
                )}
                {message.type === "error" && (
                  <span className="icon-x-round x-round-icon text-2xl" />
                )}
                <p className="w-full message-text">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
