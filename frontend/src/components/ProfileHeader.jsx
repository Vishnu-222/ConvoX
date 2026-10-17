import { useRef, useState } from "react";
import { LogOutIcon, Volume2Icon, VolumeOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { user, logout, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound, onlineUsers } = useChatStore();

  const userId = String(user?._id || user?.id || "");
  const isOnline = onlineUsers.includes(userId);

  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const fileInputRef = useRef(null);

  // PROFILE IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Only allow image files
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Limit profile image size to 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;

        // Show selected image immediately
        setSelectedImg(base64Image);
        setIsUpdatingProfile(true);

        await updateProfile({
          profilePic: base64Image,
        });

        toast.success("Profile picture updated successfully.");
      } catch (error) {
        console.error(
          "Profile picture update failed:",
          error.response?.data?.message || error.message,
        );

        // Revert preview if upload fails
        setSelectedImg(null);

        toast.error(
          error.response?.data?.message || "Failed to update profile picture.",
        );
      } finally {
        setIsUpdatingProfile(false);

        // Allow selecting the same file again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the image.");
    };

    reader.readAsDataURL(file);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully.");

      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  // UI
  return (
    <div className="border-b border-slate-700/50 p-6">
      <div className="flex items-center justify-between">
        {/* PROFILE */}
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className={`avatar ${isOnline ? "online" : ""}`}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUpdatingProfile}
              className="group relative size-14 overflow-hidden rounded-full"
            >
              <img
                src={selectedImg || user?.profilePic || "/avatar.png"}
                alt={user?.fullName || "User"}
                className="size-full object-cover"
              />

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="text-xs text-white">
                  {isUpdatingProfile ? "Uploading..." : "Change"}
                </span>
              </div>
            </button>

            {/* HIDDEN FILE INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USER INFO */}
          <div>
            <h3 className="max-w-[180px] truncate text-base font-medium text-slate-200">
              {user?.fullName || "User"}
            </h3>

            <p className={`text-xs ${isOnline ? "text-green-400" : "text-slate-400"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex items-center gap-4">
          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-400 transition-colors hover:text-slate-200"
            title="Logout"
          >
            <LogOutIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE */}
          <button
            type="button"
            onClick={() => {
              toggleSound();

              mouseClickSound.currentTime = 0;
              mouseClickSound.play().catch(() => {});
            }}
            className="text-slate-400 transition-colors hover:text-slate-200"
            title={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
