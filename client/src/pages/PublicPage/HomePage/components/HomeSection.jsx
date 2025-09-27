import { useState, useEffect } from "react";
import Footer from "../../Layouts/Footer";

const HomeSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-20 bg-white overflow-hidden">
      {/* Hero Section with Parallax */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-white"></div>

        {/* Floating elements */}
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          {/* Badge */}

          {/* Main Headline */}

          {/* Subtle Animated Gradient Background */}
          <div className="absolute top-0 left-0 -z-10 h-full w-full bg-white"></div>

          <div className="container mx-auto px-4 z-10">
            {/* Pre-headline Pill */}
            <div className="inline-flex items-center px-4 py-1.5 bg-black/5 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 border border-gray-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              The Learning Platform of Tomorrow
            </div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-8xl font-extralight text-black mb-6 tracking-tighter leading-none">
              Master the Craft.<br></br>
              <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                Think, Don’t Memorize.
              </span>
            </h1>

            {/* Subtitle */}

            <p className="text-xl md:text-2xl text-gray-500 font-light mb-12 max-w-3xl mx-auto leading-relaxed">
              A research-backed learning platform designed for true mastery.
              Move beyond simply knowing
              <span className="text-black font-medium"> what, </span> to deeply
              understanding
              <span className="text-black font-medium"> why</span>, and bring
              your ideas to life.
            </p>

            {/* Revised Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <a
                href="#paths"
                className="px-6 py-3 border bg-slate-900 text-white font-semibold rounded-2xl shadow-lg hover:bg-slate-900 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
              >
                Experience the Future
              </a>
            </div>

            {/* Visual Element: "Learning Path" Cards */}
          </div>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full mx-auto">
              <div className="w-1 h-3 bg-gray-400 rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="py-24 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-medium text-gray-400 mb-12 tracking-wide uppercase">
            Trusted by students from
          </p>
          <div className="flex justify-center items-center space-x-16 opacity-30">
            <div className="text-3xl font-light text-gray-600">Google</div>
            <div className="text-3xl font-light text-gray-600">Apple</div>
            <div className="text-3xl font-light text-gray-600">Microsoft</div>
            <div className="text-3xl font-light text-gray-600">Meta</div>
            <div className="text-3xl font-light text-gray-600">Netflix</div>
          </div>
        </div>
      </div>

      {/* Product Showcase */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extralight text-black mb-8 tracking-tight">
              Three phases.
              <br />
              <span className="font-light text-gray-600">One guarantee.</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Our proven system transforms beginners into industry-ready
              professionals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {[
              {
                phase: "01",
                title: "Skills Foundation",
                description:
                  "Master fundamentals through interactive modules designed by industry experts. Learn DSA, web development, and essential soft skills.",
                features: [
                  "Interactive coding challenges",
                  "Peer-to-peer learning",
                  "Real-time feedback",
                ],
              },
              {
                phase: "02",
                title: "Proof of Skills",
                description:
                  "Build verified portfolios with real projects that demonstrate your capabilities to potential employers.",
                features: [
                  "Blockchain-verified certificates",
                  "Portfolio automation",
                  "Mock interviews",
                ],
              },
              {
                phase: "03",
                title: "Launch Your Next Chapter",
                description:
                  "Use your new skills to start a career, build a startup, freelance, or simply bring your ideas to life — the choice is yours.",
                features: [
                  "Mentorship from industry experts",
                  "Startup & freelancing guidance",
                  "Paths to jobs, clients, or projects",
                ],
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group hover:transform hover:scale-[1.02] transition-all duration-500"
              >
                <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 h-full">
                  <div className="text-6xl font-ultralight text-gray-200 mb-6">
                    {item.phase}
                  </div>
                  <h3 className="text-2xl font-light text-black mb-6 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {item.description}
                  </p>
                  <ul className="space-y-3">
                    {item.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-500"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-40 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-8">The numbers speak.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            <div className="group">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 group-hover:text-blue-400 transition-colors">
                1500+
              </div>
              <div className="text-gray-400 font-light">Community Members</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 group-hover:text-purple-400 transition-colors">
                500+
              </div>
              <div className="text-gray-400 font-light">Partner companies</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 group-hover:text-green-400 transition-colors">
                10k+
              </div>
              <div className="text-gray-400 font-light">Success stories</div>
            </div>
            <div className="group">
              <div className="text-6xl md:text-7xl font-ultralight mb-4 group-hover:text-yellow-400 transition-colors">
                4.9
              </div>
              <div className="text-gray-400 font-light">Student rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-extralight text-black mb-12 leading-tight tracking-tight">
              Education should be
              <br />
              <span className="font-light text-gray-600">
                practical, not theoretical.
              </span>
            </h2>

            <p className="text-2xl font-light text-gray-500 leading-relaxed max-w-4xl mx-auto">
              We believe learning happens when you build. Every lesson, project,
              and milestone is designed around real skills that employers
              actually value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Project-First Approach",
                description:
                  "Every lesson ends with something you can use — from simple apps to full-scale platforms.",
                icon: "",
              },
              {
                title: "Real Projects",
                description:
                  "Build actual applications that solve real problems. No more toy projects or theoretical assignments.",
                icon: "",
              },
              {
                title: "Expert Mentorship",
                description:
                  "Learn from industry professionals who've walked the path you want to take.",
                icon: "",
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-xl font-medium text-black mb-6">
                  {item.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final Call-to-Action */}
      <div className="relative py-32 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        {/* Decorative gradient blobs */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light text-black mb-8 leading-tight tracking-tight">
            Your future won’t{" "}
            <span className="font-semibold bg-gradient-to-r  from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent">
              build itself
            </span>
            .
          </h2>

          <p className="text-lg sm:text-2xl font-light text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed">
            Join thousands who turned their skills into careers with hands-on,
            project-based learning. It’s time to make your move.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => alert("Get started")}
              className="
    min-w-[200px]
    px-6 py-3 text-base
    bg-slate-800 text-white
    font-medium rounded-lg
    transition-all duration-200 ease-in-out
    transform active:scale-95
    hover:bg-slate-900
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  "
            >
              Get started
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-400 font-light">
            Free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default HomeSection;
