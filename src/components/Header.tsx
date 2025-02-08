import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import DeskTopHeader from "./DeskTopHeader";
import MobileHeader from "./MobileHeader";
import { syncUser } from "@/actions/user.action";

async function Header() {
  const user = await currentUser();
  if (user) await syncUser(); //? POST request

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div>
            <Link href={"/"} className="flex items-center gap-2">
              <Image
                src={"/logo-image.png"}
                width={60}
                height={60}
                alt={"logo"}
              />
              <span className="hidden md:inline-block mt-4 text-xl text-primary font-mono font-bold tracking-wider">
                Socially
              </span>
            </Link>
          </div>
          <DeskTopHeader />
          <MobileHeader />
        </div>
      </div>
    </nav>
  );
}

export default Header;
