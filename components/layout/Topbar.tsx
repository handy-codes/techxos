"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaChevronDown,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

interface Route {
  label: string;
  path: string;
}

interface Course {
  title: string;
  link: string;
}

const Topbar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const pathName = usePathname();
  const [searchInput, setSearchInput] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const courses: Course[] = [
    { title: "Frontend Development", link: "/pages/frontend" },
    { title: "Fullstack Development", link: "/pages/fullstack" },
    { title: "Data Science & Analytics", link: "/pages/data-science" },
    { title: "Artificial Intelligence", link: "/pages/ai-ml" },
    { title: "Software Development", link: "/pages/software-devt" },
    { title: "Digital Marketing", link: "/pages/digital-marketing" },
    { title: "UI/UX Design", link: "/pages/ui-ux" },
    { title: "Cybersecurity", link: "/pages/cybersecurity" },
    { title: "Project Management", link: "/pages/project-mgt" },
    { title: "Graphic Design", link: "/pages/graphic-design" },
    { title: "Mathematics (JSS 1-3)", link: "/pages/mathematics-jss" },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const topRoutes: Route[] = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/about" },
    { label: "OUR COURSES", path: "" },
    { label: "CAREERS", path: "/pages/careers" },
  ];

  const sidebarRoutes: Route[] = [
    { label: "Courses", path: "/instructor/create-course" },
    { label: "Performance", path: "/instructor/performance" },
  ];

  const handleSearch = () => {
    const query = searchInput.trim();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setSearchInput("");
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <header className="w-full">
        {/* Upper Contact Bar */}
        <div className="h-[40px] bg-[black] text-white items-center justify-between py-7 px-6 hidden xl:flex">
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-[orange]" />
            <span>
              101, Lagos-Ikorodu Road, (Wandytech Suites) by Jumofak Aruna Bus
              Stop, Ikorodu Lagos
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <FaPhone className="text-[orange]" />
              <span>+2349123444391</span>
            </div>
            <Link
              href="mailto:hello@techxos.com"
              className="flex items-center py-[6px] px-3 bg-[#638995] rounded-md space-x-2"
            >
              <FaPaperPlane className="text-[#C5CFD2]" />
              <p className="text-dark-blue py-1 rounded">Contact Us</p>
            </Link>
            <Link
              href="mailto:hello@wandytex.com"
              className="flex items-center space-x-2"
            >
              <FaPaperPlane className="text-[orange]" />
              <p className="text-dark-blue py-1 rounded">hello@techxos.com</p>
            </Link>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className="flex w-full mx-auto justify-between bg-white h-[80px] items-center p-4 border-b-2 border-[#E79D09]">
          {/* Logo */}
          <Link className="flex items-center gap-3" href="/">
            <Image
              src="/logo-techxos-navy.svg"
              width={40}
              height={40}
              alt="Techxos Logo"
              priority
            />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#003E8F]">
              Techxos
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="hidden xl:flex border-2 border-[#E79D09] rounded-full overflow-hidden">
            <input
              className="bg-gray-100 text-gray-800 outline-none text-sm pl-4 py-3 w-[300px]"
              placeholder="Search for courses"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              aria-label="Search courses"
            />
            <button
              className="bg-[#E79D09] px-6 hover:bg-[#FDAB04]/80 transition-colors"
              onClick={handleSearch}
              aria-label="Search"
              disabled={!searchInput.trim()}
            >
              <Search className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Navigation Links and Auth */}
          <div className="flex items-center font-semibold gap-4">
            {/* Desktop Links */}
            <div className="hidden lg:flex md:text-[13px] gap-2">
              {topRoutes.map((route: Route) =>
                route.label === "OUR COURSES" ? (
                  <div
                    key={route.path}
                    className="relative flex md:text-[13px] items-center space-x-1 cursor-pointer group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                  >
                    <span
                      className={`text-sm md:text-[13px] rounded-[3px] transition-all py-2 px-3 ${
                        pathName === route.path
                          ? "bg-[#003E8F] text-white"
                          : "hover:bg-[#003E8F] hover:text-white"
                      }`}
                    >
                      {route.label}
                    </span>
                    <FaChevronDown className="text-[#dba231] text-sm transition-transform group-hover:rotate-180" />

                    {/* Dropdown Content */}
                    <div
                      className={`absolute top-full -left-[40vw] w-[75vw] max-w-4xl bg-white font-semibold text-[#003B65] shadow-lg flex flex-row pt-4 transition-all duration-300 ${
                        isDropdownOpen
                          ? "opacity-100 translate-y-0 visible"
                          : "opacity-0 -translate-y-2 invisible"
                      }`}
                      style={{ height: "calc(100vh - 80px)" }}
                      onMouseEnter={() => clearTimeout(timeoutRef.current!)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="w-[42vw] h-full relative">
                        <Image
                          src="https://images.pexels.com/photos/7971355/pexels-photo-7971355.jpeg"
                          fill
                          className="object-cover pt-1"
                          alt="Course Preview"
                        />
                      </div>
                      <div className="w-[40vw] bg-[#FEE2E2] text-[black] mt-1 grid grid-cols-2 font-bold gap-3 p-6 overflow-y-auto">
                        {courses.map((course: Course, index: number) => (
                          <Link
                            key={index}
                            href={course.link}
                            className="hover:text-[#df5a5a] text-sm md:text-[15px] transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {course.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={route.path}
                    key={route.path}
                    className={`text-sm md:text-[13px] rounded-[3px] transition-all py-2 px-3 ${
                      pathName === route.path
                        ? "bg-[#003E8F] text-white"
                        : "hover:bg-[#003E8F] hover:text-white"
                    }`}
                  >
                    {route.label}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu */}
            <div className="lg:hidden z-[100]">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger aria-label="Open navigation menu">
                  <Menu className="w-8 h-8 mt-2 text-[#003E8F]" />
                </SheetTrigger>
                <SheetContent
                  className="flex flex-col gap-4 items-center bg-[#012B66] mt-[80px] text-white text-xl 
                  border-l-0 z-[1000] pt-16 [&>button]:size-10 [&>button]:right-2 [&>button]:bottom-6 
                  [&>button]:text-3xl [&>button>svg]:stroke-[10px]
                  transition-all duration-300 ease-in-out
                  data-[state=open]:animate-in data-[state=closed]:animate-out
                  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                  data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full
                  data-[state=closed]:duration-300 data-[state=open]:duration-500"
                >
                  <div className="flex flex-col overflow-scroll mt-4 gap-3">
                    {topRoutes.map((route: Route) =>
                      route.label === "OUR COURSES" ? (
                        <div key={route.path} className="flex flex-col gap-1">
                          <button
                            onClick={() =>
                              setIsMobileCoursesOpen(!isMobileCoursesOpen)
                            }
                            className="flex items-center justify-between p-3 rounded-lg font-bold hover:bg-[#1B9BFF]/80"
                          >
                            <span>{route.label}</span>
                            <FaChevronDown
                              className={`transition-transform ml-2 ${
                                isMobileCoursesOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isMobileCoursesOpen && (
                            <div className="pl-4 flex flex-col gap-2">
                              {courses.map((course: Course, index: number) => (
                                <Link
                                  key={index}
                                  href={course.link}
                                  onClick={() => {
                                    setIsSheetOpen(false);
                                    setIsMobileCoursesOpen(false);
                                  }}
                                  className="p-2 rounded-lg hover:bg-[#1B9BFF]/80"
                                >
                                  {course.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={route.path}
                          key={route.path}
                          onClick={() => setIsSheetOpen(false)}
                          className={`p-3 rounded-lg font-bold ${
                            pathName === route.path
                              ? "bg-[#1B9BFF] text-white"
                              : "hover:bg-[#1B9BFF]/80"
                          }`}
                        >
                          {route.label}
                        </Link>
                      )
                    )}
                  </div>
                  {pathName.startsWith("/instructor") && (
                    <div className="flex flex-col gap-4">
                      {sidebarRoutes.map((route: Route) => (
                        <Link
                          href={route.path}
                          key={route.path}
                          onClick={() => setIsSheetOpen(false)}
                          className={`p-3 rounded-lg font-bold ${
                            pathName === route.path
                              ? "bg-[#FBB11C] text-black"
                              : "hover:bg-[#FBB11C]/80"
                          }`}
                        >
                          {route.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>

            {/* User Authentication */}
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="text-[white] p-4 bg-orange-500"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Topbar;
