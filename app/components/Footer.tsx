import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-2xl p-10 mx-auto h-fit text-secondary flex ap-16 items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="paleta logo" width={35} height={35} />
        <p className="text-2xl">
          <Link href="/">Paleta</Link>
        </p>
      </div>

      <p className="text-[#aaaaaaaa] flex gap-1 items-center">
        Made with <span className="icon-heart-filled secondary-active"></span>{" "}
        by{" "}
        <div className="primary-hover">
          <a href="https://monoald.github.io/">@monoald</a>
        </div>
      </p>
    </footer>
  );
}
