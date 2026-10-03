import React, { useState } from "react";
import {
  X,
  LayoutGrid,
  Compass,
  Rocket,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Mail,
  PanelBottom,
  Plus,
  Sparkles,
} from "lucide-react";
import { SECTION_TEMPLATES, type SectionTemplate } from "./templates";
import type { BNode } from "./types";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTemplate: (sectionNode: BNode) => void;
}

export function TemplateLibraryModal({
  isOpen,
  onClose,
  onInsertTemplate,
}: TemplateLibraryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Sections", icon: LayoutGrid },
    { id: "navbar", label: "Navbars", icon: Compass },
    { id: "hero", label: "Hero Headers", icon: Rocket },
    { id: "features", label: "Features", icon: CheckCircle2 },
    { id: "pricing", label: "Pricing Tables", icon: DollarSign },
    { id: "faq", label: "FAQ Accordion", icon: HelpCircle },
    { id: "contact", label: "Contact Form", icon: Mail },
    { id: "footer", label: "Footers", icon: PanelBottom },
  ];

  const filtered = selectedCategory === "all"
    ? SECTION_TEMPLATES
    : SECTION_TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleSelect = (tmpl: SectionTemplate) => {
    const node = tmpl.generate();
    onInsertTemplate(node);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <LayoutGrid size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Ready-Made Section Templates
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
                  1-Click Insert
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Choose a pre-styled modern section to drop directly onto your canvas.
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

        {/* Content Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Category Sidebar */}
          <div className="w-52 border-r border-[#3c3836] p-3 space-y-1 bg-[#171514] shrink-0 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Categories
            </div>
            {categories.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedCategory(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                  selectedCategory === id
                    ? "bg-orange-500/15 text-orange-400 font-semibold"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-800/60"
                }`}
              >
                <Icon size={14} className={selectedCategory === id ? "text-orange-400" : "text-stone-500"} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Right Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#141210]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="group bg-[#1c1917] border border-stone-800 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/50"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-mono uppercase tracking-wider text-stone-300 font-bold">
                        {tmpl.category}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Sparkles size={11} className="text-orange-400" />
                        Production ready
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-100 group-hover:text-orange-400 transition mb-1">
                      {tmpl.title}
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed mb-4">
                      {tmpl.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(tmpl)}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-orange-600 text-stone-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition duration-150"
                  >
                    <Plus size={14} />
                    <span>Insert Section</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
