import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { LoadingSpinner } from "../../components/common/LoadingSkeleton";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      notifyError("Please enter your email address.");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post(API_PATHS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      setSubmitted(true);
      notifySuccess("Password reset link sent to your email.");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Failed to send password reset link.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-3 sm:p-6 font-sans antialiased">
      {/* Main Card Container */}
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,25,38,0.45)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 ">
        {/* Left Promotional / Visual Panel */}
        <div className="lg:col-span-5 relative bg-[#033649] rounded-[24px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 text-white min-h-[580px] lg:min-h-[680px]">
          {/* Top-Right Subtle Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-bl from-[#06516b]/60 to-transparent pointer-events-none" />

          {/* Header / Logo & Headline Content */}
          <div className="relative z-10 mt-2">
            {/* Brand Logo */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0be8b7] to-[#00bfa5] flex items-center justify-center shadow-[0_8px_20px_rgba(11,232,183,0.3)] shrink-0">
                <svg
                  className="w-7 h-7 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[32px] font-bold tracking-tight leading-none">
                <span className="text-white">Task</span>
                <span className="text-[#19e5c8]">Pro</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-[13.5px] text-[#9ec4d1] tracking-wide mt-3 font-normal">
              Organize &nbsp;&bull;&nbsp; Collaborate &nbsp;&bull;&nbsp; Achieve
            </p>

            {/* Forgot Password Heading + Padlock Icon */}
            <div className="mt-12 sm:mt-14">
              <div className="flex items-center gap-3">
                <h2 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-white leading-tight">
                  Forgot Password?
                </h2>
                {/* Open Padlock with Cyan Sparks */}
                <svg
                  className="w-9 h-9 shrink-0 -mt-3"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  {/* Sparks */}
                  <line
                    x1="29"
                    y1="6"
                    x2="31"
                    y2="2"
                    stroke="#19e5c8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="33"
                    y1="9"
                    x2="37"
                    y2="7"
                    stroke="#19e5c8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="34"
                    y1="14"
                    x2="38"
                    y2="14"
                    stroke="#19e5c8"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Open Shackle */}
                  <path
                    d="M12 18V12.5C12 9.46243 14.4624 7 17.5 7C20.2 7 22.4 8.95 22.9 11.5"
                    stroke="#b5c9d6"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  {/* Padlock Body */}
                  <rect
                    x="8"
                    y="17"
                    width="19"
                    height="16"
                    rx="3.5"
                    fill="url(#smallLockGrad)"
                  />
                  {/* Keyhole */}
                  <circle cx="17.5" cy="23.5" r="1.8" fill="#033649" />
                  <path
                    d="M17.5 24.5V28"
                    stroke="#033649"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="smallLockGrad"
                      x1="8"
                      y1="17"
                      x2="27"
                      y2="33"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#e2edf5" />
                      <stop offset="1" stopColor="#b0c7d6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <p className="text-[#c5dce6] text-[15.5px] leading-[1.6] mt-3.5 max-w-[300px]">
                Don’t worry! Enter your email address and we’ll send you a
                password reset link.
              </p>
            </div>
          </div>

          {/* Bottom Abstract Waves & 3D Envelope + Plant Illustration */}
          <div className="relative z-10 -mx-10 -mb-10 mt-6 h-[320px] select-none pointer-events-none">
            <svg
              viewBox="0 0 420 330"
              className="w-full h-full object-cover"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Wave Gradients */}
                <linearGradient
                  id="backWave"
                  x1="0"
                  y1="30"
                  x2="420"
                  y2="280"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#077b8a" />
                  <stop offset="65%" stopColor="#045269" />
                  <stop offset="100%" stopColor="#033b4f" />
                </linearGradient>

                <linearGradient
                  id="midFloor"
                  x1="40"
                  y1="170"
                  x2="390"
                  y2="310"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#056478" />
                  <stop offset="100%" stopColor="#02364a" />
                </linearGradient>

                <linearGradient
                  id="frontWave"
                  x1="0"
                  y1="210"
                  x2="360"
                  y2="330"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0be6b5" />
                  <stop offset="55%" stopColor="#06948e" />
                  <stop offset="100%" stopColor="#034c61" />
                </linearGradient>

                {/* 3D Envelope Gradients */}
                <linearGradient
                  id="envSide"
                  x1="125"
                  y1="100"
                  x2="155"
                  y2="250"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#1b5699" />
                  <stop offset="100%" stopColor="#0d3163" />
                </linearGradient>

                <linearGradient
                  id="envBackInner"
                  x1="145"
                  y1="95"
                  x2="335"
                  y2="235"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#bfefff" />
                  <stop offset="100%" stopColor="#7cd6f5" />
                </linearGradient>

                <linearGradient
                  id="envLeftFlap"
                  x1="145"
                  y1="105"
                  x2="230"
                  y2="195"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#d7ecf7" />
                </linearGradient>

                <linearGradient
                  id="envRightFlap"
                  x1="335"
                  y1="90"
                  x2="255"
                  y2="180"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#f2f9fd" />
                  <stop offset="100%" stopColor="#c7e3f2" />
                </linearGradient>

                <linearGradient
                  id="envBottomFlap"
                  x1="148"
                  y1="170"
                  x2="335"
                  y2="245"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#eef7fc" />
                  <stop offset="100%" stopColor="#bcd9eb" />
                </linearGradient>

                <linearGradient
                  id="badgeGrad"
                  x1="205"
                  y1="125"
                  x2="275"
                  y2="200"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#17e3c3" />
                  <stop offset="100%" stopColor="#059e97" />
                </linearGradient>

                {/* Plant Gradients */}
                <linearGradient
                  id="potGrad"
                  x1="40"
                  y1="205"
                  x2="105"
                  y2="265"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="65%" stopColor="#d8ebf5" />
                  <stop offset="100%" stopColor="#9ec2d6" />
                </linearGradient>

                <linearGradient
                  id="leafLight"
                  x1="30"
                  y1="100"
                  x2="80"
                  y2="205"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#1df2be" />
                  <stop offset="100%" stopColor="#069688" />
                </linearGradient>

                <linearGradient
                  id="leafDark"
                  x1="65"
                  y1="115"
                  x2="115"
                  y2="205"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0ec9a4" />
                  <stop offset="100%" stopColor="#046b6c" />
                </linearGradient>

                <filter
                  id="softShadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="8"
                    stdDeviation="6"
                    floodColor="#012433"
                    floodOpacity="0.35"
                  />
                </filter>
              </defs>

              {/* Back Organic Teal Wave */}
              <path
                d="M-10 35 C 95 20, 145 110, 245 92 C 335 76, 375 115, 430 155 L 430 335 L -10 335 Z"
                fill="url(#backWave)"
              />

              {/* Mid Floor Mound */}
              <ellipse
                cx="220"
                cy="248"
                rx="235"
                ry="72"
                fill="url(#midFloor)"
              />

              {/* Contact Shadows under Pot and Envelope */}
              <ellipse
                cx="75"
                cy="266"
                rx="34"
                ry="8"
                fill="#012333"
                opacity="0.55"
              />
              <ellipse
                cx="236"
                cy="252"
                rx="95"
                ry="15"
                fill="#012333"
                opacity="0.5"
              />

              {/* Floating Action Lines Above Envelope */}
              <rect
                x="233"
                y="42"
                width="8"
                height="26"
                rx="4"
                transform="rotate(-14 233 42)"
                fill="#14d9ba"
              />
              <rect
                x="262"
                y="45"
                width="8"
                height="23"
                rx="4"
                transform="rotate(24 262 45)"
                fill="#14d9ba"
              />

              {/* 3D Tilted Envelope */}
              <g filter="url(#softShadow)">
                {/* 3D Extruded Left & Bottom Thickness */}
                <path
                  d="M132 112 C132 103 139 96 148 96 L158 95 L158 242 L144 244 C136 245 132 239 132 230 Z"
                  fill="url(#envSide)"
                />
                <path
                  d="M136 234 L322 212 L334 218 L146 244 Z"
                  fill="#0f386e"
                />

                {/* Main Envelope Front Face Clip */}
                <g>
                  {/* Base Light Blue Interior */}
                  <path
                    d="M145 106 C145 99 150 93 157 92 L322 73 C329 72 335 77 335 84 L335 207 C335 214 329 220 322 221 L157 240 C150 241 145 236 145 229 Z"
                    fill="url(#envBackInner)"
                  />

                  {/* Left Flap */}
                  <path
                    d="M145 101 L234 162 L145 233 Z"
                    fill="url(#envLeftFlap)"
                  />

                  {/* Right Flap */}
                  <path
                    d="M335 79 L246 160 L335 213 Z"
                    fill="url(#envRightFlap)"
                  />

                  {/* Bottom Flap */}
                  <path
                    d="M147 237 L224 156 C234 146 248 145 258 153 L333 216 C330 219 326 221 322 221 L157 240 C153 240 149 239 147 237 Z"
                    fill="url(#envBottomFlap)"
                  />

                  {/* Top Subtle Crease Highlight */}
                  <path
                    d="M149 95 L234 156 C240 160 247 159 252 154 L331 76"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeOpacity="0.75"
                    fill="none"
                  />
                </g>

                {/* Circular Teal Lock Badge */}
                <g transform="translate(242, 161) rotate(-6)">
                  <circle cx="0" cy="4" r="35" fill="#074f63" opacity="0.28" />
                  <circle cx="0" cy="0" r="35" fill="url(#badgeGrad)" />
                  <circle
                    cx="0"
                    cy="0"
                    r="33.5"
                    stroke="#6efce3"
                    strokeOpacity="0.45"
                    strokeWidth="1.5"
                  />

                  {/* White Padlock inside Badge */}
                  <path
                    d="M-8 -4 V-10 C-8 -14.4 -4.4 -18 0 -18 C4.4 -18 8 -14.4 8 -10 V-4"
                    stroke="#ffffff"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <rect
                    x="-13"
                    y="-5"
                    width="26"
                    height="21"
                    rx="4.5"
                    fill="#ffffff"
                  />
                  <circle cx="0" cy="3.5" r="2.3" fill="#089c94" />
                  <path
                    d="M0 5 V9.5"
                    stroke="#089c94"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>
              </g>

              {/* Potted Plant on Left */}
              <g>
                {/* Stems */}
                <path
                  d="M72 208 Q 52 165 36 135"
                  stroke="#0b9e8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M74 208 Q 68 155 62 115"
                  stroke="#12c9a6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M76 208 Q 92 162 106 138"
                  stroke="#088278"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Back Leaf */}
                <path
                  d="M72 195 C 48 162, 46 115, 63 96 C 82 116, 86 160, 74 195 Z"
                  fill="url(#leafLight)"
                />
                {/* Left Leaf */}
                <path
                  d="M70 202 C 32 184, 15 142, 24 114 C 52 126, 70 162, 72 202 Z"
                  fill="url(#leafLight)"
                />
                {/* Right Leaf */}
                <path
                  d="M75 202 C 80 162, 102 132, 124 128 C 122 158, 102 188, 77 202 Z"
                  fill="url(#leafDark)"
                />
                {/* Small Lower Left Leaf */}
                <path
                  d="M68 205 C 40 202, 22 184, 22 166 C 42 168, 60 184, 70 205 Z"
                  fill="url(#leafDark)"
                />

                {/* White Pot Body */}
                <path
                  d="M46 213 L102 213 L95 258 C94 263 89 266 84 266 L64 266 C59 266 54 263 53 258 Z"
                  fill="url(#potGrad)"
                />
                {/* Pot Rim */}
                <rect
                  x="42"
                  y="204"
                  width="64"
                  height="11"
                  rx="4"
                  fill="#f5fbff"
                />
                <path d="M45 215 H103" stroke="#b3d2e3" strokeWidth="1.5" />
              </g>

              {/* Foreground Vibrant Mint-Teal Wave */}
              <path
                d="M-10 232 C 85 218, 155 295, 255 288 C 325 283, 375 250, 430 245 L 430 335 L -10 335 Z"
                fill="url(#frontWave)"
              />
            </svg>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-14 lg:px-20">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Form Heading */}
            <h1 className="text-[30px] sm:text-[34px] font-bold text-white tracking-tight text-center">
              Reset Your Password
            </h1>

            {/* Form Subheading */}
            <p className="text-gray-50 text-[15.5px] sm:text-[16px] leading-[1.55] text-center mt-3.5">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-9 space-y-6">
              {/* Email Input Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#4d6580]">
                  <svg
                    className="w-[21px] h-[21px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder="Email Address"
                  aria-label="Email Address"
                  className="w-full h-[54px] pl-12 pr-4 bg-[#f4f7fa] border border-[#dce4ee] rounded-[12px] text-[15.5px] text-[#0c213a] placeholder-[#6b8099] focus:outline-none focus:bg-white focus:border-[#00bfa5] focus:ring-4 focus:ring-[#00bfa5]/15 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[54px] rounded-[12px] bg-gradient-to-r from-[#0be6b5] to-[#00b5a5] hover:from-[#09d4a7] hover:to-[#00a394] active:scale-[0.99] text-white font-semibold text-[16.5px] flex items-center justify-center gap-2.5 shadow-[0_10px_24px_-6px_rgba(0,185,165,0.5)] transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoadingSpinner className="h-5 w-5" />
                ) : (
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                )}
                <span>{isSubmitting ? "Sending..." : "Send Reset Link"}</span>
              </button>
            </form>

            {/* Optional Confirmation Feedback */}
            {submitted && (
              <div className="mt-4 px-4 py-2.5 rounded-lg bg-[#e6fbf6] border border-[#a3eedc] text-[#056e5c] text-sm text-center">
                Password reset link sent to{" "}
                <span className="font-semibold">{email}</span>.
              </div>
            )}

            {/* Divider with "or" */}
            <div className="relative flex items-center justify-center my-8">
              <div className="w-full border-t border-[#e3eaf2]" />
              <span className="px-4 bg-[#fbfdfe] text-[15px] text-[#3c5470] font-medium">
                or
              </span>
              <div className="w-full border-t border-[#e3eaf2]" />
            </div>

            {/* Back to Login Link */}
            <div className="flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-[#00bfa5] hover:text-[#009e88] font-semibold text-[15px] transition-colors group"
              >
                <svg
                  className="w-[18px] h-[18px] transition-transform group-hover:-translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
