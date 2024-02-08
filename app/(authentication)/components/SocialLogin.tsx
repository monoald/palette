"use client";
import Image from "next/image";
import { openPopUp } from "../login/utils/openPopUp";
import { User, useUserStore } from "@/store";

type Props = {
  src: string;
  url: string;
};

export default function SocialLogin({ src, url }: Props) {
  const updateUser = useUserStore((state) => state.updateUser);

  const handleSocialLogin = () => {
    openPopUp(url, "signin", messageListener);
  };

  const messageListener = async (e: MessageEvent) => {
    const key = e.data.length === 20 ? e.data : null;

    if (key) {
      const body = JSON.stringify({ key: key });
      const credentials: { user: User; token: string } | { error: string } =
        await fetch("http://localhost:3000/api/v1/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        }).then((res) => res.json());

      if ("token" in credentials && "user" in credentials) {
        const { user, token } = credentials;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
        updateUser(user, token);
      }
    }
  };
  return (
    <button
      className="p-4 border border-primary-border rounded-full"
      onClick={handleSocialLogin}
    >
      <Image src={src} alt="facebook icon" width={18} height={18} />
    </button>
  );
}
