import React from "react";
import { X, Layers as LayersIcon } from "lucide-react";
import type { BNode } from "./types";

interface LayersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rootNode: BNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function LayersDrawer({ isOpen, onClose, rootNode, selectedId, onSelect }: LayersDrawerProps) {
  if (!isOpen) return null;

  const LayerItem = ({ n, depth }: { n: BNode; depth: number }) => (
    <div className="flex flex-col">
      <button
        onClick={() => onSelect(n.id)}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
        className={`w-full flex items-center gap-2 py-2 pr-3 text-left text-xs transition border-b border-stone-800/40 ${
          selectedId === n.id
            ? "bg-orange-500/15 text-orange-400 font-semibold"
            : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
        }`}
      >
        <span className="px-1.5 py-0.5 rounded bg-stone-800 text-[10px] uppercase font-mono font-bold text-stone-300">
          {n.id === "root" ? "page" : n.type}
        </span>
        <span className="truncate text-stone-300 font-medium">
          {n.text ? `"${n.text}"` : n.id}
        </span>
      </button>
      {n.children?.map((c) => (
        <LayerItem key={c.id} n={c} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="fixed top-16 left-6 z-40 w-72 bg-[#1c1917]/95 backdrop-blur-md border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in slide-in-from-left-2 duration-150">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-[#221f1d]">
        <div className="flex items-center gap-2 text-stone-200 font-semibold text-xs">
          <LayersIcon size={14} className="text-orange-400" />
          <span>Page Element Layers</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
        >
          <X size={14} />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 py-1">
        <LayerItem n={rootNode} depth={0} />
      </div>
    </div>
  );
}
