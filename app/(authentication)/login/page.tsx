"use client";
import Link from "next/link";
import SocialLogin from "../components/SocialLogin";
import { FormEvent } from "react";

type Form = { email: { value: string }; password: { value: string } };

const socialLogin = [
  {
    src: "/google.svg",
    url: "http://localhost:3000/api/v1/auth/google/callback",
  },
  {
    src: "/facebook.svg",
    url: "http://localhost:3000/api/v1/auth/facebook/callback",
  },
  {
    src: "/github.svg",
    url: "http://localhost:3000/api/v1/auth/github/callback",
  },
];

export default function Page() {
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = event.target as EventTarget & Form;
    const body = JSON.stringify({
      email: formData.email.value,
      password: formData.password.value,
    });

    const response = await fetch("http://localhost:3000/api/v1/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    }).then((res) => res.json());
  }

  return (
    <main className="w-full h-screen flex items-center justify-center text-secondary text-sm bg-main">
      <div className="relative w-full max-w-sm h-fit z-0 overflow-hidden">
        <section className="w-full min-h-[85dvh] h-fit p-14 border border-primary-border rounded-3xl flex flex-col justify-center gap-8 backdrop-blur-3xl">
          <form onSubmit={onSubmit} className="flex flex-col gap-7">
            <h1 className="text-5xl font-semibold text-center">Paleta</h1>
            <p className="text-lg font-medium text-center">Welcome Back!</p>
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <input
                className="w-full h-8 px-4 border border-primary-border rounded-lg bg-transparent text-secondary focus-visible:outline-none focus-visible:shadow-active-secondary"
                type="email"
                name="email"
                id="email"
                placeholder="example@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password">Password</label>
              <input
                className="w-full h-8 px-4 border border-primary-border rounded-lg bg-transparent text-secondary focus-visible:outline-none focus-visible:shadow-active-secondary"
                type="password"
                name="password"
                id="password"
                placeholder="*********"
              />
            </div>

            <button type="submit" className="primary-button mx-auto">
              <div>
                <span className="font-semibold">Login</span>
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
          </form>

          <div className="flex flex-col gap-6">
            <div className="w-full flex items-center justify-center">
              <p className="relative px-3 text-tertiary text-shadow-active before:absolute before:top-1/2 before:right-[-55%] before:w-[70px] before:h-[2px] before:bg-tertiary after:absolute after:top-1/2 after:left-[-55%] after:w-[70px] after:h-[2px] after:bg-tertiary">
                Or Continue with
              </p>
            </div>

            <div className="flex justify-center gap-5">
              {socialLogin.map((element) => (
                <SocialLogin
                  key={element.src}
                  src={element.src}
                  url={element.url}
                />
              ))}
            </div>
          </div>

          <p className="text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-tertiary hover:text-shadow-active relative pb-1 after:absolute"
            >
              Sign up
            </Link>
          </p>
        </section>
        <div className="absolute block top-[10%] left-[15%] w-20 h-12 bg-[#35ebff] rounded-full -z-[1] animate-back-1"></div>
        <div className="absolute block top-[30%] right-[15%] w-12 h-20 bg-[#37ff91] rounded-full -z-[1] animate-back-2"></div>
        <div className="absolute block bottom-[30%] right-[40%] w-10 h-20 bg-[#8e37ff] rounded-full -z-[1] animate-back-3"></div>
        <div className="absolute block bottom-[10%] left-[50%] w-24 h-10 bg-[#3375f1] rounded-full -z-[1] animate-back-4"></div>
      </div>
    </main>
  );
}
