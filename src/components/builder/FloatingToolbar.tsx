import React, { useState, useRef, useEffect } from "react";
import {
  MousePointer2,
  Type,
  Pencil,
  MessageSquare,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Square,
  Columns3,
  AlignLeft,
  MousePointerClick,
  Image as ImageIcon,
  Minus,
  Upload,
  Layers,
  StickyNote,
  Sparkles,
  Heading,
  LayoutGrid,
  Palette,
} from "lucide-react";
import type { NodeType } from "./types";

interface FloatingToolbarProps {
  activeTool: "select" | "text" | "pen" | "comment";
  setActiveTool: (tool: "select" | "text" | "pen" | "comment") => void;
  onAddNode: (type: NodeType) => void;
  onAddStickyNote: () => void;
  onOpenUpload: () => void;
  onToggleLayers: () => void;
  showLayers: boolean;
  onTogglePenOverlay: () => void;
  isPenActive: boolean;
  onOpenAi: () => void;
  onOpenTemplates?: () => void;
  onOpenTheme?: () => void;
}

export function FloatingToolbar({
  activeTool,
  setActiveTool,
  onAddNode,
  onAddStickyNote,
  onOpenUpload,
  onToggleLayers,
  showLayers,
  onTogglePenOverlay,
  isPenActive,
  onOpenAi,
  onOpenTemplates,
  onOpenTheme,
}: FloatingToolbarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const textMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
      if (textMenuRef.current && !textMenuRef.current.contains(e.target as Node)) {
        setShowTextMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const elementsList: { type: NodeType; label: string; icon: React.ElementType }[] = [
    { type: "section", label: "Section", icon: Square },
    { type: "container", label: "Row / Box", icon: Columns3 },
    { type: "heading", label: "Heading", icon: Heading },
    { type: "text", label: "Paragraph", icon: AlignLeft },
    { type: "button", label: "Button", icon: MousePointerClick },
    { type: "image", label: "Image", icon: ImageIcon },
    { type: "divider", label: "Divider", icon: Minus },
  ];

  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
      {/* "MORE (•••)" Popover Menu */}
      {showMoreMenu && (
        <div
          ref={moreMenuRef}
          className="mb-3 w-64 bg-[#1c1917]/95 backdrop-blur-md border border-[#3c3836] rounded-2xl shadow-2xl p-2 text-stone-200 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-800">
            Insert Blocks & Tools
          </div>

          <div className="grid grid-cols-2 gap-1 py-1.5">
            {elementsList.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAddNode(type);
                  setShowMoreMenu(false);
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition text-left"
              >
                <Icon size={14} className="text-orange-400 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-stone-800 pt-1.5 space-y-1">
            <button
              type="button"
              onClick={() => {
                onOpenUpload();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-orange-400 hover:bg-orange-500/10 transition"
            >
              <div className="flex items-center gap-2">
                <Upload size={14} />
                <span>Upload Code / ZIP</span>
              </div>
              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded">.zip/.html</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleLayers();
                setShowMoreMenu(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                showLayers ? "bg-stone-800 text-white" : "text-stone-300 hover:text-white hover:bg-stone-800/80"
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-stone-400" />
                <span>Page Layers Tree</span>
              </div>
              <span className="text-[10px] text-stone-500">Tree view</span>
            </button>

            {onOpenTemplates && (
              <button
                type="button"
                onClick={() => {
                  onOpenTemplates();
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition"
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid size={14} className="text-orange-400" />
                  <span>Section Templates Library</span>
                </div>
                <span className="text-[10px] text-stone-500">7 Ready</span>
              </button>
            )}

            {onOpenTheme && (
              <button
                type="button"
                onClick={() => {
                  onOpenTheme();
                  setShowMoreMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800/80 transition"
              >
                <div className="flex items-center gap-2">
                  <Palette size={14} className="text-cyan-400" />
                  <span>Themes & Google Fonts</span>
                </div>
                <span className="text-[10px] text-stone-500">Global</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onOpenAi();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-amber-400 hover:bg-amber-500/10 transition"
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} />
                <span>Gemini AI Super Studio</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">AI</span>
            </button>
          </div>
        </div>
      )}

      {/* "TEXT (T)" Quick Menu */}
      {showTextMenu && (
        <div
          ref={textMenuRef}
          className="mb-3 bg-[#1c1917]/95 backdrop-blur-md border border-[#3c3836] rounded-xl shadow-2xl p-1.5 flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <button
            type="button"
            onClick={() => {
              onAddNode("heading");
              setShowTextMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-200 hover:bg-stone-800 hover:text-orange-400 transition"
          >
            <Heading size={13} />
            Heading
          </button>
          <button
            type="button"
            onClick={() => {
              onAddNode("text");
              setShowTextMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-200 hover:bg-stone-800 hover:text-orange-400 transition"
          >
            <AlignLeft size={13} />
            Paragraph
          </button>
        </div>
      )}

      {/* Pill-Shaped Floating Toolbar (Matching user's image) */}
      <div
        className="flex items-center bg-[#18181b]/95 backdrop-blur-md border border-stone-800/90 rounded-full px-2 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] transition-all duration-200"
        style={{ minHeight: "44px" }}
      >
        {!collapsed ? (
          <>
            {/* 1. Selection / Cursor Tool */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("select");
                if (isPenActive) onTogglePenOverlay();
              }}
              title="Select / Pointer Tool"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                activeTool === "select" && !isPenActive
                  ? "bg-stone-800 text-orange-400 shadow-sm"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
              }`}
            >
              <div className="relative">
                <MousePointer2 size={16} />
              </div>
            </button>

            {/* 2. Text Tool (T) */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("text");
                setShowTextMenu(!showTextMenu);
              }}
              title="Add Text or Heading"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all font-serif font-bold text-sm ${
                activeTool === "text" || showTextMenu
                  ? "bg-stone-800 text-orange-400"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
              }`}
            >
              <span className="font-sans font-semibold text-base leading-none">T</span>
            </button>

            {/* 3. Pen / Draw Tool */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("pen");
                onTogglePenOverlay();
              }}
              title="Draw / Doodle Overlay"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isPenActive
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
              }`}
            >
              <Pencil size={15} />
            </button>

            {/* 4. Comment / Sticky Note Tool */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("comment");
                onAddStickyNote();
              }}
              title="Add Sticky Note / Comment Callout"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                activeTool === "comment"
                  ? "bg-stone-800 text-orange-400"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
              }`}
            >
              <MessageSquare size={15} />
            </button>

            {/* 5. AI Assistant Tool */}
            <button
              type="button"
              onClick={onOpenAi}
              title="Gemini AI (Change selected element or generate section)"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all text-amber-400 hover:text-amber-300 hover:bg-stone-800/80"
            >
              <Sparkles size={16} />
            </button>

            {/* Divider line */}
            <div className="w-[1px] h-4 bg-stone-700/80 mx-1.5" />

            {/* 5. More Options (•••) */}
            <button
              type="button"
              onClick={() => {
                setShowMoreMenu(!showMoreMenu);
                setShowTextMenu(false);
              }}
              title="More Elements & Tools"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                showMoreMenu
                  ? "bg-stone-800 text-orange-400"
                  : "text-stone-400 hover:text-stone-100 hover:bg-stone-800/60"
              }`}
            >
              <MoreHorizontal size={17} />
            </button>

            {/* 6. Collapse Arrow (>) */}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              title="Minimize Toolbar"
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-200 hover:bg-stone-800/60 transition"
            >
              <ChevronRight size={15} />
            </button>
          </>
        ) : (
          /* Collapsed Mini Pill */
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            title="Expand Toolbar"
            className="flex items-center gap-1.5 px-3 py-1 text-xs text-stone-400 hover:text-stone-100 transition"
          >
            <Sparkles size={14} className="text-orange-400" />
            <span className="font-medium">Tools</span>
            <ChevronLeft size={14} className="rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
