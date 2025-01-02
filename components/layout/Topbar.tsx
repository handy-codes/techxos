"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu, Home, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathName = usePathname();

  const topRoutes = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "INSTRUCTOR", path: "/instructor/courses" },
    { label: "MY LEARNING", path: "/learning" },
  ];

  const sidebarRoutes = [
    { label: "Courses", path: "/instructor/courses" },
    {
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search?query=${searchInput}`);
    }
    setSearchInput("");
  };

  return (
    // <div className="flex w-full mx-auto content-center justify-between sticky z-50 top-0 bg-[#003E8F] text-white font-bold text-2xl items-center p-4">
    <header className="sticky z-50 top-0 fixer">
    <div className="flex w-full mx-auto content-center justify-between  bg-[#003E8F] h-[80px] text-white font-bold text-2xl items-center p-4">
    {/* <div className="flex w-full mx-auto content-center justify-between  bg-blue-700 h-[80px] text-white font-bold text-2xl items-center p-4"> */}
      <Link className="flex items-center content-center gap-3" href="/">
        <Home color="#FDAB04" className="w-6 h- sm:w-8 sm:h-8" />
        {/* <Image src="/wandylogo.jpg" height={20} width={80} alt="logo" /> */}
        <h1 className="md:text-[32px]">Techxos</h1>
        {/* <Image src="/logo71t.png" height={40} width={150} className="rounded-md max-md:w-[130px]" alt="logo" /> */}
      </Link>

      <div className="max-lg:hidden max-lg::w-[100px] rounded-full flex">
        <input
          className="flex-grow rounded-l-full text-black border-none outline-none text-sm pl-4 py-3"
          // className="flex-grow bg-[#FFF8EB] rounded-l-full text-black border-none outline-none text-sm pl-4 py-3"
          placeholder="Search for courses"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          className="bg-[#E79D09] rounded-r-full border-none outline-none cursor-pointer px-4 py-3 hover:bg-[#FDAB04]/80"
          disabled={searchInput.trim() === ""}
          onClick={handleSearch}
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-6 sm:gap-1 items-center">
        <div className="max-sm:hidden flex gap-6 md:gap-2">
          {topRoutes.map((route) => (
            <Link
              href={route.path}
              key={route.path}
              className={`sm:text-[12px] md:text-[16px] rounded-[3px] transition-all py-[13px] px-[13px] md: ${
                pathName === route.path ? 'bg-[#1b9bff]' : 'hover:bg-[#1b9bff]'
              }`}            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="z-20 sm:hidden">
          <Sheet>
            <SheetTrigger>
              <Menu color="#FDB31D" className="w-8 h-8 sm:w-9 sm:h-9" />
            </SheetTrigger>
            <SheetContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                {topRoutes.map((route) => (
                  <Link
                    href={route.path}
                    key={route.path}
                    className="text-[22px] font-medium hover:text-[#E79D09]"
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
              
              {pathName.startsWith("/instructor") && (
                <div className="flex flex-col gap-4">
                  {sidebarRoutes.map((route) => (
                    <Link
                      href={route.path}
                      key={route.path}
                      className="text-lg font-medium hover:text-[#FDAB04]"
                    >
                      {route.label}
                    </Link>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
        {isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
          // <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
    </header>
  );
};

export default Topbar;
