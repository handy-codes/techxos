"use client&quot;;

import { UserButton, useAuth } from &quot;@clerk/nextjs&quot;;
import { Menu, Search } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;
import { useState, useRef, useEffect } from &quot;react&quot;;
import { usePathname, useRouter } from &quot;next/navigation&quot;;
import {
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaChevronDown,
} from &quot;react-icons/fa&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Sheet, SheetContent, SheetTrigger } from &quot;@/components/ui/sheet&quot;;
import Image from &quot;next/image&quot;;

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
  const [searchInput, setSearchInput] = useState(&quot;");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const courses: Course[] = [
    { title: &quot;Frontend Development&quot;, link: &quot;/pages/frontend&quot; },
    { title: &quot;Fullstack Development&quot;, link: &quot;/pages/fullstack&quot; },
    { title: &quot;Data Science & Analytics&quot;, link: &quot;/pages/data-science&quot; },
    { title: &quot;Artificial Intelligence&quot;, link: &quot;/pages/ai-ml&quot; },
    { title: &quot;Software Development&quot;, link: &quot;/pages/software-devt&quot; },
    { title: &quot;Digital Marketing&quot;, link: &quot;/pages/digital-marketing&quot; },
    { title: &quot;UI/UX Design&quot;, link: &quot;/pages/ui-ux&quot; },
    { title: &quot;Cybersecurity&quot;, link: &quot;/pages/cybersecurity&quot; },
    { title: &quot;Project Management&quot;, link: &quot;/pages/project-mgt&quot; },
    { title: &quot;Graphic Design&quot;, link: &quot;/pages/graphic-design&quot; },
    { title: &quot;Mathematics (JSS 1-3)&quot;, link: &quot;/pages/mathematics-jss&quot; },
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
    { label: &quot;HOME&quot;, path: &quot;/&quot; },
    { label: &quot;ABOUT&quot;, path: &quot;/about&quot; },
    { label: &quot;OUR COURSES&quot;, path: &quot;&quot; },
    { label: &quot;CAREERS&quot;, path: &quot;/pages/careers&quot; },
    // { label: &quot;INSTRUCTOR&quot;, path: &quot;/instructor/create-course&quot; },
    // { label: &quot;MY LEARNING&quot;, path: &quot;/learning&quot; },
  ];

  const sidebarRoutes: Route[] = [
    { label: &quot;Courses&quot;, path: &quot;/instructor/create-course&quot; },
    { label: &quot;Performance&quot;, path: &quot;/instructor/performance&quot; },
  ];

  const handleSearch = () => {
    const query = searchInput.trim();
    if (query) {
      router.push(`/search?query=${encodeURIComponent(query)}`);
      setSearchInput(&quot;&quot;);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50&quot;>
      <header className=&quot;w-full&quot;>
        {/* Upper Contact Bar */}
        <div className=&quot;h-[40px] bg-[black] text-white items-center justify-between py-7 px-6 hidden xl:flex&quot;>
          <div className=&quot;flex items-center space-x-2&quot;>
            <FaMapMarkerAlt className=&quot;text-[orange]&quot; />
            <span>
              101, Lagos Ikorodu Road, (Wandytech Suites) by Jumofak Aruna Bus
              Stop, Ikorodu Lagos
            </span>
          </div>
          <div className=&quot;flex items-center space-x-6&quot;>
            <div className=&quot;flex items-center space-x-2&quot;>
              <FaPhone className=&quot;text-[orange]&quot; />
              <span>+2349123444391</span>
            </div>
            <Link
              href=&quot;mailto:hello@techxos.com&quot;
              className=&quot;flex items-center py-[6px] px-3 bg-[#638995] rounded-md space-x-2&quot;
            >
              <FaPaperPlane className=&quot;text-[#C5CFD2]&quot; />
              <p className=&quot;text-dark-blue py-1 rounded&quot;>Contact Us</p>
            </Link>
            <Link
              href=&quot;mailto:hello@wandytex.com&quot;
              className=&quot;flex items-center space-x-2&quot;
            >
              <FaPaperPlane className=&quot;text-[orange]&quot; />
              <p className=&quot;text-dark-blue py-1 rounded&quot;>hello@techxos.com</p>
            </Link>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <nav className=&quot;flex w-full mx-auto justify-between bg-white h-[80px] items-center p-4 border-b-2 border-[#E79D09]&quot;>
          {/* Logo */}
          <Link className=&quot;flex items-center gap-3&quot; href=&quot;/">
            <Image
              src=&quot;/logo-techxos-navy.svg&quot;
              // src=&quot;/logo-techxos-white-nav.svg&quot;
              width={40}
              height={40}
              alt=&quot;Techxos Logo&quot;
              priority
            />
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#003E8F]&quot;>
              Techxos
            </h1>
          </Link>

          {/* Search Bar */}
          <div className=&quot;hidden xl:flex border-2 border-[#E79D09] rounded-full overflow-hidden&quot;>
            <input
              className=&quot;bg-gray-100 text-gray-800 outline-none text-sm pl-4 py-3 w-[300px]&quot;
              placeholder=&quot;Search for courses&quot;
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === &quot;Enter&quot; && handleSearch()}
              aria-label=&quot;Search courses&quot;
            />
            <button
              className=&quot;bg-[#E79D09] px-6 hover:bg-[#FDAB04]/80 transition-colors&quot;
              onClick={handleSearch}
              aria-label=&quot;Search&quot;
              disabled={!searchInput.trim()}
            >
              <Search className=&quot;h-4 w-4 text-white&quot; />
            </button>
          </div>

          {/* Navigation Links and Auth */}
          <div className=&quot;flex items-center font-semibold gap-4&quot;>
            {/* Desktop Links */}
            <div className=&quot;hidden lg:flex md:text-[13px] gap-2&quot;>
              {topRoutes.map((route: Route) =>
                route.label === &quot;OUR COURSES&quot; ? (
                  <div
                    key={route.path}
                    className=&quot;relative flex md:text-[13px] items-center space-x-1 cursor-pointer group&quot;
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    ref={dropdownRef}
                  >
                    <span
                      className={`text-sm md:text-[13px] rounded-[3px] transition-all py-2 px-3 ${
                        pathName === route.path
                          ? &quot;bg-[#003E8F] text-white&quot;
                          : &quot;hover:bg-[#003E8F] hover:text-white&quot;
                      }`}
                    >
                      {route.label}
                    </span>
                    <FaChevronDown className=&quot;text-[#dba231] text-sm transition-transform group-hover:rotate-180&quot; />

                    {/* Dropdown Content */}
                    <div
                      className={`absolute top-full -left-[40vw] w-[75vw] max-w-4xl bg-white font-semibold text-[#003B65] shadow-lg flex flex-row pt-4 transition-all duration-300 ${
                        isDropdownOpen
                          ? &quot;opacity-100 translate-y-0 visible&quot;
                          : &quot;opacity-0 -translate-y-2 invisible&quot;
                      }`}
                      style={{ height: &quot;calc(100vh - 80px)&quot; }}
                      onMouseEnter={() => clearTimeout(timeoutRef.current!)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className=&quot;w-[42vw] h-full relative&quot;>
                        <Image
                          src=&quot;https://images.pexels.com/photos/7971355/pexels-photo-7971355.jpeg&quot;
                          layout=&quot;fill&quot;
                          className=&quot;object-cover pt-1&quot;
                          alt=&quot;Course Preview&quot;
                          priority
                        />
                      </div>
                      {/* <div className=&quot;w-[33vw] bg-[#343B43] text-[#46D5FB] mt-1 grid grid-cols-2 gap-3 p-6 overflow-y-auto&quot;> */}
                      {/* <div className=&quot;w-[40vw] bg-gray-100 text-[#4F25CF] mt-1 grid grid-cols-2 font-semibold gap-3 p-6 overflow-y-auto&quot;> */}
                      <div className=&quot;w-[40vw] bg-[#FEE2E2] text-[black] mt-1 grid grid-cols-2 font-bold gap-3 p-6 overflow-y-auto&quot;>
                        {/* <div className=&quot;w-[33vw] bg-[#5025D1] text-[white] mt-1 grid grid-cols-2 gap-3 p-6 overflow-y-auto&quot;> */}
                        {courses.map((course: Course, index: number) => (
                          <Link
                            key={index}
                            href={course.link}
                            className=&quot;hover:text-[#df5a5a] text-sm md:text-[15px] transition-colors&quot;
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
                        ? &quot;bg-[#003E8F] text-white&quot;
                        : &quot;hover:bg-[#003E8F] hover:text-white&quot;
                    }`}
                  >
                    {route.label}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu */}
            <div className=&quot;lg:hidden z-[100]&quot;>
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger aria-label=&quot;Open navigation menu&quot;>
                  <Menu className=&quot;w-8 h-8 mt-2 text-[#003E8F]&quot; />
                </SheetTrigger>
                <SheetContent
                  className=&quot;flex flex-col gap-4 items-center bg-[#012B66] mt-[80px] text-white text-xl 
                  border-l-0 z-[1000] pt-16 [&>button]:size-10 [&>button]:right-2 [&>button]:bottom-6 
                  [&>button]:text-3xl [&>button>svg]:stroke-[10px]
                  transition-all duration-300 ease-in-out
                  data-[state=open]:animate-in data-[state=closed]:animate-out
                  data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
                  data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full
                  data-[state=closed]:duration-300 data-[state=open]:duration-500&quot;
                >
                  <div className=&quot;flex flex-col overflow-scroll mt-4 gap-3&quot;>
                    {topRoutes.map((route: Route) =>
                      route.label === &quot;OUR COURSES&quot; ? (
                        <div key={route.path} className=&quot;flex flex-col gap-1&quot;>
                          <button
                            onClick={() =>
                              setIsMobileCoursesOpen(!isMobileCoursesOpen)
                            }
                            className=&quot;flex items-center justify-between p-3 rounded-lg font-bold hover:bg-[#1B9BFF]/80&quot;
                          >
                            <span>{route.label}</span>
                            <FaChevronDown
                              className={`transition-transform ml-2 ${
                                isMobileCoursesOpen ? &quot;rotate-180&quot; : &quot;"
                              }`}
                            />
                          </button>
                          {isMobileCoursesOpen && (
                            <div className="pl-4 flex flex-col gap-2&quot;>
                              {courses.map((course: Course, index: number) => (
                                <Link
                                  key={index}
                                  href={course.link}
                                  onClick={() => {
                                    setIsSheetOpen(false);
                                    setIsMobileCoursesOpen(false);
                                  }}
                                  className=&quot;p-2 rounded-lg hover:bg-[#1B9BFF]/80&quot;
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
                              ? &quot;bg-[#1B9BFF] text-white&quot;
                              : &quot;hover:bg-[#1B9BFF]/80&quot;
                          }`}
                        >
                          {route.label}
                        </Link>
                      )
                    )}
                  </div>
                  {pathName.startsWith(&quot;/instructor&quot;) && (
                    <div className=&quot;flex flex-col gap-4&quot;>
                      {sidebarRoutes.map((route: Route) => (
                        <Link
                          href={route.path}
                          key={route.path}
                          onClick={() => setIsSheetOpen(false)}
                          className={`p-3 rounded-lg font-bold ${
                            pathName === route.path
                              ? &quot;bg-[#FBB11C] text-black&quot;
                              : &quot;hover:bg-[#FBB11C]/80&quot;
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
              <UserButton afterSignOutUrl=&quot;/" />
            ) : (
              <Link href="/sign-in&quot;>
                <Button
                  variant=&quot;outline&quot;
                  className=&quot;text-[white] p-4 bg-orange-500"
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
