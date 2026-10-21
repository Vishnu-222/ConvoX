import { useEffect, useRef, useState } from "react";
import {LogOutIcon, Volume2Icon, VolumeOffIcon, PencilIcon, XIcon } from "lucide-react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import useAuthStore from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { user, logout, updateProfile, updateFullName } = useAuthStore();

  const { isSoundEnabled, toggleSound, onlineUsers } = useChatStore();

  const userId = String(user?._id || user?.id || "");
  const isOnline = onlineUsers.includes(userId);

  const navigate = useNavigate();

  const [selectedImg, setSelectedImg] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Full-name editor state
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [editedFullName, setEditedFullName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);

  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);

  // Focus the name input and support Escape when the modal opens.
  useEffect(() => {
    if (!isNameModalOpen) return;

    nameInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isUpdatingName) {
        setIsNameModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNameModalOpen, isUpdatingName]);

  // Open the editor with the current name.
  const handleOpenNameModal = () => {
    setEditedFullName(user?.fullName || "");
    setIsNameModalOpen(true);
  };

  // Save the updated full name.
  const handleNameUpdate = async (event) => {
    event.preventDefault();

    const fullName = editedFullName.trim().replace(/\s+/g, " ");

    if (fullName.length < 2) {
      toast.error("Name must contain at least 2 characters.");
      return;
    }

    if (fullName.length > 50) {
      toast.error("Name cannot exceed 50 characters.");
      return;
    }

    // Avoid unnecessary API requests if the name hasn't changed.
    if (fullName === user?.fullName) {
      setIsNameModalOpen(false);
      return;
    }

    try {
      setIsUpdatingName(true);

      await updateFullName(fullName);

      setIsNameModalOpen(false);
      toast.success("Name updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update your name.",
      );
    } finally {
      setIsUpdatingName(false);
    }
  };

  // PROFILE IMAGE UPLOAD
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;

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

        setSelectedImg(null);

        toast.error(
          error.response?.data?.message || "Failed to update profile picture.",
        );
      } finally {
        setIsUpdatingProfile(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read the image.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsDataURL(file);
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout();

      toast.success("Logged out successfully.");
      navigate("/login");
    } catch {
      toast.error("Failed to logout.");
    }
  };

  return (
    <>
      <div className="border-b border-slate-700/50 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          {/* PROFILE */}
          <div className="flex min-w-0 items-center gap-3">
            {/* AVATAR */}
            <div className={`avatar shrink-0 ${isOnline ? "online" : ""}`}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdatingProfile}
                aria-label="Change profile picture"
                className="group relative size-12 overflow-hidden rounded-full sm:size-14"
              >
                <img
                  src={selectedImg || user?.profilePic || "/avatar.png"}
                  alt={user?.fullName || "User"}
                  className="size-full object-cover"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="text-xs text-white">
                    {isUpdatingProfile ? "Uploading..." : "Change"}
                  </span>
                </div>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Choose profile picture"
              />
            </div>

            {/* USER INFO */}
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1">
                <h3 className="max-w-[140px] truncate text-sm font-medium text-slate-200 sm:max-w-[180px] sm:text-base">
                  {user?.fullName || "User"}
                </h3>

                <button
                  type="button"
                  onClick={handleOpenNameModal}
                  aria-label="Edit your name"
                  title="Edit name"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <PencilIcon className="size-4" />
                </button>
              </div>

              <p
                className={`text-xs ${
                  isOnline ? "text-green-400" : "text-slate-400"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200"
            >
              <LogOutIcon className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                toggleSound();

                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch(() => {});
              }}
              aria-label={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
              title={isSoundEnabled ? "Disable sounds" : "Enable sounds"}
              className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-slate-200"
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

      {/* EDIT NAME MODAL */}
      {isNameModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isUpdatingName) {
                setIsNameModalOpen(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-name-title"
              className="my-auto w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900 p-5 shadow-2xl shadow-black/30 sm:p-6"
            >
              {/* MODAL HEADER */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="edit-name-title"
                    className="text-lg font-semibold text-slate-100"
                  >
                    Edit your name
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Update how people see you on ConvoX.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(false)}
                  disabled={isUpdatingName}
                  aria-label="Close edit name dialog"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* NAME FORM */}
              <form onSubmit={handleNameUpdate}>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <input
                  ref={nameInputRef}
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={50}
                  required
                  value={editedFullName}
                  onChange={(event) => setEditedFullName(event.target.value)}
                  placeholder="Enter your full name"
                  disabled={isUpdatingName}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-base text-slate-100 outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Use between 2 and 50 characters.
                </p>

                {/* MODAL ACTIONS */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setIsNameModalOpen(false)}
                    disabled={isUpdatingName}
                    className="min-h-11 rounded-xl border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      isUpdatingName ||
                      editedFullName.trim().replace(/\s+/g, " ").length < 2 ||
                      editedFullName.trim().replace(/\s+/g, " ").length > 50
                    }
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdatingName ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}

export default ProfileHeader;
