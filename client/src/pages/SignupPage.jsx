import { useState } from "react";

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState("signup"); // "signup", "otp", or "success"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true
  });
  const [otpData, setOtpData] = useState({
    otp: "",
    resendTimer: 0,
    canResend: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[a-z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtpData(prev => ({ ...prev, otp: value }));
  };

  const startResendTimer = () => {
    setOtpData(prev => ({ ...prev, resendTimer: 60, canResend: false }));
    const timer = setInterval(() => {
      setOtpData(prev => {
        if (prev.resendTimer <= 1) {
          clearInterval(timer);
          return { ...prev, resendTimer: 0, canResend: true };
        }
        return { ...prev, resendTimer: prev.resendTimer - 1 };
      });
    }, 1000);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms of Service to continue.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match. Please try again.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://api.learningvault.in';
      
      const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          termsAccepted: formData.agreeToTerms,
          subscribeUpdates: formData.subscribeNewsletter
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Move to OTP step
        setCurrentStep("otp");
        startResendTimer();
      } else {
        alert(result.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otpData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    
    try {
      // Replace with your actual OTP verification endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpData.otp
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Move to success step
        setCurrentStep("success");
      } else {
        alert(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpData.canResend) return;
    
    setIsLoading(true);
    
    try {
      // Replace with your actual resend OTP endpoint
      const response = await fetch(`${API_BASE_URL}/api/users/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      if (response.ok) {
        startResendTimer();
        alert("OTP resent successfully!");
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Weak";
    if (passwordStrength <= 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 via-white to-white"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse opacity-30 delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/6 w-1 h-1 bg-green-500 rounded-full animate-pulse opacity-50 delay-500"></div>
      <div className="absolute top-2/3 right-1/6 w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse opacity-40 delay-700"></div>

      {/* Gradient blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16">
          <div className="max-w-md">
            {/* Logo */}
            <div className="mb-12">
              <h1 className="text-4xl font-extralight text-black tracking-tighter">
                Learning
                <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                  Vault
                </span>
              </h1>
            </div>

            {/* Dynamic Welcome Message */}
            {currentStep === "signup" ? (
              <>
                <h2 className="text-3xl font-light text-black mb-6 leading-tight">
                  Start your journey to
                  <br />
                  <span className="text-gray-600">career success</span>
                </h2>
                <p className="text-lg text-gray-500 font-light mb-12 leading-relaxed">
                  Join thousands of learners who transformed their careers through practical, project-based education. Your future starts here.
                </p>
              </>
            ) : currentStep === "otp" ? (
              <>
                <h2 className="text-3xl font-light text-black mb-6 leading-tight">
                  Almost there!
                  <br />
                  <span className="text-gray-600">Verify your email</span>
                </h2>
                <p className="text-lg text-gray-500 font-light mb-12 leading-relaxed">
                  We've sent a 6-digit code to {formData.email}. Enter it below to activate your account and start learning.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-light text-black mb-6 leading-tight">
                  Account Activated!
                  <br />
                  <span className="text-gray-600">Welcome to LearningVault</span>
                </h2>
                <p className="text-lg text-gray-500 font-light mb-12 leading-relaxed">
                  Your account has been successfully verified. You're now ready to begin your learning journey with us!
                </p>
              </>
            )}

            {/* Benefits */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Project-Based Learning</h4>
                  <p className="text-sm text-gray-600">Build real applications that employers actually value</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Expert Mentorship</h4>
                  <p className="text-sm text-gray-600">Learn from industry professionals who've been there</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mt-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 className="font-medium text-black mb-1">Career Guarantee</h4>
                  <p className="text-sm text-gray-600">We're so confident, we guarantee your success</p>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-blue-300 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-blue-700 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-sm font-medium text-black">10,000+ students</span>
              </div>
              <p className="text-sm text-gray-600">have launched successful careers with us</p>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-1">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <h1 className="text-3xl font-extralight text-black tracking-tighter">
                Learning
                <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                  Vault
                </span>
              </h1>
            </div>

            {/* Form Container */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-100">
              
              {/* Progress Indicator */}
              <div className="flex items-center mb-8">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "signup" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {currentStep === "signup" ? "1" : "✓"}
                </div>
                <div className={`flex-1 h-1 mx-3 ${
                  currentStep === "otp" || currentStep === "success" ? "bg-green-500" : "bg-gray-200"
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "signup" ? "bg-gray-200 text-gray-400" : 
                  currentStep === "otp" ? "bg-blue-500 text-white" : "bg-green-500 text-white"
                }`}>
                  {currentStep === "success" ? "✓" : "2"}
                </div>
                <div className={`flex-1 h-1 mx-3 ${
                  currentStep === "success" ? "bg-green-500" : "bg-gray-200"
                }`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === "success" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {currentStep === "success" ? "✓" : "3"}
                </div>
              </div>

              {currentStep === "signup" ? (
                /* Sign Up Form */
                <>
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-light text-black mb-2">Create your account</h3>
                    <p className="text-gray-500 text-sm">Start learning and building your future today</p>
                  </div>

                  <form onSubmit={handleSignUpSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First name
                        </label>
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last name
                        </label>
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
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
                          placeholder="Create a strong password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div 
                                className={`h-1 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-500' : passwordStrength <= 3 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm pr-12"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                      </div>
                      
                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="mt-2 text-xs">
                          {formData.password === formData.confirmPassword ? (
                            <span className="text-green-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Passwords match
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Passwords don't match
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Terms and Newsletter */}
                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <span className="ml-3 text-sm text-gray-600 leading-relaxed">
                          I agree to the{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</a>
                          {" "}and{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</a>
                        </span>
                      </label>
                      
                      <label className="flex items-start">
                        <input
                          name="subscribeNewsletter"
                          type="checkbox"
                          checked={formData.subscribeNewsletter}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                        />
                        <span className="ml-3 text-sm text-gray-600 leading-relaxed">
                          Send me learning tips, career insights, and product updates
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        "Create account"
                      )}
                    </button>
                  </form>
                </>
              ) : currentStep === "otp" ? (
                /* OTP Verification Form */
                <>
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-light text-black mb-2">Verify your email</h3>
                    <p className="text-gray-500 text-sm">Enter the 6-digit code sent to</p>
                    <p className="text-gray-700 text-sm font-medium">{formData.email}</p>
                  </div>

                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    {/* OTP Input */}
                    <div>
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                        Verification Code
                      </label>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        value={otpData.otp}
                        onChange={handleOtpChange}
                        className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-center text-2xl font-mono tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <div className="text-center mt-2">
                        <span className="text-xs text-gray-500">
                          {otpData.otp.length}/6 digits entered
                        </span>
                      </div>
                    </div>

                    {/* Resend OTP */}
                    <div className="text-center">
                      {otpData.resendTimer > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend code in {otpData.resendTimer} seconds
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium underline disabled:opacity-50"
                        >
                          Resend verification code
                        </button>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || otpData.otp.length !== 6}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        "Verify Account"
                      )}
                    </button>

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={() => setCurrentStep("signup")}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
                    >
                      Back to Sign Up
                    </button>
                  </form>
                </>
              ) : (
                /* Success Screen */
                <>
                  {/* Success Header */}
                  <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-light text-black mb-2">Account Activated!</h3>
                    <p className="text-gray-500 text-sm">Welcome to LearningVault</p>
                  </div>

                  {/* Success Content */}
                  <div className="space-y-6">
                    {/* Success Message */}
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Congratulations! Your account has been successfully verified and activated.
                      </p>
                      <p className="text-gray-600 mb-6">
                        You're now ready to start your learning journey with us.
                      </p>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                      <h4 className="font-medium text-blue-900 mb-3 text-center">What's Next?</h4>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Complete your profile setup
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Browse our course catalog
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Start your first learning path
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => {
                          // Redirect to dashboard
                          window.location.href = '/dashboard';
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02]"
                      >
                        Go to Dashboard
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Redirect to courses
                          window.location.href = '/courses';
                        }}
                        className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
                      >
                        Browse Courses
                      </button>
                    </div>

                    {/* User Info Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <div className="text-center text-sm text-gray-600">
                        <p className="mb-1">Account created for:</p>
                        <p className="font-medium text-gray-800">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-gray-500">{formData.email}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </a>
                </p>
              </div>
            </div>

            {/* Additional Security Info */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  SSL Encrypted
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Privacy Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;