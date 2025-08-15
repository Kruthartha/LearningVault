import { useState, useEffect } from "react";
import Button from "../ui/Button";

const NavLink = ({ href, text }) => (
  <a href={href} className="hover:text-gray-900 transition-colors duration-200">
    {text}
  </a>
);

const NavBar = ({ name = "Knowledge Vault" }) => {
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
          className="text-xl font-semibold tracking-wide hover:text-gray-700 transition"
        >
          {name}
        </a>
        <nav className="space-x-8 text-gray-600 hidden md:flex text-sm font-medium">
          <NavLink href="/" text="Home" />
          <NavLink href="/about" text="Developer Session" />
          <NavLink href="/contact" text="About" />
        </nav>
        {/* <Button size="small" >Login</Button> */}
      </div>
    </header>
  );
};

export default NavBar;
