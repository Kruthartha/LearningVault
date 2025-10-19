
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

// A small array of quotes to inspire creators
const inspirationalQuotes = [
  {
    quote: "The art of teaching is the art of assisting discovery.",
    author: "Mark Van Doren",
  },
  {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
  },
  {
    quote: "Creativity is intelligence having fun.",
    author: "Albert Einstein",
  },
];

const StudioLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  
  // State for the daily inspirational quote
  const [quote, setQuote] = useState({ quote: "", author: "" });

  useEffect(() => {
    document.title = "Studio Login - LearningVault";
    // Select a random quote on component mount
    setQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/studio/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-white"></div>
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse opacity-30 delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-green-500 rounded-full animate-pulse opacity-50 delay-500"></div>
      <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse opacity-40 delay-700"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Inspiration */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16">
          <div className="max-w-md ml-20">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-3">
              <h1 className="text-5xl font-extralight text-black tracking-tighter">
                Learning
                <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                  Vault
                </span>
              </h1>
              <span className="text-gray-400 text-5xl font-thin">|</span>
              <span className="text-5xl text-gray-700 font-light">Studio</span>
            </div>

            {/* Welcome Message */}
            <h2 className="text-3xl font-light text-black mb-6 leading-tight">
              Let's create something
              <br />
              <span className="text-gray-600">brilliant today.</span>
            </h2>

            <p className="text-lg text-gray-500 font-light mb-12 leading-relaxed">
              Every lesson you craft has the power to spark curiosity and change lives. The future of learning starts with you.
            </p>


            {/* Inspirational Quote Section */}
            <div className="mt-16 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 italic">"{quote.quote}"</p>
              <p className="text-sm text-gray-600 mt-2 font-medium text-right">- {quote.author}</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
               <h1 className="text-3xl font-extralight text-black tracking-tighter">
                LearningVault
                <span className="text-gray-700 font-light"> Studio</span>
              </h1>
            </div>

            {/* Form Container */}
            <form
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 "
              onSubmit={handleSubmit}
            >
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-black mb-2">
                  Welcome Genius
                </h3>
                <p className="text-gray-500 text-sm">
                  Sign in to begin your session
                </p>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                  <input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm" placeholder="you@example.com"/>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12" placeholder="Enter your password"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input name="rememberMe" type="checkbox" checked={formData.rememberMe} onChange={handleInputChange} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading} className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Enter the Studio"
                  )}
                </button>
              </div>

              {/* Access Info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">Access is by invitation only.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioLoginPage;