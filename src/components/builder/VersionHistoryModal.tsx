import React, { useState } from "react";
import { X, History, RotateCcw, Plus, Bookmark, Clock, Check } from "lucide-react";
import type { Snapshot } from "./types";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: Snapshot[];
  onSaveSnapshot: (name: string) => void;
  onRestoreSnapshot: (snapshot: Snapshot) => void;
}

export function VersionHistoryModal({
  isOpen,
  onClose,
  snapshots,
  onSaveSnapshot,
  onRestoreSnapshot,
}: VersionHistoryModalProps) {
  const [snapshotName, setSnapshotName] = useState("");
  const [restoredId, setRestoredId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) return;
    onSaveSnapshot(snapshotName.trim());
    setSnapshotName("");
  };

  const handleRestore = (snap: Snapshot) => {
    onRestoreSnapshot(snap);
    setRestoredId(snap.id);
    setTimeout(() => setRestoredId(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <History size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Version History & Checkpoints
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
                  {snapshots.length} Saved
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Save milestones of your project and restore anytime with zero data loss.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Create Checkpoint Form */}
        <div className="p-4 border-b border-stone-800 bg-[#161413]">
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 'Before hero redesign' or 'Final client draft'..."
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              disabled={!snapshotName.trim()}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
            >
              <Bookmark size={14} />
              <span>Save Version</span>
            </button>
          </form>
        </div>

        {/* Snapshots List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-2.5 bg-[#121110]">
          {snapshots.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs">
              No saved versions yet. Type a note above and click "Save Version" to create your first checkpoint.
            </div>
          ) : (
            snapshots.map((snap) => (
              <div
                key={snap.id}
                className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 flex items-center justify-between transition"
              >
                <div>
                  <div className="font-bold text-xs text-stone-200 flex items-center gap-2">
                    <span>{snap.name}</span>
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-800 px-1.5 py-0.5 rounded">
                      {snap.pages.length} {snap.pages.length === 1 ? "page" : "pages"}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                    <Clock size={11} />
                    <span>{new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {new Date(snap.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestore(snap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    restoredId === snap.id
                      ? "bg-emerald-600 text-white"
                      : "bg-stone-800 hover:bg-orange-600 text-stone-300 hover:text-white"
                  }`}
                >
                  {restoredId === snap.id ? <Check size={13} /> : <RotateCcw size={13} />}
                  <span>{restoredId === snap.id ? "Restored!" : "Restore"}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
