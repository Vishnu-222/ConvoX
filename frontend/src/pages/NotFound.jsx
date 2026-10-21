
import { Link } from "react-router";
import {
  MessageCircleIcon,
  SparklesIcon,
  CircleHelpIcon,
} from "lucide-react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";

function NotFound() {
  return (
    <div className="relative z-10 flex w-full items-center justify-center px-4 py-8">
      <div className="relative h-auto min-h-[540px] w-full max-w-5xl md:h-[560px]">
        <BorderAnimatedContainer>
          <div className="flex w-full flex-col md:flex-row">
            {/* LEFT SIDE - ERROR MESSAGE */}
            <div className="flex items-center justify-center p-8 md:w-1/2 md:border-r border-slate-600/30 md:p-12">
              <div className="w-full max-w-md">
                {/* ICON */}
                <div className="mb-8 flex items-center justify-center md:justify-start">
                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 shadow-lg shadow-cyan-500/5">
                    <CircleHelpIcon className="h-9 w-9 text-cyan-400" />
                  </div>
                </div>

                {/* ERROR CODE */}
                <p className="mb-3 text-sm font-semibold tracking-[0.3em] text-cyan-400">
                  ERROR 404
                </p>

                <h1 className="mb-4 text-4xl font-bold leading-tight text-slate-100 md:text-5xl">
                  Oops! Wrong
                  <span className="block text-cyan-400">conversation.</span>
                </h1>

                <p className="mb-8 max-w-sm leading-7 text-slate-400">
                  Looks like this page got lost in the chat.
                  The link might be broken, or the page may
                  have moved somewhere else.
                </p>

                {/* ACTIONS */}
                <div className="space-y-4">
                  <Link
                    to="/login"
                    className="auth-btn flex items-center justify-center gap-2"
                  >
                    <MessageCircleIcon size={18} />
                    Back to ConvoX
                  </Link>

                  <div className="text-center">
                    <Link
                      to="/signup"
                      className="auth-link inline-flex items-center gap-2"
                    >
                      Create an account
                    </Link>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-10 flex items-center gap-2 text-xs text-slate-500">
                  <SparklesIcon size={14} className="text-cyan-500" />
                  <span>Your conversations are waiting for you.</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - CHAT-THEMED VISUAL */}
            <div className="relative hidden overflow-hidden bg-gradient-to-bl from-slate-800/30 to-transparent p-8 md:flex md:w-1/2 md:items-center md:justify-center">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative w-full max-w-sm">
                {/* Brand icon */}
                <div className="mb-10 flex items-center justify-center gap-3">
                  <div className="rounded-xl border border-cyan-400/20 bg-slate-800/80 p-3">
                    <MessageCircleIcon className="h-7 w-7 text-cyan-400" />
                  </div>
                  <span className="text-2xl font-bold tracking-wide text-slate-100">
                    Convo<span className="text-cyan-400">X</span>
                  </span>
                </div>

                {/* Fake chat window */}
                <div className="rounded-2xl border border-slate-600/40 bg-slate-900/60 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
                  <div className="mb-5 flex items-center gap-3 border-b border-slate-700/60 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
                      <MessageCircleIcon className="h-5 w-5 text-cyan-400" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-200">
                        Your next conversation
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Just a click away
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-700/50 bg-slate-800/90 px-4 py-3">
                      <p className="text-sm text-slate-300">
                        Hey! Where are you?
                      </p>
                    </div>

                    <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm border border-cyan-400/20 bg-cyan-500/10 px-4 py-3">
                      <p className="text-sm text-cyan-100">
                        Somewhere off the map...
                      </p>
                    </div>

                    <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-700/50 bg-slate-800/90 px-4 py-3">
                      <p className="text-sm text-slate-300">
                        Let's find our way back!
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t border-slate-700/60 pt-4">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    <span className="text-xs text-slate-500">
                      Reconnecting with your people...
                    </span>
                  </div>
                </div>

                {/* 404 number */}
                <div className="mt-8 text-center">
                  <span className="select-none text-6xl font-black tracking-widest text-slate-700/60">
                    404
                  </span>
                  <p className="mt-1 text-sm text-slate-500">
                    Not every link leads somewhere.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default NotFound;
