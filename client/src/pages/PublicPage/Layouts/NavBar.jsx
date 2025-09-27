import { useState, useEffect } from "react";

const NavLink = ({ href, text }) => (
  <a href={href} className="hover:text-gray-900 transition-colors duration-200">
    {text}
  </a>
);

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-shadow duration-300 ${
        scrolled
          ? "shadow-md bg-white/60 backdrop-blur-md"
          : "bg-white/40 backdrop-blur-md"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
        <a
          href="/"
          className="text-xl font-semilight tracking-wide hover:text-gray-700 transition"
        >
          Learning
          <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
            Vault
          </span>
        </a>
        <div className="flex items-center space-x-8">
          <nav className="space-x-8 text-gray-600 hidden md:flex text-sm font-medium">
            <NavLink href="/about" text="About" />
            {/* <NavLink href="/how-it-works" text="How it Works" />
            <NavLink href="/explore" text="Explore" />
            <NavLink href="/blog" text="Insights" /> */}
          </nav>
          <a
            href="/login"
            className="px-4 py-2 border text-sm bg-slate-800 text-white font-medium rounded-lg shadow-lg hover:bg-slate-900 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
