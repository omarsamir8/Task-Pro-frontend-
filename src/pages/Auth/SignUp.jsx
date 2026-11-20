import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Wrench,
  UserPlus,
  Check,
} from "lucide-react";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { LoadingSpinner } from "../../components/common/LoadingSkeleton";
import {
  notifyError,
  notifySuccess,
} from "../../components/common/notifications";
export default function SignUp() {
  const navigate = useNavigate();
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    adminInviteToken: "",
    profileImageUrl: null,
  });

  // UI Toggle States
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Role options
  // const roleOptions = [
  //   "Admin (with valid token)",
  //   "Project Manager",
  //   "Team Member",
  //   "Guest / Observer",
  // ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      notifyError("Passwords do not match.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await api.post(API_PATHS.AUTH.REGISTER, formData);
      const user = {
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        profileImageUrl: response.data.profileImageUrl,
      };
      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("refreshToken", response.data.refreshToken, { expires: 30 });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      notifySuccess("Account created successfully.");
      navigate(
        ["admin", "superadmin"].includes(user.role)
          ? "/admin/dashboard"
          : "/user/dashboard",
      );
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[680px]">
        {/* LEFT PANEL - Teals & Gradient Branding */}
        <div className="w-full md:w-[42%] bg-gradient-to-b from-[#0a4b55] via-[#0c6b73] to-[#12a197] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden select-none">
          {/* Background Decorative Waves / Shapes */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 700"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M-50 200 C 100 150, 250 300, 450 200 L 450 700 L -50 700 Z"
                fill="#ffffff"
              />
              <path
                d="M-50 400 C 150 350, 200 550, 450 450 L 450 700 L -50 700 Z"
                fill="#2dd4bf"
              />
            </svg>
          </div>

          {/* Top Logo & Slogan Section */}
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              {/* TaskPro Check Logo Icon */}
              <div className="w-11 h-11 bg-[#14b8a6] rounded-xl flex items-center justify-center shadow-lg border border-teal-300/30">
                <Check className="w-7 h-7 text-white stroke-[3.5]" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                Task<span className="text-[#2dd4bf]">Pro</span>
              </span>
            </div>
            <p className="text-xs font-medium tracking-wide text-teal-100 opacity-90 pl-1">
              Organize <span className="mx-1">•</span> Collaborate{" "}
              <span className="mx-1">•</span> Achieve
            </p>
          </div>

          {/* Middle Call to Action Text */}
          <div className="relative z-10 my-6">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              Join TaskPro!
            </h1>
            <p className="text-teal-100 text-sm md:text-base leading-relaxed font-normal opacity-90 max-w-xs">
              Create your account and start managing your tasks
            </p>
          </div>

          {/* Bottom Illustration Canvas Graphics */}
          <div className="relative z-10 mt-auto pt-4 flex justify-center items-end">
            <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
              {/* Flying Paper Plane Element */}
              <div className="absolute top-2 right-4 animate-pulse">
                <svg
                  className="w-14 h-14 text-teal-200 drop-shadow-md"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                {/* Dotted Trail */}
                <svg
                  className="absolute -left-10 top-8 w-12 h-8 text-teal-200/60"
                  viewBox="0 0 50 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                >
                  <path d="M0 25 Q 25 20, 45 5" />
                </svg>
              </div>

              {/* Clipboard Container */}
              <div className="w-48 bg-white rounded-2xl p-4 shadow-2xl transform -rotate-3 border-4 border-teal-800/20 relative z-10">
                {/* Clipboard Top Clip */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 bg-[#0c6b73] rounded-t-lg flex items-center justify-center border-2 border-teal-500/40 shadow-sm">
                  <div className="w-4 h-4 rounded-full bg-white/30 border border-white/50" />
                </div>

                {/* Checklist Items */}
                <div className="mt-3 space-y-3">
                  {/* Item 1 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#14b8a6] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full w-24" />
                  </div>
                  {/* Item 2 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#14b8a6] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full w-28" />
                  </div>
                  {/* Item 3 */}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-[#14b8a6] flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full w-20" />
                  </div>
                </div>
              </div>

              {/* Floating Add Plus Button */}
              <div className="absolute bottom-2 right-2 z-20 w-14 h-14 bg-gradient-to-tr from-[#14b8a6] to-[#2dd4bf] rounded-full flex items-center justify-center shadow-2xl border-2 border-white transform hover:scale-105 transition-transform duration-200 cursor-pointer">
                <span className="text-white text-3xl font-light leading-none mb-1">
                  +
                </span>
              </div>

              {/* Decorative Leaves */}
              <div className="absolute bottom-1 left-0 z-0">
                <svg
                  className="w-12 h-16 text-teal-800/30 fill-current"
                  viewBox="0 0 50 70"
                >
                  <path d="M 0 70 Q 25 30 50 0 Q 30 50 0 70 Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Sign Up Form */}
        <div className="w-full md:w-[58%] p-8 md:p-12 flex flex-col justify-center bg-white">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Sign Up
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Create your account in seconds
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-md mx-auto w-full"
          >
            {/* Full Name Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Email Address Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Optional superadmin setup token */}
            <div className="pt-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Super Admin Setup Token (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Wrench className="w-5 h-5 text-teal-600" />
                </div>
                <input
                  type="text"
                  name="adminInviteToken"
                  placeholder="Only needed to set up a super admin account"
                  value={formData.adminInviteToken}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            {/* Create Account Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] hover:from-[#0d9488] hover:to-[#14b8a6] text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-500/25 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:cursor-wait disabled:opacity-70"
              >
                {isSubmitting ? (
                  <LoadingSpinner className="h-5 w-5" />
                ) : (
                  <UserPlus className="w-5 h-5 stroke-[2.2]" />
                )}
                <span>{isSubmitting ? "Creating account..." : "Create Account"}</span>
              </button>
            </div>

            {/* Separator */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider absolute">
                or
              </span>
            </div>

            {/* Social Logins Row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Google Button */}
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm group"
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

              {/* GitHub Button */}
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm text-slate-800"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </button>

              {/* Microsoft Button */}
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 bg-slate-50/80 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
              </button>
            </div>

            {/* Bottom Login Link */}
            <div className="text-center pt-3 text-xs font-medium text-slate-500">
              Already have an account?{" "}
              <a href="/" className="text-teal-500 font-bold hover:underline">
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
