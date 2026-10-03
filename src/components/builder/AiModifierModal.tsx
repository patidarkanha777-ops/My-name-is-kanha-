import React, { useState, useEffect } from "react";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Wand2,
  PlusCircle,
  Layers,
  Heading,
  AlignLeft,
  MousePointerClick,
  Square,
  Columns3,
  Image as ImageIcon,
  Mic,
  MicOff,
  Languages,
  Palette,
  Globe,
} from "lucide-react";
import type { BNode } from "./types";

interface AiModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: BNode | null;
  onApplyModification: (updatedNode: BNode, explanation: string) => void;
  onApplyNewSection: (newSection: BNode, explanation: string) => void;
  onApplyTranslatedPage?: (translatedRoot: BNode, explanation: string) => void;
  onApplyImageToNode?: (imageUrl: string, explanation: string) => void;
  onApplyFullSite?: (sitePages: any[], explanation: string) => void;
  pageRoot?: BNode;
  onUndoLastAiChange?: () => void;
}

export function AiModifierModal({
  isOpen,
  onClose,
  selectedNode,
  onApplyModification,
  onApplyNewSection,
  onApplyTranslatedPage,
  onApplyImageToNode,
  onApplyFullSite,
  pageRoot,
  onUndoLastAiChange,
}: AiModifierModalProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastExplanation, setLastExplanation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"modify" | "generate" | "image" | "translate" | "fullsite">(
    selectedNode?.type === "image" ? "image" : selectedNode ? "modify" : "fullsite"
  );

  // Voice speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [targetLang, setTargetLang] = useState("Hindi");
  const [tone, setTone] = useState("Catchy SaaS & Modern");

  useEffect(() => {
    if (selectedNode?.type === "image") {
      setActiveTab("image");
    } else if (selectedNode) {
      setActiveTab("modify");
    }
    setError(null);
  }, [selectedNode, isOpen]);

  if (!isOpen) return null;

  // Web Speech API for voice commands
  const toggleVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN"; // supports Hindi & English
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() && activeTab !== "translate") return;

    setError(null);
    setLoading(true);
    setLastExplanation(null);

    try {
      if (activeTab === "modify" && selectedNode) {
        const response = await fetch("/api/ai/modify-element", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            node: selectedNode,
            prompt: prompt.trim(),
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to update element.");
        }

        onApplyModification(data.updatedNode, data.explanation);
        setLastExplanation(data.explanation);
        setPrompt("");
      } else if (activeTab === "image") {
        const response = await fetch("/api/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate image.");
        }

        if (onApplyImageToNode) {
          onApplyImageToNode(data.imageUrl, data.explanation);
        } else if (selectedNode) {
          onApplyModification({ ...selectedNode, src: data.imageUrl }, data.explanation);
        }
        setLastExplanation(data.explanation);
        setPrompt("");
      } else if (activeTab === "translate" && pageRoot && onApplyTranslatedPage) {
        const response = await fetch("/api/ai/translate-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pageRoot,
            targetLang,
            tone,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to translate page.");
        }

        onApplyTranslatedPage(data.translatedPage, data.explanation);
        setLastExplanation(data.explanation);
      } else if (activeTab === "fullsite" && onApplyFullSite) {
        const response = await fetch("/api/ai/generate-full-site", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate full website.");
        }

        onApplyFullSite(data.sitePages, data.explanation);
        setLastExplanation(data.explanation);
        setPrompt("");
      } else {
        // Generate new section
        const response = await fetch("/api/ai/generate-section", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate section.");
        }

        onApplyNewSection(data.newSection, data.explanation);
        setLastExplanation(data.explanation);
        setPrompt("");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while communicating with Gemini AI.");
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = () => {
    if (activeTab === "image") {
      return [
        "A modern 3D illustration of a rocket launching into space",
        "Minimalist modern cafe workspace with warm sunlight",
        "Cyberpunk futuristic neon city street with reflections",
        "Clean minimal abstract gradient 3D glass shape",
        "High-tech software developer coding setup",
      ];
    }
    if (activeTab === "translate") {
      return [
        "Translate everything into clean professional Hindi",
        "Make text punchy & high-converting SaaS copy",
        "Translate into friendly Spanish",
        "Make it sound like an Apple keynote presentation",
      ];
    }
    if (activeTab === "fullsite") {
      return [
        "Gym & Fitness Studio with membership pricing, timetable & contact page",
        "Modern SaaS developer tools startup with dark theme & feature matrix",
        "Artisanal Coffee & Bakery cafe with menu, story & reservation page",
        "Freelance Creative UI/UX Designer portfolio with case studies",
      ];
    }
    if (!selectedNode || activeTab === "generate") {
      return [
        "Create a modern SaaS hero section with gradient text and CTA",
        "Create a 3-column feature showcase with clean cards",
        "Create a pricing table with Monthly/Yearly options",
        "Create a customer testimonials carousel with 5-star ratings",
        "Create a dark modern footer with newsletter subscription",
      ];
    }

    switch (selectedNode.type) {
      case "heading":
        return [
          "Make this headline more catchy and punchy for a tech startup",
          "Change color to a vibrant modern gradient text",
          "Make it bold and minimalist, with smaller subtitle under it",
          "Rewrite in Hindi: modern & professional tone",
        ];
      case "text":
        return [
          "Rewrite this paragraph to be more engaging and concise",
          "Increase line-height and change text color to subtle slate",
          "Make it sound like an Apple product description",
          "Shorten into a clear 1-sentence value proposition",
        ];
      case "button":
        return [
          "Make it a glowing orange pill button with soft shadow",
          "Change style to dark glassmorphism with subtle white border",
          "Change text to 'Start Free Trial →' with bold weight",
          "Make it wide with subtle gradient background",
        ];
      case "container":
      case "section":
        return [
          "Change background to modern dark gradient (#0f172a to #1e293b)",
          "Add 3 modern feature boxes with icons and titles inside",
          "Make this a 2-column split layout with text on left",
          "Add soft rounded corners and deep drop shadow",
        ];
      case "image":
        return [
          "Add smooth rounded corners (24px) and soft ambient shadow",
          "Make this image full width with border overlay",
          "Replace with a high quality modern workspace photo",
        ];
      default:
        return [
          "Make this element match a clean modern dark aesthetic",
          "Adjust spacing, padding, and alignment",
        ];
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "heading": return <Heading size={14} className="text-orange-400" />;
      case "text": return <AlignLeft size={14} className="text-amber-400" />;
      case "button": return <MousePointerClick size={14} className="text-emerald-400" />;
      case "container": return <Columns3 size={14} className="text-sky-400" />;
      case "section": return <Square size={14} className="text-purple-400" />;
      case "image": return <ImageIcon size={14} className="text-pink-400" />;
      default: return <Layers size={14} className="text-stone-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                Gemini AI Super Studio
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  gemini-3.8-flash
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                AI Element Redesign, Voice Commands, Image Generation & Content Translation
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-[#3c3836] bg-[#191716] px-4 overflow-x-auto">
          <button
            onClick={() => { setActiveTab("modify"); setError(null); }}
            disabled={!selectedNode}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "modify"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : selectedNode
                ? "border-transparent text-stone-400 hover:text-stone-200"
                : "border-transparent text-stone-600 cursor-not-allowed"
            }`}
          >
            <Wand2 size={13} />
            Modify Element
          </button>

          <button
            onClick={() => { setActiveTab("image"); setError(null); }}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "image"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <ImageIcon size={13} />
            AI Image Generator
          </button>

          <button
            onClick={() => { setActiveTab("translate"); setError(null); }}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "translate"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Languages size={13} />
            Translate & Tone
          </button>

          <button
            onClick={() => { setActiveTab("generate"); setError(null); }}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "generate"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <PlusCircle size={13} />
            New Section
          </button>

          <button
            onClick={() => { setActiveTab("fullsite"); setError(null); }}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition ${
              activeTab === "fullsite"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Globe size={13} />
            1-Prompt Full Website
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Target Element Indicator */}
          {activeTab === "modify" && selectedNode && (
            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-stone-800 border border-stone-700">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-200 uppercase text-[11px] tracking-wide">
                      Target: {selectedNode.type}
                    </span>
                    <span className="font-mono text-[10px] text-stone-500">#{selectedNode.id.slice(0, 8)}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 truncate max-w-sm">
                    {selectedNode.text ? `"${selectedNode.text}"` : selectedNode.children ? `${selectedNode.children.length} nested child blocks` : "Element style node"}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 rounded bg-stone-800 text-[10px] font-mono text-orange-400">
                Ready for AI
              </span>
            </div>
          )}

          {/* Success Banner */}
          {lastExplanation && (
            <div className="p-3 rounded-xl bg-green-950/40 border border-green-500/40 text-xs text-green-200 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                <span>{lastExplanation}</span>
              </div>
              {onUndoLastAiChange && (
                <button
                  type="button"
                  onClick={() => {
                    onUndoLastAiChange();
                    setLastExplanation("Reverted AI change.");
                  }}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold flex items-center gap-1 shrink-0 transition"
                >
                  <Undo2 size={12} />
                  Undo
                </button>
              )}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Translation Options Form */}
          {activeTab === "translate" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-[#141210] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  >
                    <option value="Hindi">Hindi (हिंदी)</option>
                    <option value="English">English (US/UK)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Tone & Polish</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full bg-[#141210] border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-200"
                  >
                    <option value="Catchy SaaS & Modern">Catchy SaaS & High-Converting</option>
                    <option value="Professional & Formal">Professional & Corporate</option>
                    <option value="Friendly & Casual">Friendly & Approachable</option>
                    <option value="Minimalist & Direct">Minimalist (Apple-like)</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-stone-400">
                Gemini will scan the entire website and translate/polish all headlines, paragraphs, and buttons while preserving your layout and styles.
              </p>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-300">
                    {activeTab === "modify"
                      ? "Batao is element me kya change karna hai:"
                      : activeTab === "image"
                      ? "Describe the photo or illustration you want:"
                      : "Describe the section you want AI to build:"}
                  </label>
                  {/* Voice Mic Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceRecognition}
                    title="Bol kar batao (Voice Command)"
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                      isListening
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-stone-800 text-stone-300 hover:text-orange-400"
                    }`}
                  >
                    {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                    <span>{isListening ? "Listening..." : "Voice Dictate"}</span>
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      activeTab === "modify"
                        ? "e.g. 'Iska background dark gradient kardo aur button glowing orange ho', 'Headline ko catchier banao'..."
                        : activeTab === "image"
                        ? "e.g. 'A modern 3D illustration of a rocket launching into space', 'Minimalist coffee shop aesthetic'..."
                        : "e.g. 'Create a modern pricing section with 3 tiers and feature lists'..."
                    }
                    rows={3}
                    disabled={loading}
                    className="w-full bg-[#141210] border border-stone-700 rounded-xl p-3.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-orange-500 disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                </div>
              </div>

              {/* Quick Suggestions */}
              <div>
                <p className="text-[11px] font-medium text-stone-400 mb-2 flex items-center gap-1.5">
                  <Sparkles size={12} className="text-orange-400" />
                  Quick suggestions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {getSuggestions().map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(sug)}
                      className="px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-orange-500/60 hover:bg-stone-800/80 text-[11px] text-left transition"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-[#3c3836]">
            <span className="text-[11px] text-stone-500">
              Powered by <span className="text-orange-400 font-semibold">Gemini 3.8 Flash</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs font-semibold transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={(activeTab !== "translate" && !prompt.trim()) || loading}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>
                      {activeTab === "modify"
                        ? "Apply Changes"
                        : activeTab === "image"
                        ? "Generate Image"
                        : activeTab === "translate"
                        ? `Translate to ${targetLang}`
                        : activeTab === "fullsite"
                        ? "Generate Full Website"
                        : "Generate Section"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
