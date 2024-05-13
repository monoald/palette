import React from "react";
import SocialLogin from "./SocialLogin";

type Props = {
  close: () => void;
};

const SERVER_URI = process.env.NEXT_PUBLIC_SERVER_URI;

const socialLogin = [
  {
    name: "google",
    src: "/google.svg",
    url: `${SERVER_URI}/auth/google`,
  },
  {
    name: "github",
    src: "/github.svg",
    url: `${SERVER_URI}/auth/github`,
  },
];

export default function LogIn({ close }: Props) {
  return (
    <article className="absolute top-8 right-8 w-96 z-10 h-fit p-10 pt-16 border border-primary-border rounded-3xl flex flex-col justify-center gap-8 backdrop-blur-md bg-transparent-main">
      <button
        className="secondary-button right-7 top-5 w-8 h-8"
        style={{ position: "absolute" }}
        onClick={close}
      >
        <div>
          <span className="icon-x" />
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
      <p className="text-2xl font-bold text-center">Welcome Back!</p>
      <div className="w-full flex items-center justify-center">
        <p className="relative px-3 text-tertiary text-shadow-active before:absolute before:top-1/2 before:right-[-55%] before:w-[70px] before:h-[2px] before:bg-tertiary after:absolute after:top-1/2 after:left-[-55%] after:w-[70px] after:h-[2px] after:bg-tertiary">
          Continue with
        </p>
      </div>
      <div className="flex justify-center items-center gap-5">
        {socialLogin.map((provider) => (
          <SocialLogin
            key={provider.src}
            provider={provider}
            handleEvent={close}
          />
        ))}
      </div>
    </article>
  );
}
