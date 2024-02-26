"use client";
import Image from "next/image";
import { openPopUp } from "../login/utils/openPopUp";
import { UserState, useUserStore } from "@/store";
import { useRouter } from "next/navigation";

type Props = {
  src: string;
  url: string;
};

export default function SocialLogin({ src, url }: Props) {
  const router = useRouter();
  const updateUser = useUserStore((state) => state.updateUser);

  const handleSocialLogin = () => {
    openPopUp(url, "signin", messageListener);
  };

  const messageListener = async (e: MessageEvent) => {
    const key = e.data.length === 20 ? e.data : null;

    if (key) {
      const body = JSON.stringify({ key: key });
      const credentials: UserState = await fetch(
        "http://localhost:3000/api/v1/auth/signin",
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
        router.push("/me");
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
