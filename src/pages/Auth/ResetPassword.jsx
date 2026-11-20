import { useState } from "react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/common/LoadingSkeleton";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";
export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    if (password !== confirmPassword) {
      setStatusMessage({ type: "error", text: "Passwords do not match." });
      notifyError("Passwords do not match.");
      return;
    }
    try {
      setIsSubmitting(true);
      const { data } = await api.post(
        API_PATHS.AUTH.RESET_PASSWORD(token),
        { password },
      );
      const message = data.message || "Password reset successfully.";
      setStatusMessage({
        type: "success",
        text: message,
      });
      notifySuccess(message);
      navigate("/", { replace: true });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reset password.";
      setStatusMessage({ type: "error", text: message });
      notifyError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-3 sm:p-6 font-sans antialiased">
      {/* Main Card Container */}
      <div className="w-full max-w-[1000px] bg-white dark:bg-slate-800 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,25,38,0.45)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
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

            {/* Create New Password Heading + Closed Padlock Icon */}
            <div className="mt-12 sm:mt-14">
              <div className="flex items-center gap-2.5">
                <h2 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                  Create New Password
                </h2>
                {/* Closed Silver Padlock Icon */}
                <svg
                  className="w-8 h-8 shrink-0 -mt-2"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  {/* Closed Shackle */}
                  <path
                    d="M11 16V11.5C11 7.91015 13.9101 5 17.5 5C21.0899 5 24 7.91015 24 11.5V16"
                    stroke="#b5c9d6"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                  {/* Padlock Body */}
                  <rect
                    x="7.5"
                    y="15"
                    width="20"
                    height="16.5"
                    rx="3.5"
                    fill="url(#closedSmallLock)"
                  />
                  {/* Keyhole */}
                  <circle cx="17.5" cy="21.8" r="1.8" fill="#033649" />
                  <path
                    d="M17.5 23V26.5"
                    stroke="#033649"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="closedSmallLock"
                      x1="7.5"
                      y1="15"
                      x2="27.5"
                      y2="31.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#e6f0f7" />
                      <stop offset="1" stopColor="#b0c7d6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <p className="text-[#c5dce6] text-[15.5px] leading-[1.6] mt-3.5 max-w-[290px]">
                Choose a strong password to keep your account secure.
              </p>
            </div>
          </div>

          {/* Bottom Abstract Waves & 3D Shield + Password Pill + Plant Illustration */}
          <div className="relative z-10 -mx-10 -mb-10 mt-6 h-[325px] select-none pointer-events-none">
            <svg
              viewBox="0 0 420 335"
              className="w-full h-full object-cover"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Background Wave Gradients */}
                <linearGradient
                  id="backWave2"
                  x1="0"
                  y1="25"
                  x2="420"
                  y2="280"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#077b8a" />
                  <stop offset="65%" stopColor="#045269" />
                  <stop offset="100%" stopColor="#033b4f" />
                </linearGradient>

                <linearGradient
                  id="midFloor2"
                  x1="40"
                  y1="170"
                  x2="390"
                  y2="315"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#056478" />
                  <stop offset="100%" stopColor="#02364a" />
                </linearGradient>

                <linearGradient
                  id="frontWave2"
                  x1="0"
                  y1="215"
                  x2="360"
                  y2="335"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0be6b5" />
                  <stop offset="55%" stopColor="#06948e" />
                  <stop offset="100%" stopColor="#034c61" />
                </linearGradient>

                {/* 3D Shield Gradients */}
                <linearGradient
                  id="shieldExtrude"
                  x1="155"
                  y1="70"
                  x2="230"
                  y2="245"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#0b878c" />
                  <stop offset="100%" stopColor="#054e63" />
                </linearGradient>

                <linearGradient
                  id="shieldOuterRim"
                  x1="175"
                  y1="55"
                  x2="305"
                  y2="235"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#6ffce0" />
                  <stop offset="50%" stopColor="#19dfc0" />
                  <stop offset="100%" stopColor="#099c95" />
                </linearGradient>

                <linearGradient
                  id="shieldInnerFace"
                  x1="185"
                  y1="68"
                  x2="295"
                  y2="225"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#3ff2d4" />
                  <stop offset="60%" stopColor="#12c9b3" />
                  <stop offset="100%" stopColor="#088e8d" />
                </linearGradient>

                {/* Shield White Padlock */}
                <linearGradient
                  id="shieldLockGrad"
                  x1="212"
                  y1="100"
                  x2="265"
                  y2="180"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#d2e6f2" />
                </linearGradient>

                {/* Password Pill */}
                <linearGradient
                  id="pillFront"
                  x1="165"
                  y1="180"
                  x2="315"
                  y2="230"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#dcebf5" />
                </linearGradient>

                {/* Plant Gradients */}
                <linearGradient
                  id="potGrad2"
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
                  id="leafLight2"
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
                  id="leafDark2"
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
                  id="shieldDrop"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="10"
                    stdDeviation="7"
                    floodColor="#012433"
                    floodOpacity="0.38"
                  />
                </filter>

                <filter
                  id="pillDrop"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="0"
                    dy="7"
                    stdDeviation="5"
                    floodColor="#022b3d"
                    floodOpacity="0.35"
                  />
                </filter>
              </defs>

              {/* Back Organic Teal Wave */}
              <path
                d="M-10 30 C 95 15, 145 105, 245 88 C 335 72, 375 110, 430 150 L 430 340 L -10 340 Z"
                fill="url(#backWave2)"
              />

              {/* Mid Floor Mound */}
              <ellipse
                cx="220"
                cy="252"
                rx="235"
                ry="72"
                fill="url(#midFloor2)"
              />

              {/* Contact Shadows */}
              <ellipse
                cx="75"
                cy="268"
                rx="34"
                ry="8"
                fill="#012333"
                opacity="0.55"
              />
              <ellipse
                cx="242"
                cy="252"
                rx="88"
                ry="14"
                fill="#012333"
                opacity="0.5"
              />

              {/* Three Cyan Sparks Top-Right of Shield */}
              <rect
                x="284"
                y="22"
                width="8"
                height="26"
                rx="4"
                transform="rotate(14 284 22)"
                fill="#19e5c8"
              />
              <rect
                x="312"
                y="34"
                width="8"
                height="26"
                rx="4"
                transform="rotate(42 312 34)"
                fill="#19e5c8"
              />
              <rect
                x="325"
                y="63"
                width="8"
                height="24"
                rx="4"
                transform="rotate(74 325 63)"
                fill="#19e5c8"
              />

              {/* 3D Security Shield */}
              <g filter="url(#shieldDrop)">
                {/* Left 3D Extruded Depth */}
                <path
                  d="M234 55 L166 84 C160 87 156 93 156 100 L158 148 C160 192 188 225 232 243 L242 241 L240 58 Z"
                  fill="url(#shieldExtrude)"
                />

                {/* Outer Beveled Rim */}
                <path
                  d="M242 55 L312 81 C318 83 322 89 322 96 L320 144 C318 188 290 222 245 242 C243 243 240 243 238 242 C194 223 167 190 165 146 L163 98 C163 91 167 85 173 83 L238 55 C239.5 54.4 241 54.4 242 55 Z"
                  fill="url(#shieldOuterRim)"
                />

                {/* Inner Recessed Shield Face */}
                <path
                  d="M242 66 L303 89 C308 91 311 95 311 101 L309 143 C307 181 283 211 244 229 C242.5 229.6 240.8 229.6 239.3 229 C201 212 178 183 176 145 L174 103 C174 97 177 92 182 90 L239 66 C240 65.6 241 65.6 242 66 Z"
                  fill="url(#shieldInnerFace)"
                />

                {/* Subtle Top-Left Inner Highlight */}
                <path
                  d="M178 96 C179 92 182 89 186 87 L240 65"
                  stroke="#9effec"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.7"
                />

                {/* White 3D Padlock Centered on Shield */}
                <g transform="translate(242, 144) rotate(-2)">
                  {/* Shackle Shadow */}
                  <path
                    d="M-15 -14 V-25 C-15 -34 -8 -41 0 -41 C8 -41 15 -34 15 -25 V-14"
                    stroke="#076e6e"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.25"
                    transform="translate(-2, 3)"
                  />
                  {/* Shackle */}
                  <path
                    d="M-15 -14 V-25 C-15 -34 -8 -41 0 -41 C8 -41 15 -34 15 -25 V-14"
                    stroke="url(#shieldLockGrad)"
                    strokeWidth="7.5"
                    strokeLinecap="round"
                  />
                  {/* Lock Body 3D Side */}
                  <rect
                    x="-26"
                    y="-15"
                    width="48"
                    height="39"
                    rx="8"
                    fill="#b4cfe0"
                  />
                  {/* Lock Body Front */}
                  <rect
                    x="-23"
                    y="-16"
                    width="47"
                    height="39"
                    rx="8"
                    fill="url(#shieldLockGrad)"
                  />
                  {/* Keyhole */}
                  <circle cx="0.5" cy="1" r="4.2" fill="#098c8a" />
                  <path
                    d="M0.5 3.5 V11.5"
                    stroke="#098c8a"
                    strokeWidth="4.2"
                    strokeLinecap="round"
                  />
                </g>
              </g>

              {/* 3D Floating Password Asterisk Pill */}
              <g
                transform="translate(244, 208) rotate(-11)"
                filter="url(#pillDrop)"
              >
                {/* 3D Extruded Bottom/Left Edge */}
                <rect
                  x="-79"
                  y="-18"
                  width="154"
                  height="42"
                  rx="13"
                  fill="#a8c6db"
                />
                {/* Pill Main Front Face */}
                <rect
                  x="-75"
                  y="-21"
                  width="154"
                  height="42"
                  rx="13"
                  fill="url(#pillFront)"
                />
                {/* Top Edge Specular Highlight */}
                <rect
                  x="-74"
                  y="-20"
                  width="152"
                  height="40"
                  rx="12.5"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Six Blue Asterisks */}
                {[-50, -30, -10, 10, 30, 50].map((cx, idx) => (
                  <g
                    key={idx}
                    transform={`translate(${cx}, 0)`}
                    stroke="#28589c"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  >
                    <line x1="0" y1="-6.5" x2="0" y2="6.5" />
                    <line x1="-5.6" y1="-3.25" x2="5.6" y2="3.25" />
                    <line x1="-5.6" y1="3.25" x2="5.6" y2="-3.25" />
                  </g>
                ))}
              </g>

              {/* Potted Plant on Left */}
              <g>
                {/* Stems */}
                <path
                  d="M72 210 Q 52 167 36 137"
                  stroke="#0b9e8a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M74 210 Q 68 157 62 117"
                  stroke="#12c9a6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M76 210 Q 92 164 106 140"
                  stroke="#088278"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Back Leaf */}
                <path
                  d="M72 197 C 48 164, 46 117, 63 98 C 82 118, 86 162, 74 197 Z"
                  fill="url(#leafLight2)"
                />
                {/* Left Leaf */}
                <path
                  d="M70 204 C 32 186, 15 144, 24 116 C 52 128, 70 164, 72 204 Z"
                  fill="url(#leafLight2)"
                />
                {/* Right Leaf */}
                <path
                  d="M75 204 C 80 164, 102 134, 124 130 C 122 160, 102 190, 77 204 Z"
                  fill="url(#leafDark2)"
                />
                {/* Small Lower Left Leaf */}
                <path
                  d="M68 207 C 40 204, 22 186, 22 168 C 42 170, 60 186, 70 207 Z"
                  fill="url(#leafDark2)"
                />

                {/* White Pot Body */}
                <path
                  d="M46 215 L102 215 L95 260 C94 265 89 268 84 268 L64 268 C59 268 54 265 53 260 Z"
                  fill="url(#potGrad2)"
                />
                {/* Pot Rim */}
                <rect
                  x="42"
                  y="206"
                  width="64"
                  height="11"
                  rx="4"
                  fill="#f5fbff"
                />
                <path d="M45 217 H103" stroke="#b3d2e3" strokeWidth="1.5" />
              </g>

              {/* Foreground Vibrant Mint-Teal Wave */}
              <path
                d="M-10 237 C 85 223, 155 300, 255 293 C 325 288, 375 255, 430 250 L 430 340 L -10 340 Z"
                fill="url(#frontWave2)"
              />
            </svg>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-14 lg:px-20">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Form Heading */}
            <h1 className="text-[32px] sm:text-[36px] font-bold text-white tracking-tight text-center">
              Reset Password
            </h1>

            {/* Form Subheading */}
            <p className="text-gray-50 text-[15.5px] sm:text-[16px] leading-[1.55] text-center mt-3">
              Enter your new password below.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
              {/* New Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3d5570]">
                  <svg
                    className="w-[21px] h-[21px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2.5" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
                    <path d="M12 16.5v1.5" />
                  </svg>
                </div>

                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="New Password"
                  aria-label="New Password"
                  className="w-full h-[54px] pl-12 pr-12 bg-[#f4f7fa] border border-[#dce4ee] rounded-[12px] text-[15.5px] text-[#0c213a] placeholder-[#6b8099] focus:outline-none focus:bg-white focus:border-[#00bfa5] focus:ring-4 focus:ring-[#00bfa5]/15 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={
                    showNewPassword ? "Hide new password" : "Show new password"
                  }
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#3d5570] hover:text-[#0c213a] transition-colors cursor-pointer"
                >
                  {showNewPassword ? (
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Confirm New Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#3d5570]">
                  <svg
                    className="w-[21px] h-[21px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="11" width="16" height="10" rx="2.5" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
                    <path d="M12 16.5v1.5" />
                  </svg>
                </div>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (statusMessage) setStatusMessage(null);
                  }}
                  placeholder="Confirm New Password"
                  aria-label="Confirm New Password"
                  className="w-full h-[54px] pl-12 pr-12 bg-[#f4f7fa] border border-[#dce4ee] rounded-[12px] text-[15.5px] text-[#0c213a] placeholder-[#6b8099] focus:outline-none focus:bg-white focus:border-[#00bfa5] focus:ring-4 focus:ring-[#00bfa5]/15 transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#3d5570] hover:text-[#0c213a] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      className="w-[21px] h-[21px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.85"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[54px] rounded-[12px] bg-gradient-to-r from-[#0be6b5] to-[#00b5a5] hover:from-[#09d4a7] hover:to-[#00a394] active:scale-[0.99] text-white font-semibold text-[16.5px] flex items-center justify-center gap-2.5 shadow-[0_10px_24px_-6px_rgba(0,185,165,0.5)] transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <LoadingSpinner className="h-5 w-5" />
                  ) : (
                    <svg
                      className="w-[22px] h-[22px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                      <path d="M21 3v5h-5" />
                      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                      <path d="M8 16H3v5" />
                    </svg>
                  )}
                  <span>{isSubmitting ? "Resetting..." : "Reset Password"}</span>
                </button>
              </div>
            </form>

            {/* Optional Validation / Confirmation Feedback */}
            {statusMessage && (
              <div
                className={`mt-4 px-4 py-2.5 rounded-lg border text-sm text-center ${
                  statusMessage.type === "error"
                    ? "bg-red-50 border-red-200 text-red-700"
                    : "bg-[#e6fbf6] border-[#a3eedc] text-[#056e5c]"
                }`}
              >
                {statusMessage.text}
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
