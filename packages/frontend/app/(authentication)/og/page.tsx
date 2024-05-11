import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({ subsets: ["latin"] });

export default function Page() {
  return (
    <div className="w-screen h-screen bg-main text-secondary p-24">
      <div className="relative w-full h-full z-0 overflow-hidden flex items-center justify-center">
        <section className="w-full h-full p-14 border border-primary-border rounded-3xl flex flex-col justify-center gap-8 backdrop-blur-3xl">
          <div className="flex items-center justify-center gap-3">
            <Image src="/logo.svg" alt="paleta logo" width={60} height={60} />
            <h1 className="text-7xl font-semibold text-center">Paleta</h1>
          </div>

          <div className="flex flex-col gap-6">
            <div className="w-full flex items-center justify-center">
              <p className="relative px-3 text-xl text-tertiary text-shadow-active before:absolute before:top-1/2 before:right-[-90%] before:w-[110px] before:h-[2px] before:bg-tertiary after:absolute after:top-1/2 after:left-[-90%] after:w-[110px] after:h-[2px] after:bg-tertiary before:shadow-active after:shadow-active">
                By monoald
              </p>
            </div>
          </div>

          <div className="w-full max-w-xl mx-auto">
            <p className="text-5xl font-light text-center">
              Find amazing palettes, gradients and more!
            </p>
          </div>
        </section>
        <div className="absolute block top-[10%] left-[15%] w-40 h-24 bg-[#35ebff] rounded-full -z-[1]"></div>
        <div className="absolute block top-[30%] right-[15%] w-24 h-40 bg-[#37ff91] rounded-full -z-[1]"></div>
        <div className="absolute block bottom-[30%] right-[40%] w-20 h-40 bg-[#8e37ff] rounded-full -z-[1]"></div>
        <div className="absolute block bottom-[10%] left-[28%] w-52 h-20 bg-[#3375f1] rounded-full -z-[1]"></div>
      </div>
    </div>
  );
}
