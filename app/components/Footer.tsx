import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl py-10 mx-auto h-fit text-secondary flex flex-col gap-16 items-center justify-center">
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" alt="paleta logo" width={35} height={35} />
        <p className="text-2xl">
          <Link href="/">Paleta</Link>
        </p>
      </div>

      <nav className="flex gap-28">
        <div className="flex flex-col gap-4">
          <p className="text-base font-medium text-[#aaaaaa99]">Explore</p>

          <ul className="flex flex-col gap-2">
            <li className="primary-hover">
              <Link href="palette/explore">Color</Link>
            </li>
            <li className="primary-hover">
              <Link href="palette/explore">Palette</Link>
            </li>
            <li className="primary-hover">
              <Link href="gradient/explore">Gradient</Link>
            </li>
            <li>
              <Link href="font-icon/explore">Font Icon</Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-base font-medium text-[#aaaaaa99]">Craft</p>

          <ul className="flex flex-col gap-2">
            <li className="primary-hover">
              <Link href="palette/craft">Palette</Link>
            </li>
            <li className="primary-hover">
              <Link href="gradient/craft">Gradient</Link>
            </li>
            <li className="primary-hover">
              <Link href="font-icon/craft">Font Icon</Link>
            </li>
          </ul>
        </div>
      </nav>

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
