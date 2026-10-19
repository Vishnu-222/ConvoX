import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, LoaderCircle, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import useChatStore from "../store/useChatStore";

function DeleteConversationModal({ partner, onClose }) {
  const deleteConversation = useChatStore((state) => state.deleteConversation);

  const [isDeleting, setIsDeleting] = useState(false);

  // Close the modal with Escape without closing the chat behind it.
  useEffect(() => {
    if (!partner) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [partner, isDeleting, onClose]);

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      await deleteConversation(partner._id);
      onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete conversation. Please try again.",
      );
      setIsDeleting(false);
    }
  };

  if (!partner) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-conversation-title"
        aria-describedby="delete-conversation-description"
        className="w-full max-w-md rounded-2xl border border-cyan-500/20 bg-slate-900 p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertTriangle size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="delete-conversation-title"
              className="text-lg font-semibold text-slate-100"
            >
              Delete conversation?
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Conversation with{" "}
              <span className="font-medium text-cyan-300">
                {partner.fullName}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            aria-label="Close confirmation"
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <p
          id="delete-conversation-description"
          className="mb-6 text-sm leading-6 text-slate-300"
        >
          All messages exchanged between you and {partner.fullName} will be
          permanently deleted for both participants. This action cannot be
          undone.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <LoaderCircle size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete conversation
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default DeleteConversationModal;
