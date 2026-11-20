import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, Check } from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/common/LoadingSkeleton";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      notifyError("Enter your email and password.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await api.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      notifySuccess("Login successful.");
      const userRole = response.data.user.role;
      const cookieOptions = rememberMe ? { expires: 30 } : {};
      Cookies.set("token", response.data.token, cookieOptions);
      Cookies.set("refreshToken", response.data.refreshToken, cookieOptions);
      Cookies.set("user", JSON.stringify(response.data.user), cookieOptions);
      if (["admin", "superadmin"].includes(userRole)) {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 md:p-8 font-sans antialiased transition-colors duration-200">
      {/* Main Container Card */}
      <div className="w-full max-w-[960px] bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[620px] border border-slate-100 dark:border-slate-700/50">
        {/* Left Hero Panel */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-[#053846] via-[#084c5e] to-[#042832] text-white p-8 md:p-10 flex flex-col justify-between relative overflow-hidden min-h-[380px] md:min-h-auto select-none">
          {/* Subtle Background Fluid Waves / Orbs */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-40">
            <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-[#15b299]/30 blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-[#0d8775]/20 blur-3xl"></div>
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#15d1b3] to-[#20ebd1] rounded-2xl flex items-center justify-center shadow-lg shadow-[#15d1b3]/30">
                <Check className="w-7 h-7 text-white stroke-[3.5]" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white">
                Task<span className="text-[#1bd3b7]">Pro</span>
              </span>
            </div>
            <p className="text-xs font-medium text-teal-200/80 tracking-wide mt-2">
              Organize <span className="mx-1">•</span> Collaborate{" "}
              <span className="mx-1">•</span> Achieve
            </p>
          </div>

          {/* Welcome Message */}
          <div className="relative z-10 my-6 md:my-0">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 tracking-tight text-white">
              Welcome Back!{" "}
              <span className="inline-block animate-bounce text-2xl md:text-3xl">
                👋
              </span>
            </h1>
            <p className="text-sm text-teal-100/80 mt-2 leading-relaxed">
              Sign in to your account
              <br className="hidden sm:inline" /> to continue your tasks journey
            </p>
          </div>

          {/* Custom SVG Illustration Section (Plant, Laptop with Checklists, Calendar, Clock) */}
          <div className="relative w-full h-48 md:h-56 mt-4 flex items-end justify-center z-10">
            {/* Background Wavy Graphic Layer */}
            <svg
              className="absolute bottom-0 w-full h-auto text-[#085a6e]/50"
              viewBox="0 0 300 120"
              fill="none"
            >
              <path
                d="M0 60 C80 20, 160 100, 300 40 L300 120 L0 120 Z"
                fill="currentColor"
              />
              <path
                d="M0 80 C100 40, 200 110, 300 70 L300 120 L0 120 Z"
                fill="#042630"
                opacity="0.6"
              />
            </svg>

            {/* Potted Plant (Left Side) */}
            <div className="absolute left-2 bottom-3 w-16 md:w-20 z-10">
              <svg
                viewBox="0 0 100 130"
                className="w-full h-auto drop-shadow-md"
              >
                {/* Leaves */}
                <path
                  d="M50 70 C20 50, 10 20, 25 10 C40 25, 45 55, 50 70 Z"
                  fill="#1dd1a1"
                />
                <path
                  d="M50 70 C30 40, 35 15, 55 5 C60 20, 55 50, 50 70 Z"
                  fill="#10ac84"
                />
                <path
                  d="M50 70 C70 50, 85 25, 75 10 C60 20, 55 50, 50 70 Z"
                  fill="#00d2d3"
                />
                <path
                  d="M50 75 C10 65, 0 45, 15 35 C30 45, 40 65, 50 75 Z"
                  fill="#10ac84"
                />
                <path
                  d="M50 75 C80 70, 95 45, 80 35 C65 45, 60 65, 50 75 Z"
                  fill="#1dd1a1"
                />
                {/* Pot Base */}
                <ellipse cx="50" cy="78" rx="26" ry="6" fill="#e0e0e0" />
                <path
                  d="M26 78 L32 115 C33 120, 67 120, 68 115 L74 78 Z"
                  fill="url(#potGrad)"
                />
                <defs>
                  <linearGradient
                    id="potGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#b2bec3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Calendar with Clock (Right Side Background) */}
            <div className="absolute right-4 bottom-14 w-24 md:w-28 z-10">
              {/* Calendar Container */}
              <div className="bg-gradient-to-br from-[#1cd9c2] to-[#12a18e] rounded-xl p-2 shadow-lg border border-teal-300/30">
                {/* Calendar Binding Loops */}
                <div className="flex justify-around -mt-3 mb-1">
                  <div className="w-1.5 h-3 bg-[#0a5247] rounded-full"></div>
                  <div className="w-1.5 h-3 bg-[#0a5247] rounded-full"></div>
                </div>
                {/* Calendar Grid Lines */}
                <div className="bg-white/90 rounded-lg p-1.5 space-y-1">
                  <div className="h-1.5 bg-teal-200 rounded w-full"></div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="h-2 bg-teal-300 rounded"></div>
                    <div className="h-2 bg-teal-400 rounded"></div>
                    <div className="h-2 bg-teal-300 rounded"></div>
                    <div className="h-2 bg-teal-400 rounded"></div>
                    <div className="h-2 bg-teal-300 rounded"></div>
                    <div className="h-2 bg-teal-500 rounded"></div>
                  </div>
                </div>
              </div>

              {/* 3D Clock Floating in front of Calendar */}
              <div className="absolute -bottom-4 -right-2 w-14 h-14 bg-white rounded-full p-1 shadow-xl border-2 border-teal-100 flex items-center justify-center">
                <svg viewBox="0 0 50 50" className="w-full h-full">
                  <circle
                    cx="25"
                    cy="25"
                    r="22"
                    fill="#ffffff"
                    stroke="#222f3e"
                    strokeWidth="2.5"
                  />
                  {/* Clock Hands */}
                  <line
                    x1="25"
                    y1="25"
                    x2="25"
                    y2="12"
                    stroke="#10ac84"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="25"
                    y1="25"
                    x2="34"
                    y2="25"
                    stroke="#222f3e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="25" cy="25" r="2.5" fill="#10ac84" />
                </svg>
              </div>
            </div>

            {/* Laptop Center Feature */}
            <div className="relative z-20 w-48 md:w-56 -mb-1 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <svg
                viewBox="0 0 220 160"
                className="w-full h-auto drop-shadow-2xl"
              >
                {/* Laptop Screen Frame */}
                <rect
                  x="15"
                  y="10"
                  width="180"
                  height="115"
                  rx="10"
                  fill="#1e272e"
                />
                <rect
                  x="20"
                  y="15"
                  width="170"
                  height="105"
                  rx="6"
                  fill="#f8fafc"
                />

                {/* Screen Content: Task Checklists */}
                <g transform="translate(30, 25)">
                  {/* Item 1 */}
                  <circle cx="10" cy="12" r="8" fill="#15d1b3" />
                  <path
                    d="M7 12 L9.5 14.5 L13 9.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <rect
                    x="25"
                    y="9"
                    width="70"
                    height="6"
                    rx="3"
                    fill="#cbd5e1"
                  />

                  {/* Item 2 */}
                  <circle cx="10" cy="37" r="8" fill="#15d1b3" />
                  <path
                    d="M7 37 L9.5 39.5 L13 34.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <rect
                    x="25"
                    y="34"
                    width="95"
                    height="6"
                    rx="3"
                    fill="#cbd5e1"
                  />
                  <rect
                    x="25"
                    y="44"
                    width="55"
                    height="4"
                    rx="2"
                    fill="#e2e8f0"
                  />

                  {/* Item 3 */}
                  <circle cx="10" cy="62" r="8" fill="#15d1b3" />
                  <path
                    d="M7 62 L9.5 64.5 L13 59.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <rect
                    x="25"
                    y="59"
                    width="80"
                    height="6"
                    rx="3"
                    fill="#cbd5e1"
                  />
                </g>

                {/* Laptop Hinge & Keyboard Base */}
                <path
                  d="M0 125 C 0 125, 10 122, 210 122 C 210 122, 220 125, 220 127 L 205 140 C 200 144, 20 144, 15 140 Z"
                  fill="#485460"
                />
                <path
                  d="M10 123 L 210 123 L 200 138 L 20 138 Z"
                  fill="#d2dae2"
                />
                {/* Trackpad */}
                <rect
                  x="92"
                  y="126"
                  width="36"
                  height="8"
                  rx="2"
                  fill="#a4b0be"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-8 md:p-14 flex flex-col justify-center bg-white dark:bg-slate-800">
          {/* Header Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#0a2540] dark:text-white tracking-tight">
              Login
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form
            onSubmit={handlelogin}
            className="space-y-5 max-w-md mx-auto w-full"
          >
            {/* Email Field */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#15b299] focus:ring-4 focus:ring-[#15b299]/15 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-[#15b299] focus:ring-4 focus:ring-[#15b299]/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                      rememberMe
                        ? "bg-[#15b299] border-[#15b299] shadow-sm"
                        : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 group-hover:border-[#15b299]"
                    }`}
                  >
                    {rememberMe && (
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    )}
                  </div>
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Remember me
                </span>
              </label>

              <a
                href="/forget-password"
                className="font-medium text-[#15b299] hover:text-[#0f937e] dark:hover:text-[#20ebd1] transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#17d0b4] to-[#12ab94] hover:from-[#15bda4] hover:to-[#0e9b85] text-white font-semibold text-base shadow-lg shadow-[#15b299]/25 hover:shadow-xl hover:shadow-[#15b299]/35 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? (
                <LoadingSpinner className="h-5 w-5" />
              ) : (
                <LogIn className="w-5 h-5 stroke-[2.5]" />
              )}
              <span>{isSubmitting ? "Signing in..." : "Login"}</span>
            </button>
          </form>

          <div className="relative my-7 max-w-md mx-auto w-full flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            <span className="absolute bg-white dark:bg-slate-800 px-4 text-xs font-medium text-slate-400 dark:text-slate-500">
              or
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex items-center justify-center gap-4 max-w-md mx-auto w-full">
            {/* Google */}
            <button
              type="button"
              className="flex-1 max-w-[100px] h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm"
              aria-label="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            {/* GitHub */}
            <button
              type="button"
              className="flex-1 max-w-[100px] h-12 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
              aria-label="Sign in with GitHub"
            >
              <svg
                className="w-5 h-5 fill-slate-800 dark:fill-white"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            </button>

            {/* Microsoft */}
            <button
              type="button"
              className="flex-1 max-w-[100px] h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm"
              aria-label="Sign in with Microsoft"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
            </button>
          </div>
          {/* Divider */}

          {/* Footer Link */}
          <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#15b299] font-bold hover:text-[#0f937e] dark:hover:text-[#20ebd1] transition-colors ml-1"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
