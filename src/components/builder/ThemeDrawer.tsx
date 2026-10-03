import React, { useState } from "react";
import {
  X,
  Palette,
  Check,
  Type,
  Sparkles,
  Sliders,
  Paintbrush,
  Layers,
} from "lucide-react";
import { THEME_PRESETS, GOOGLE_FONTS, type ThemePreset } from "./themes";
import type { BNode } from "./types";

interface ThemeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  page: BNode;
  onApplyTheme: (preset: ThemePreset) => void;
  onApplyFont: (fontFamily: string) => void;
  onApplyPrimaryColor: (color: string) => void;
  currentFont: string;
  currentPrimaryColor: string;
}

export function ThemeDrawer({
  isOpen,
  onClose,
  page,
  onApplyTheme,
  onApplyFont,
  onApplyPrimaryColor,
  currentFont,
  currentPrimaryColor,
}: ThemeDrawerProps) {
  const [activeTab, setActiveTab] = useState<"themes" | "typography" | "colors">("themes");
  const [selectedThemeId, setSelectedThemeId] = useState<string>("modern-saas");

  if (!isOpen) return null;

  const colorPalettes = [
    { name: "Electric Orange", hex: "#f97316" },
    { name: "Vibrant Indigo", hex: "#6366f1" },
    { name: "Cyan Tech", hex: "#06b6d4" },
    { name: "Emerald Mint", hex: "#10b981" },
    { name: "Neon Purple", hex: "#a855f7" },
    { name: "Rose Crimson", hex: "#f43f5e" },
    { name: "Amber Gold", hex: "#f59e0b" },
    { name: "Pure Obsidian", hex: "#18181b" },
  ];

  return (
    <div className="fixed top-16 right-6 z-40 w-84 bg-[#1c1917]/95 backdrop-blur-md border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in slide-in-from-right-3 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-800 bg-[#221f1d]">
        <div className="flex items-center gap-2.5">
          <Palette size={16} className="text-orange-400" />
          <span className="text-xs font-bold text-stone-100 uppercase tracking-wide">
            Global Design & Themes
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition"
        >
          <X size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 bg-[#171514] px-3">
        <button
          type="button"
          onClick={() => setActiveTab("themes")}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
            activeTab === "themes"
              ? "border-orange-500 text-orange-400"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          1-Click Themes
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("typography")}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
            activeTab === "typography"
              ? "border-orange-500 text-orange-400"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          Google Fonts
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("colors")}
          className={`flex-1 py-2 text-center text-xs font-semibold border-b-2 transition ${
            activeTab === "colors"
              ? "border-orange-500 text-orange-400"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          Palette
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {activeTab === "themes" && (
          <div className="space-y-2.5">
            <p className="text-[11px] text-stone-400">
              Instantly re-theme your entire website's background, colors, typography, and card accents:
            </p>
            {THEME_PRESETS.map((preset) => {
              const isSelected = selectedThemeId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedThemeId(preset.id);
                    onApplyTheme(preset);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-orange-500/10 border-orange-500 shadow-md"
                      : "bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-100 flex items-center gap-1.5">
                      {preset.name}
                    </span>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.primaryColor }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: preset.backgroundColor }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    {preset.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-2">
            <p className="text-[11px] text-stone-400 mb-2">
              Apply popular Google Fonts globally across the entire canvas:
            </p>
            {GOOGLE_FONTS.map((font) => {
              const isSelected = currentFont === font.value;
              return (
                <button
                  key={font.name}
                  type="button"
                  onClick={() => onApplyFont(font.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs transition ${
                    isSelected
                      ? "bg-orange-500/15 border-orange-500 text-orange-300 font-semibold"
                      : "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800"
                  }`}
                  style={{ fontFamily: font.value }}
                >
                  <span className="text-sm">{font.name}</span>
                  {isSelected && <Check size={14} className="text-orange-400" />}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === "colors" && (
          <div className="space-y-3">
            <p className="text-[11px] text-stone-400">
              Select a primary accent color to sync across buttons, links, and badges:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {colorPalettes.map((c) => {
                const isSelected = currentPrimaryColor === c.hex;
                return (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => onApplyPrimaryColor(c.hex)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-stone-200 transition ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/15 font-semibold"
                        : "border-stone-800 bg-stone-900 hover:bg-stone-800"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
