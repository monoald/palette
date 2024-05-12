"use client";

import Image from "next/image";
import { openPopUp } from "../utils/openPopUp";
import { UserState, useUserStore } from "@/store";
import { dispatch } from "../(core)/hooks/useStateHandler";

export type Provider = {
  name: string;
  src: string;
  url: string;
};
type Props = {
  provider: Provider;
  handleEvent?: () => void;
};

const BACKEND_URI = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function SocialLogin({ provider, handleEvent }: Props) {
  const { name, src, url } = provider;
  const updateUser = useUserStore((state) => state.updateUser);

  const handleSocialLogin = () => {
    openPopUp(url, "signin", messageListener);
    if (handleEvent) {
      handleEvent();
    }
  };

  const messageListener = async (e: MessageEvent) => {
    const data = e.data;
    const key = data?.key;

    if (key !== undefined) {
      const body = JSON.stringify({ key: data?.key });
      const credentials: UserState = await fetch(
        `${BACKEND_URI}/users/signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }
      ).then((res) => res.json());

      const { user, token } = credentials;

      if (user && token) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
        updateUser(user, token);
      } else {
        dispatch("custom:updateMessage", {
          type: "error",
          message: "An error ocurred!",
        });
      }
    }
  };
  return (
    <button
      className="p-4 w-fit border border-primary-border rounded-full"
      onClick={handleSocialLogin}
    >
      <Image src={src} alt={`${name} icon`} width={22} height={22} />
    </button>
  );
}
