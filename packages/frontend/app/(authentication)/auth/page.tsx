"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const key = searchParams?.get("key");

    if (!window.opener) return router.push("/");

    if (window.opener && key) {
      window.opener.postMessage(key);
      window.close();
    } else {
      window.opener.postMessage("error");
      window.close();
    }
  }, [router, searchParams]);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <span className="mx-auto" id="loader"></span>
    </div>
  );
}
