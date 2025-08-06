/* eslint-disable @typescript-eslint/no-unused-vars */
import { History, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import GreetingTime from "../AllertHallo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";
interface NavbarProps {
  setShowEdit: (show: boolean) => void;
}

export default function Navbar({ setShowEdit }: NavbarProps) {
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
        <ul className="flex space-x-4 text-xs font-medium items-center justify-center">
          <li>
            <button
              onClick={() => router.push("/history")}
              className="text-[white] text-sm hover:text-[white]/30 flex items-center"
            >
              <History className="inline mr-1 w-4 h-4" />
              Histori
            </button>
          </li>
          {session?.user?.role === "admin" && (
            <li>
              <button
                onClick={() => router.push("/admin")}
                className="text-[white] text-sm hover:text-[white]/30 flex items-center"
              >
                <LayoutDashboard className="inline mr-1 w-4 h-4" />
                Dashboard
              </button>
            </li>
          )}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full  text-white flex items-center justify-center font-bold text-lg shadow hover:bg-[#116651] transition">
                  {session?.user?.name?.[0]?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2">
                <DropdownMenuItem
                  onClick={() => setShowEdit(true)}
                  className="cursor-pointer"
                >
                  <UserCircle className="inline mr-2 w-4 h-4" />
                  Edit Profil
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 font-semibold"
                >
                  <LogOut className="inline mr-2 w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Modal Edit Profile */}
          </li>
        </ul>
      </div>
    </nav>
  );
}
