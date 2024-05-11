"use client";

import { useState } from "react";
import useStateHandler from "../(core)/hooks/useStateHandler";

export default function OptionMessage() {
  const [info, setInfo] = useState({
    message: undefined,
    callbackContinue: () => {},
    callbackCancel: () => {},
  });

  const updateMessageHandler = (e: Event) => {
    const event = e as CustomEvent;

    setInfo({
      message: event.detail.message,
      callbackContinue: event.detail.callbackContinue,
      callbackCancel: event.detail.callbackCancel,
    });
  };

  useStateHandler([updateMessageHandler], ["custom:updateOptionMessage"]);

  const handleClose = () => {
    info.callbackCancel();

    setInfo({
      message: undefined,
      callbackContinue: () => {},
      callbackCancel: () => {},
    });
  };

  const handleContinue = () => {
    info.callbackContinue();

    setInfo({
      message: undefined,
      callbackContinue: () => {},
      callbackCancel: () => {},
    });
  };

  return (
    <>
      {info.message !== undefined && (
        <div className="fixed inset-0 flex items-center justify-center text-base bg-[#03050C44] rounded-lg">
          <div
            className={`min-w-64 max-w-80 p-10 border border-secondary-border rounded-lg backdrop-blur-2xl flex flex-col items-center gap-10 text-[#fdfdfd] bg-transparent-main text-center text-pretty`}
          >
            <p>{info.message}</p>
            <div className="flex gap-8">
              <button
                className="w-28 h-10 border border-primary-border rounded-full"
                onClick={handleClose}
              >
                Close
              </button>
              <button className="primary-button" onClick={handleContinue}>
                <div>
                  <span>Continue</span>
                  <div className="circle-12"></div>
                  <div className="circle-11"></div>
                  <div className="circle-10"></div>
                  <div className="circle-9"></div>
                  <div className="circle-8"></div>
                  <div className="circle-7"></div>
                  <div className="circle-6"></div>
                  <div className="circle-5"></div>
                  <div className="circle-4"></div>
                  <div className="circle-3"></div>
                  <div className="circle-2"></div>
                  <div className="circle-1"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
