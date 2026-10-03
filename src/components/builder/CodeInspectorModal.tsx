import React, { useState } from "react";
import { X, Code2, Copy, Check, Terminal, Eye, FileCode2 } from "lucide-react";
import { toHTML, type BNode } from "./types";

interface CodeInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: BNode | null;
  pageRoot: BNode;
  customCss: string;
  onUpdateCustomCss: (css: string) => void;
}

export function CodeInspectorModal({
  isOpen,
  onClose,
  selectedNode,
  pageRoot,
  customCss,
  onUpdateCustomCss,
}: CodeInspectorModalProps) {
  const [activeTab, setActiveTab] = useState<"element" | "full" | "customCss">(
    selectedNode ? "element" : "full"
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const elementHtml = selectedNode ? toHTML(selectedNode) : "";
  const fullHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Canvas Site</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; }
    ${customCss}
  </style>
</head>
<body>
${toHTML(pageRoot)}
</body>
</html>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <Code2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Live Code & Custom CSS Editor
                <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-medium">
                  Developer Mode
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Inspect generated semantic HTML/CSS, copy markup, or write custom CSS overrides.
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

        {/* Tab Bar */}
        <div className="flex items-center justify-between border-b border-[#3c3836] bg-[#191716] px-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("element")}
              disabled={!selectedNode}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === "element"
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : selectedNode
                  ? "border-transparent text-stone-400 hover:text-stone-200"
                  : "border-transparent text-stone-600 cursor-not-allowed"
              }`}
            >
              <Terminal size={14} />
              Selected Element Code
            </button>
            <button
              onClick={() => setActiveTab("full")}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === "full"
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <FileCode2 size={14} />
              Full Page HTML
            </button>
            <button
              onClick={() => setActiveTab("customCss")}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === "customCss"
                  ? "border-orange-500 text-orange-400 bg-orange-500/5"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <Code2 size={14} />
              Custom CSS Injector
            </button>
          </div>

          {activeTab !== "customCss" && (
            <button
              type="button"
              onClick={() => copyToClipboard(activeTab === "element" ? elementHtml : fullHtml)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
          )}
        </div>

        {/* Code Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#121110]">
          {activeTab === "element" && (
            <div>
              <div className="mb-2 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                <span>Tag: &lt;{selectedNode?.type}&gt; | ID: #{selectedNode?.id}</span>
                <span className="text-stone-500">Live generated HTML</span>
              </div>
              <pre className="p-4 bg-[#0a0a0c] border border-stone-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed select-all">
                {elementHtml}
              </pre>
            </div>
          )}

          {activeTab === "full" && (
            <div>
              <div className="mb-2 text-[11px] font-mono text-stone-400">
                Full standalone HTML document (ready for deployment):
              </div>
              <pre className="p-4 bg-[#0a0a0c] border border-stone-800 rounded-xl text-xs font-mono text-stone-300 overflow-x-auto leading-relaxed max-h-[50vh] select-all">
                {fullHtml}
              </pre>
            </div>
          )}

          {activeTab === "customCss" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-300">
                <span className="font-semibold">Write Custom CSS Styles (Live Injected):</span>
                <span className="text-[11px] text-stone-500">e.g. .bnode:hover {`{ transform: scale(1.02); }`}</span>
              </div>
              <textarea
                rows={12}
                value={customCss}
                onChange={(e) => onUpdateCustomCss(e.target.value)}
                placeholder="/* Add custom CSS rules here */
.bnode-button {
  transition: all 0.3s ease;
}
.bnode-button:hover {
  filter: brightness(1.1);
}"
                className="w-full bg-[#0a0a0c] border border-stone-800 focus:border-orange-500 rounded-xl p-4 font-mono text-xs text-amber-300 placeholder:text-stone-600 focus:outline-none leading-relaxed"
              />
              <p className="text-[11px] text-stone-400">
                Any styles written here are immediately applied to the live canvas preview and exported into your production HTML!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
