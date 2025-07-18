/* eslint-disable @typescript-eslint/no-unused-vars */
import { History, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GreetingTime from "../AllertHallo";

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // atau "/login"
  };
  return (
    <nav
      style={{ animation: "fadeInDown 0.7s cubic-bezier(.4,0,.2,1)" }}
      className="backdrop-blur-md bg-[#004030] border border-white/30 shadow-[0px_0.9px_5px_0.1px_#2d3748] md:container mx-2 rounded-lg mt-2 md:mx-auto py-2 px-6"
    >
      <div className=" mx-auto flex justify-between items-center">
        <div className="text-[white] flex flex-col  ">
          <GreetingTime
            className="text-[white] text-xs "
            nameClassName="text-sm font-semibold"
            name={session?.user?.name || ""}
          />
        </div>
        <ul className="flex space-x-4 text-xs font-medium">
          <li>
            <button
              onClick={() => router.push("/history")}
              className="text-[white] hover:text-[white]/30 flex items-center"
            >
              <History className="inline mr-1 w-4 h-4" />
              Histori
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-[white] flex items-center hover:text-[white]/30"
            >
              <LogOut className="inline mr-1 w-4 h-4" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
