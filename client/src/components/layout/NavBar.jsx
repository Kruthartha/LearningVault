import { useState, useEffect } from "react";
import Button from "../ui/Button";

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
          href="#home"
          className="text-xl font-semilight tracking-wide hover:text-gray-700 transition"
        >
          Learning
          <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
            Vault
          </span>
        </a>
        <div className="flex items-center space-x-8">
          <nav className="space-x-8 text-gray-600 hidden md:flex text-sm font-medium">
            <NavLink href="/" text="Home" />
            <NavLink href="/about" text="Developer Session" />
            <NavLink href="/contact" text="About" />
          </nav>
          <Button
            size="small"
            normalColor="bg-slate-800"
            hoverColor="bg-slate-900"
            href={"/login"}
          >
            Login
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
