import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`bg-[#fff]/5 transparent fixed rounded-4xl top-5 backdrop-blur-xl left-20 right-20 z-50 flex items-center justify-between text-white px-4 py-4 md:px-12 h-16 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-[150%]"
      }`}
    >
      <div
        style={{ fontFamily: "Audiowide" }}
        className="text-[#fff] font-bold text-lg cursor-pointer flex items-center"
        onClick={() => handleNavigate("/")}
      >
        <img
          src="/assets/images/logo-medium.png"
          className="h-14 w-14 mt-2"
          alt="rocket"
        />
        <span className="leading-none">CodeFleet</span>
      </div>

      <button
        className="md:hidden flex items-center text-gray-300"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      <ul
        className={`${
          isMenuOpen ? "block" : "hidden"
        } absolute top-16 left-0 w-full bg-gray-800 md:static md:flex md:items-center md:space-x-6 md:bg-transparent md:w-auto transition-all`}
      >
        <li
          className="bg-transparent font-bold text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
          onClick={() => handleNavigate("/teams")}
        >
          Teams
        </li>
        <li
          className="bg-transparent font-bold text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
          onClick={() => handleNavigate("/pricing")}
        >
          Pricing
        </li>
        <li
          className="bg-transparent font-bold text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
          onClick={() => handleNavigate("/guides")}
        >
          Guides
        </li>
        <li
          className="bg-transparent font-bold text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
          onClick={() => handleNavigate("/blogs")}
        >
          Blog
        </li>
        <li
          className="bg-transparent font-bold text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
          onClick={() => handleNavigate("/careers")}
        >
          Careers
        </li>
        <li className="flex flex-col md:flex-row items-center md:space-x-4 mt-4 md:mt-0 px-4 md:px-0">
          <button
            className="bg-transparent text-gray-300 px-4 py-2 font-bold rounded hover:bg-[#1c252c] transition duration-300 cursor-pointer"
            onClick={() => handleNavigate("/contact-sales")}
          >
            Contact Sales
          </button>
          <button
            className="bg-transparent text-gray-300 px-4 py-2 rounded hover:bg-[#1c252c] transition duration-300"
            onClick={() => handleNavigate("/login")}
          >
            Log In
          </button>
          <button
            className="bg-button-hover text-white px-4 py-2 rounded-3xl hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 transition duration-300"
            onClick={() => handleNavigate("/signup")}
          >
            Start Building
          </button>
        </li>
      </ul>
    </nav>
  );
}
