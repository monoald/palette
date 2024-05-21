import { useUserStore } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  handleToggleLogIn: () => void;
};

export default function UserArea({ handleToggleLogIn }: Props) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);
  const pathname = usePathname();

  useLayoutEffect(() => {
    updateUser(
      JSON.parse(localStorage.getItem("user") as string),
      JSON.parse(localStorage.getItem("token") as string)
    );
  }, [updateUser]);

  const handleLogOut = () => {
    updateUser(null, null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (pathname.includes("/me")) {
      router.push("/");
    }
  };

  return (
    <>
      {!user ? (
        <div className="hidden bp:flex gap-6">
          <button onClick={handleToggleLogIn} className="primary-button">
            <div>
              <span>Log in</span>
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
        </div>
      ) : (
        <div className="group/area w-fit h-fit flex">
          <button className="w-[42px] h-[42px] rounded-full overflow-hidden">
            <Image
              className="object-cover"
              src={user.avatar}
              alt=""
              width={42}
              height={42}
            />
          </button>
          <ul className="absolute right-7 top-full w-44 opacity-0  group-hover/area:opacity-100 group-active/area:opacity-100 group-focus-visible/area:opacity-100 flex flex-col gap-5 p-7 border border-secondary-border z-50 text-secondary rounded-2xl backdrop-blur-md bg-transparent-main transition-all duration-300 pointer-events-none group-hover/area:pointer-events-auto group-active/area:pointer-events-auto group-focus-visible/area:pointer-events-auto">
            <li className="primary-hover">
              <Link href="/me/palettes">My Palettes</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/colors">My Colors</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/gradients">My Gradients</Link>
            </li>
            <li className="primary-hover">
              <Link href="/me/font-icons">My Font Icons</Link>
            </li>
            <li className="primary-hover">
              <button onClick={handleLogOut}>Log out</button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
