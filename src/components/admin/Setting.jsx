import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import api from "../../utils/axiosInstance";
import API_PATHS from "../../utils/apiPaths";
import { FormSkeleton, LoadingSpinner } from "../common/LoadingSkeleton";
import {
  notifyError,
  notifySuccess,
} from "../common/notifications";
import {
  User,
  Lock,
  Bell,
  Blocks,
  Settings,
  Camera,
  ShieldCheck,
  KeyRound,
  Mail,
  Smartphone,
  Globe,
  Moon,
} from "lucide-react";

/**
 * Custom crisp SVG portrait avatar matching Omar Samir in the reference image:
 * Circular cool-gray backdrop (#D1D5DB), smiling dark-haired bearded portrait in dark top.
 */
const OmarSamirPortrait = ({ customImageUrl }) => {
  if (customImageUrl) {
    return (
      <img
        src={customImageUrl}
        alt="Omar Samir"
        className="w-28 h-28 rounded-full object-cover bg-[#D1D5DB]"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 120 120"
      className="w-28 h-28 rounded-full object-cover bg-[#D1D5DB] select-none"
      aria-label="Omar Samir"
    >
      <defs>
        <clipPath id="omar-avatar-clip">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
        <linearGradient id="omar-backdrop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6D9DE" />
          <stop offset="100%" stopColor="#C8CCD2" />
        </linearGradient>
        <linearGradient id="omar-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E6AE8A" />
          <stop offset="100%" stopColor="#D89A75" />
        </linearGradient>
      </defs>

      <g clipPath="url(#omar-avatar-clip)">
        {/* Light cool-gray circular backdrop */}
        <rect width="120" height="120" fill="url(#omar-backdrop)" />

        {/* Dark Crewneck / Polo Shoulders */}
        <path
          d="M14 120 C16 95, 34 86, 60 86 C86 86, 104 95, 106 120 Z"
          fill="#11161D"
        />
        {/* Subtle Collar Placket Detail */}
        <path
          d="M47 86 L60 103 L73 86"
          fill="none"
          stroke="#262F3D"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <line
          x1="60"
          y1="103"
          x2="60"
          y2="115"
          stroke="#262F3D"
          strokeWidth="2"
        />

        {/* Neck */}
        <path d="M50 72 L50 89 C50 94, 70 94, 70 89 L70 72 Z" fill="#CFA080" />
        {/* Neck Shadow under Chin */}
        <ellipse cx="60" cy="76" rx="11" ry="5" fill="#B97D5B" opacity="0.45" />

        {/* Ears */}
        <ellipse cx="39.5" cy="53" rx="3.8" ry="6.5" fill="#D99C77" />
        <ellipse cx="80.5" cy="53" rx="3.8" ry="6.5" fill="#D99C77" />

        {/* Head / Face */}
        <path
          d="M40.5 47 C40.5 31, 48.5 24, 60 24 C71.5 24, 79.5 31, 79.5 47 C79.5 64, 71.5 76, 60 76 C48.5 76, 40.5 64, 40.5 47 Z"
          fill="url(#omar-skin)"
        />

        {/* Neat Short Dark Hair */}
        <path
          d="M39.5 46 C38.5 31, 44.5 19.5, 60 19.5 C75.5 19.5, 81.5 31, 80.5 46 C79.2 38, 76.5 32.5, 72 30.5 C67 28.5, 53 28.5, 48 30.5 C43.5 32.5, 40.8 38, 39.5 46 Z"
          fill="#1B1613"
        />
        {/* Top Hairline Texture */}
        <path
          d="M46 29.5 C51 26.5, 69 26.5, 74 29.5"
          stroke="#2A221E"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Full Groomed Beard & Mustache */}
        <path
          d="M40.8 51 C41.5 67.5, 49.5 77, 60 77 C70.5 77, 78.5 67.5, 79.2 51 C77.6 58.5, 74.2 63.2, 68.5 64.5 C65.8 65.1, 63.5 63.5, 60 63.5 C56.5 63.5, 54.2 65.1, 51.5 64.5 C45.8 63.2, 42.4 58.5, 40.8 51 Z"
          fill="#231C18"
        />
        {/* Mustache */}
        <path
          d="M50.5 60.2 C53.5 57.6, 57.5 57.8, 60 59.2 C62.5 57.8, 66.5 57.6, 69.5 60.2 C67.5 62.2, 63.5 61.8, 60 61.2 C56.5 61.8, 52.5 62.2, 50.5 60.2 Z"
          fill="#1B1512"
        />
        {/* Soul Patch */}
        <path d="M57.5 67.5 L62.5 67.5 L61 72.5 L59 72.5 Z" fill="#1B1512" />

        {/* Warm Smile with Teeth */}
        <path
          d="M52.8 62.4 Q60 67.8 67.2 62.4 Q60 64.4 52.8 62.4 Z"
          fill="#FFFFFF"
        />
        <path
          d="M52.8 62.4 Q60 68.2 67.2 62.4"
          stroke="#8F4A38"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyebrows */}
        <path
          d="M46.5 43.2 Q51 41.2 55.5 43"
          stroke="#1B1512"
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M64.5 43 Q69 41.2 73.5 43.2"
          stroke="#1B1512"
          strokeWidth="2.3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eyes */}
        <ellipse cx="51.2" cy="46.8" rx="2.7" ry="1.9" fill="#FFFFFF" />
        <circle cx="51.2" cy="46.8" r="1.45" fill="#1E1916" />
        <circle cx="51.7" cy="46.3" r="0.45" fill="#FFFFFF" />

        <ellipse cx="68.8" cy="46.8" rx="2.7" ry="1.9" fill="#FFFFFF" />
        <circle cx="68.8" cy="46.8" r="1.45" fill="#1E1916" />
        <circle cx="69.3" cy="46.3" r="0.45" fill="#FFFFFF" />

        {/* Nose */}
        <path
          d="M60 46.5 L58.2 54.5 Q60 56 61.8 54.5"
          stroke="#B97B57"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </svg>
  );
};

const NAV_TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Blocks },
  { id: "preferences", label: "Preferences", icon: Settings },
];

export default function Setting() {
  // Active tab defaults to 'profile' to match the reference image 100%
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [displayedName, setDisplayedName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [role, setRole] = useState("member");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Secondary tab interactive states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("Africa/Cairo (UTC+02:00)");
  const [compactView, setCompactView] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    let active = true;
    api.get(API_PATHS.AUTH.PROFILE)
      .then(({ data }) => {
        if (!active) return;
        setFullName(data.name || "");
        setDisplayedName(data.name || "");
        setEmail(data.email || "");
        setAvatarUrl(data.profileImageUrl || null);
        setRole(data.role || "member");
      })
      .catch((error) => {
        const message =
          error.response?.data?.message || "Unable to load profile.";
        if (active) {
          setProfileError(message);
          notifyError(message);
        }
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const payload = new FormData();
    payload.append("image", file);
    setUploadingImage(true);
    try {
      const { data } = await api.post(API_PATHS.AUTH.UPLOAD_IMAGE, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarUrl(data.imageUrl);
      notifySuccess("Profile photo uploaded. Save your profile to apply it.");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Unable to upload profile photo.",
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put(API_PATHS.AUTH.PROFILE, {
        name: fullName.trim(), email, profileImageUrl: avatarUrl,
      });
      setFullName(data.name);
      setDisplayedName(data.name);
      if (data.profileImageUrl) setAvatarUrl(data.profileImageUrl);
      Cookies.set("token", data.token, { expires: 7 });
      Cookies.set("refreshToken", data.refreshToken, { expires: 30 });
      const user = JSON.parse(Cookies.get("user") || "{}");
      Cookies.set("user", JSON.stringify({ ...user, ...data }), { expires: 7 });
      notifySuccess("Profile settings saved successfully.");
    } catch (error) {
      notifyError(error.response?.data?.message || "Unable to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      notifyError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      const { data } = await api.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      notifySuccess(data.message || "Password changed successfully.");
    } catch (error) {
      notifyError(
        error.response?.data?.message || "Unable to change password.",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (profileLoading) return <FormSkeleton fields={5} />;

  return (
    <div className="w-full bg-[#F4F8FB] text-[#0F172A] antialiased selection:bg-[#00B4A6]/15 selection:text-[#0D9488] flex flex-col justify-center">
      {/* Main Centered Container */}
      <div className="w-full mx-auto ">
        {/* Top Header */}
        <header>
          <h1 className="text-[26px] sm:text-[28px] font-bold tracking-[-0.02em] text-[#0F172A] leading-tight">
            Profile Settings
          </h1>
          <p className="text-[14px] text-[#475569] mt-1 font-normal">
            Manage your account settings
          </p>
        </header>
        {profileError && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {profileError}
          </div>
        )}

        {/* Main Two-Column Split Layout */}
        <div className="mt-7 flex flex-col sm:flex-row items-start gap-6 sm:gap-7">
          {/* Left Vertical Navigation Tabs */}
          <nav
            aria-label="Account settings sections"
            className="w-full sm:w-[210px] shrink-0 flex sm:flex-col gap-1.5 overflow-x-auto pb-1 sm:pb-0"
          >
            {NAV_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-all cursor-pointer whitespace-nowrap sm:w-full text-left ${
                    isActive
                      ? "bg-[#E6F8F6] text-[#0D9488] font-semibold shadow-[0_1px_2px_rgba(13,148,136,0.06)]"
                      : "bg-white/65 hover:bg-white text-[#475569] hover:text-[#0F172A] font-medium"
                  }`}
                >
                  {/* Left 3px vertical teal accent bar on active tab */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#00B4A6]"
                    />
                  )}

                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      isActive
                        ? "text-[#00B4A6] stroke-[2.2]"
                        : "text-[#475569] group-hover:text-[#0F172A] stroke-[1.9]"
                    }`}
                  />
                  <span>{tab.label}</span>

                  {/* Subtle bottom teal underline accent on active tab */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 right-3 bottom-0 h-[2px] rounded-full bg-[#00B4A6]/35"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Settings Card */}
          <main className="w-full flex-1 bg-white rounded-2xl border border-[#E2E8F0]/60 shadow-[0_4px_20px_rgba(15,23,42,0.035)] p-7 sm:p-8">
            {activeTab === "profile" && (
              <div>
                {/* Centered Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="relative inline-block">
                    <div className="rounded-full ring-4 ring-[#F8FAFC] shadow-sm">
                      <OmarSamirPortrait customImageUrl={avatarUrl} />
                    </div>

                    {/* Hidden File Input for Avatar Upload */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    {/* Overlapping Dark Navy Circular Camera Badge */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      title="Change profile photo"
                      aria-label="Change profile photo"
                      className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#0B2942] hover:bg-[#103859] active:scale-95 text-white flex items-center justify-center shadow-md ring-2 ring-white transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
                    >
                      {uploadingImage ? (
                        <LoadingSpinner className="h-4 w-4" />
                      ) : (
                        <Camera className="w-4 h-4 stroke-[2.1]" />
                      )}
                    </button>
                  </div>

                  {/* User Name & Role Pill Badge */}
                  <h2 className="mt-4 text-xl font-bold text-[#0F172A] tracking-[-0.01em] text-center">
                    {displayedName}
                  </h2>

                  <span className="mt-1.5 inline-flex items-center justify-center bg-[#D1FAE5] text-[#059669] text-xs font-semibold px-4 py-1 rounded-full leading-none">
                    {role}
                  </span>
                </div>

                {/* Profile Form Fields */}
                <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="profile-full-name"
                      className="block text-xs font-semibold text-slate-600 mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-full-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-email"
                      className="block text-xs font-semibold text-slate-600 mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00B4A6] to-[#00A396] hover:from-[#009E91] hover:to-[#008F83] active:scale-[0.995] text-white font-semibold text-sm shadow-md shadow-teal-500/20 transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70 inline-flex items-center justify-center gap-2"
                    >
                      {savingProfile && <LoadingSpinner className="h-4 w-4" />}
                      {savingProfile ? "Updating..." : "Update Profile"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] text-[#0D9488] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Security &amp; Password
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Update your password and two-factor authentication
                    </p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        autoComplete="current-password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Extra security layer for your Admin account
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled((v) => !v)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                        twoFactorEnabled ? "bg-[#00B4A6]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00B4A6] to-[#00A396] hover:from-[#009E91] hover:to-[#008F83] text-white font-semibold text-sm shadow-md shadow-teal-500/20 transition-all cursor-pointer disabled:cursor-wait disabled:opacity-70"
                  >
                    {savingPassword ? "Changing Password..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] text-[#0D9488] flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Notification Preferences
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Choose how you receive TaskPro updates
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      title: "Email Notifications",
                      desc: "Receive task assignments and status updates via email",
                      icon: Mail,
                      checked: emailAlerts,
                      toggle: () => setEmailAlerts((v) => !v),
                    },
                    {
                      title: "Push Notifications",
                      desc: "Instant browser alerts for overdue and high-priority tasks",
                      icon: Smartphone,
                      checked: pushAlerts,
                      toggle: () => setPushAlerts((v) => !v),
                    },
                    {
                      title: "Weekly Summary Digest",
                      desc: "Receive a weekly performance overview every Monday",
                      icon: Bell,
                      checked: weeklyDigest,
                      toggle: () => setWeeklyDigest((v) => !v),
                    },
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/60"
                      >
                        <div className="flex items-start gap-3">
                          <ItemIcon className="w-4 h-4 text-[#0D9488] mt-0.5 shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-[#0F172A]">
                              {item.title}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={item.toggle}
                          className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 cursor-pointer ${
                            item.checked ? "bg-[#00B4A6]" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                              item.checked ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        notifySuccess("Notification preferences saved.")
                      }
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00B4A6] to-[#00A396] hover:from-[#009E91] hover:to-[#008F83] text-white font-semibold text-sm shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                    >
                      Save Notifications
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "integrations" && (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] text-[#0D9488] flex items-center justify-center">
                    <Blocks className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Connected Integrations
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Sync TaskPro with your external workspace tools
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    {
                      name: "Slack Workspace",
                      status: "Connected",
                      badgeStyle: "bg-[#D1FAE5] text-[#059669]",
                    },
                    {
                      name: "Google Calendar",
                      status: "Connected",
                      badgeStyle: "bg-[#D1FAE5] text-[#059669]",
                    },
                    {
                      name: "GitHub Issues",
                      status: "Available",
                      badgeStyle: "bg-slate-100 text-slate-600",
                    },
                  ].map((app) => (
                    <div
                      key={app.name}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80"
                    >
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {app.name}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${app.badgeStyle}`}
                      >
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div>
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F8F6] text-[#0D9488] flex items-center justify-center">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#0F172A]">
                      Workspace Preferences
                    </h2>
                    <p className="text-xs text-[#64748B]">
                      Customize regional and display settings
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Language
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-teal-500 outline-none"
                      >
                        <option>English (US)</option>
                        <option>Arabic (العربية)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 bg-white focus:border-teal-500 outline-none"
                    >
                      <option>Africa/Cairo (UTC+02:00)</option>
                      <option>UTC (GMT+00:00)</option>
                      <option>America/New_York (UTC-05:00)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-4 h-4 text-[#0D9488]" />
                      <span className="text-sm font-semibold text-[#0F172A]">
                        Compact Table Density
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCompactView((v) => !v)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer ${
                        compactView ? "bg-[#00B4A6]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          compactView ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      notifySuccess("Workspace preferences saved.")
                    }
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00B4A6] to-[#00A396] hover:from-[#009E91] hover:to-[#008F83] text-white font-semibold text-sm shadow-md shadow-teal-500/20 transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  );
}
