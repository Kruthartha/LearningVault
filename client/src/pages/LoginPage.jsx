import { useState } from "react";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // Add your login API call here
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding section */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white items-center justify-center flex-col p-12">
        <h1 className="text-4xl font-bold mb-4">Welcome Back to Knowledge Vault</h1>
        <p className="text-lg opacity-80 text-center max-w-md">
          Learn. Build. Prove your skills. Launch your career with real-world experience.
        </p>
      </div>

      {/* Right form section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Login</h2>
          <p className="text-slate-500">Welcome back! Please login to continue.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2 focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-between text-sm">
              <a href="/forgot-password" className="text-slate-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              size="medium"
              normalColor="bg-slate-800"
              hoverColor="bg-slate-900"
              type="submit"
              className="w-full"
            >
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don’t have an account?{" "}
            <Button
              href="/signup"
              size="small"
              normalColor="bg-transparent"
              hoverColor="bg-slate-100"
              textColor="text-slate-800"
              className="underline"
            >
              Sign Up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}