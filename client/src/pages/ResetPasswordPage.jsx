import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordPage = () => {
  // useSearchParams is the standard way to read URL query parameters
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // On component load, get the token from the URL
  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      // If no token is found, show an error
      setError("No reset token found. Please request a new reset link.");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setMessage(data.message + " Redirecting to login...");

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Elements (copied for consistency) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-white"></div>
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse opacity-30 delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-green-500 rounded-full animate-pulse opacity-50 delay-500"></div>
      <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse opacity-40 delay-700"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extralight text-black tracking-tighter">
              Learning
              <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                Vault
              </span>
            </h1>
          </div>

          {/* Form Container */}
          <form
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 "
            onSubmit={handleSubmit}
          >
            {/* Form Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-light text-black mb-2">
                Set a New Password
              </h3>
              <p className="text-gray-500 text-sm">
                Your new password must be different from previous ones.
              </p>
            </div>
            
            {/* Message/Error Area */}
            {message && <div className="text-center bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-lg mb-6">{message}</div>}
            {error && <div className="text-center bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg mb-6">{error}</div>}

            <div className="space-y-6">
              {/* New Password Field */}
              <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {/* SVG Icon for showing/hiding password (copied from LoginPage) */}
                       {showPassword ? ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /> </svg> ) : ( <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /> </svg> )}
                    </button>
                  </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Confirm your new password"
                  />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !!message || !token}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>

            {/* Back to Login Link */}
            {message && (
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Proceed to Login
                        </Link>
                    </p>
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;