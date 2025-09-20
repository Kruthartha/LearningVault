import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordStudioPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (resetToken) {
      setToken(resetToken);
    } else {
      setError("No reset token found. Please request a new reset link.");
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters long.");

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // CHANGE 1: Point to the admin-specific reset-password endpoint
      const res = await fetch(`${API_URL}/auth/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");

      setMessage(data.message + " Redirecting to login...");

      // CHANGE 2: Redirect to the admin login page on success
      setTimeout(() => navigate("/admin/login"), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-white"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extralight text-black tracking-tighter">
              LearningVault
              <span className="font-medium text-slate-600"> Studio</span>
            </h1>
          </div>

          {/* Form Container */}
          <form
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100 "
            onSubmit={handleSubmit}
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-light text-black mb-2">
                Set New Admin Password
              </h3>
              <p className="text-gray-500 text-sm">
                Enter and confirm your new password below.
              </p>
            </div>
            
            {message && <div className="text-center bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded-lg mb-6">{message}</div>}
            {error && <div className="text-center bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg mb-6">{error}</div>}

            <div className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password" name="password" type={showPassword ? "text" : "password"} required
                    value={formData.password} onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12"
                    placeholder="Enter new password"
                  />
                  {/* ... Show/Hide Password Button ... */}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword" name="confirmPassword" type="password" required
                  value={formData.confirmPassword} onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Confirm your new password"
                />
              </div>

              <button
                type="submit" disabled={isLoading || !!message || !token}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
            
            {message && (
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        {/* CHANGE 3: Link back to the admin login page */}
                        <Link to="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
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

export default ResetPasswordStudioPage;