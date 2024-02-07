/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export default function useStateHandler(
  callbacks: (() => void)[] | ((e: Event) => void)[],
  eventNames: string[]
) {
  useEffect(() => {
    for (const index in callbacks) {
      window.addEventListener(eventNames[index], callbacks[index]);
    }

    return () => {
      for (const index in callbacks) {
        window.removeEventListener(eventNames[index], callbacks[index]);
      }
    };
  }, []);
}

export function dispatch(name: string, detail?: { [key: string]: any }) {
  const customEvent = new CustomEvent(name, {
    detail,
  });

  window.dispatchEvent(customEvent);
}
