import React, { useState } from "react";
import {
  X,
  FileText,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Search,
  Check,
} from "lucide-react";
import type { BNode } from "./types";

export interface SitePage {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  root: BNode;
}

interface PageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: SitePage[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onCreatePage: (name: string, slug: string) => void;
  onDeletePage: (id: string) => void;
  onUpdateSeo: (id: string, title: string, description: string) => void;
}

export function PageManagerModal({
  isOpen,
  onClose,
  pages,
  activePageId,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  onUpdateSeo,
}: PageManagerModalProps) {
  const [newPageName, setNewPageName] = useState("");
  const [newPageSlug, setNewPageSlug] = useState("");
  const [editingSeoId, setEditingSeoId] = useState<string | null>(activePageId);

  const activePage = pages.find((p) => p.id === (editingSeoId || activePageId)) || pages[0];
  const [seoTitle, setSeoTitle] = useState(activePage?.title || "");
  const [seoDesc, setSeoDesc] = useState(activePage?.description || "");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;
    const slug = newPageSlug.trim() || `/${newPageName.toLowerCase().replace(/\s+/g, "-")}`;
    onCreatePage(newPageName.trim(), slug);
    setNewPageName("");
    setNewPageSlug("");
  };

  const handleSaveSeo = () => {
    if (activePage) {
      onUpdateSeo(activePage.id, seoTitle, seoDesc);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Multi-Page Website & SEO Manager
              </h3>
              <p className="text-xs text-stone-400">
                Manage multiple website pages, routes, and individual SEO meta tags.
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

        <div className="flex flex-1 overflow-hidden">
          {/* Left Pages List */}
          <div className="w-72 border-r border-[#3c3836] p-4 flex flex-col justify-between bg-[#171514] overflow-y-auto">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Site Pages ({pages.length})
              </div>
              <div className="space-y-1.5 mb-4">
                {pages.map((p) => {
                  const isActive = p.id === activePageId;
                  const isEditing = p.id === editingSeoId;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                        isActive
                          ? "bg-orange-500/15 border-orange-500 text-orange-300 font-semibold"
                          : isEditing
                          ? "bg-stone-800 border-stone-700 text-stone-200"
                          : "bg-stone-900 border-stone-800/80 text-stone-400 hover:bg-stone-800"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectPage(p.id);
                          setEditingSeoId(p.id);
                          setSeoTitle(p.title);
                          setSeoDesc(p.description);
                        }}
                        className="flex-1 text-left truncate mr-2"
                      >
                        <div className="font-medium text-stone-200 truncate">{p.name}</div>
                        <div className="font-mono text-[10px] text-stone-500">{p.slug}</div>
                      </button>

                      {pages.length > 1 && p.slug !== "/" && (
                        <button
                          type="button"
                          onClick={() => onDeletePage(p.id)}
                          className="p-1 text-stone-500 hover:text-red-400 transition"
                          title="Delete page"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Create Page Form */}
            <form onSubmit={handleCreate} className="pt-3 border-t border-stone-800 space-y-2">
              <span className="text-[11px] font-semibold text-stone-300 block">
                + Add New Page
              </span>
              <input
                type="text"
                placeholder="e.g. About Us"
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-500"
              />
              <button
                type="submit"
                disabled={!newPageName.trim()}
                className="w-full py-1.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Plus size={13} />
                <span>Create Page</span>
              </button>
            </form>
          </div>

          {/* Right SEO & Settings */}
          <div className="flex-1 p-6 bg-[#141210] overflow-y-auto space-y-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-stone-200 flex items-center gap-2">
                  <Search size={15} className="text-orange-400" />
                  <span>SEO & Meta Settings for "{activePage?.name}"</span>
                </h4>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-900 px-2 py-0.5 rounded">
                  Route: {activePage?.slug}
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-4">
                These tags will appear in Google Search and social media previews (WhatsApp, Twitter/X, Facebook) when sharing this page.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Page Title (&lt;title&gt;)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="e.g. About Us — Crafting Modern Digital Experiences"
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  placeholder="e.g. Learn more about our mission, team, and the tools we use to empower creators worldwide."
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl p-3 text-xs text-stone-200"
                />
              </div>

              {/* Google Search Preview */}
              <div className="p-3.5 rounded-xl bg-stone-900/90 border border-stone-800">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block mb-2">
                  Google Search Snippet Preview
                </span>
                <div className="text-xs text-blue-400 font-medium hover:underline truncate">
                  {seoTitle || "My Awesome Website"}
                </div>
                <div className="text-[11px] text-emerald-500 font-mono my-0.5">
                  https://mysite.com{activePage?.slug}
                </div>
                <div className="text-[11px] text-stone-400 line-clamp-2">
                  {seoDesc || "No meta description set yet. Search engines will extract random snippets from the page."}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveSeo}
                  className="py-2 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Check size={14} />
                  <span>Save SEO Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
