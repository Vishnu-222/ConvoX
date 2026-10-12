
function ActiveTabSwitch({ activeTab, onTabChange }) {
    const baseTabStyles =
        "flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200";

    const getTabStyles = (tab) =>
        activeTab === tab
            ? "bg-cyan-500/15 text-cyan-300 ring-1 ring-inset ring-cyan-400/30 shadow-sm shadow-cyan-950/30"
            : "bg-transparent text-slate-400 hover:bg-slate-700/50 hover:text-slate-200";

    return (
        <div className="mx-3 my-2 flex gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 p-1.5">
            <button
                type="button"
                role="tab"
                aria-selected={activeTab === "chats"}
                onClick={() => onTabChange("chats")}
                className={`${baseTabStyles} ${getTabStyles("chats")}`}
            >
                Chats
            </button>

            <button
                type="button"
                role="tab"
                aria-selected={activeTab === "contacts"}
                onClick={() => onTabChange("contacts")}
                className={`${baseTabStyles} ${getTabStyles("contacts")}`}
            >
                Contacts
            </button>
        </div>
    );
}

export default ActiveTabSwitch;
