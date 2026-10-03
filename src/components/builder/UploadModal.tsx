import React, { useState, useRef } from "react";
import {
  Upload,
  FileArchive,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  Code2,
  FolderArchive,
  Download,
  Sparkles,
  ArrowRight,
  Layers,
  Loader2,
} from "lucide-react";
import JSZip from "jszip";
import { type BNode, toHTML, defaultPage } from "./types";
import { parseUploadedFile, htmlToBNode, countNodes, type ParseResult } from "./importer";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (importedPage: BNode, mode: "replace" | "append") => void;
  currentPage: BNode;
}

export function UploadModal({ isOpen, onClose, onImport, currentPage }: UploadModalProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste" | "export">("file");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParseResult | null>(null);
  const [pastedCode, setPastedCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setError(null);
    setLoading(true);
    setParsedResult(null);

    try {
      const result = await parseUploadedFile(file);
      setParsedResult(result);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to parse uploaded file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePasteSubmit = () => {
    setError(null);
    if (!pastedCode.trim()) {
      setError("Please paste some HTML code first.");
      return;
    }

    try {
      const page = htmlToBNode(pastedCode);
      const totalElements = countNodes(page);
      setParsedResult({
        page,
        filename: "Pasted Code Snippet",
        elementCount: totalElements,
        imagesCount: 0,
        filesList: ["code.html"],
        fileType: "html",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to parse the HTML code.");
    }
  };

  const applyImport = (mode: "replace" | "append") => {
    if (!parsedResult) return;
    onImport(parsedResult.page, mode);
    onClose();
  };

  const handleExportZip = async () => {
    setLoading(true);
    try {
      const zip = new JSZip();
      const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Canvas Exported Website</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  </style>
</head>
<body>
  ${toHTML(currentPage)}
</body>
</html>`;

      zip.file("index.html", html);
      zip.file("canvas-project.json", JSON.stringify(currentPage, null, 2));
      zip.file("README.md", `# Exported from Canvas Website Builder\n\n- Open \`index.html\` in any web browser.\n- You can re-upload \`canvas-project.json\` or this ZIP file back to Canvas at any time!`);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "canvas-website.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Failed to create ZIP export.");
    } finally {
      setLoading(false);
    }
  };

  const insertSampleSnippet = (type: "hero" | "features" | "pricing") => {
    if (type === "hero") {
      setPastedCode(`<section style="padding: 80px 24px; background: linear-gradient(135deg, #1e1e24 0%, #2b2d42 100%); color: #ffffff; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
  <h1 style="font-size: 52px; font-weight: 800; margin: 0; color: #ffffff;">Create Fast, Publish Faster</h1>
  <p style="font-size: 20px; color: #cbd5e1; max-width: 650px; line-height: 1.6; margin: 0;">Build gorgeous responsive landing pages with zero configuration. Upload your code or drag components.</p>
  <div style="display: flex; gap: 12px; margin-top: 10px;">
    <a href="#demo" style="background: #f97316; color: #ffffff; padding: 14px 32px; border-radius: 999px; font-weight: 700; text-decoration: none;">Get Started Free</a>
    <a href="#learn" style="background: transparent; border: 1px solid #cbd5e1; color: #ffffff; padding: 14px 28px; border-radius: 999px; font-weight: 600; text-decoration: none;">Learn More</a>
  </div>
</section>`);
    } else if (type === "features") {
      setPastedCode(`<section style="padding: 60px 20px; background: #f8fafc; display: flex; flex-direction: column; align-items: center; gap: 30px;">
  <h2 style="font-size: 36px; font-weight: 700; color: #0f172a; margin: 0;">Key Capabilities</h2>
  <div style="display: flex; flex-direction: row; gap: 24px; flex-wrap: wrap; justify-content: center; width: 100%; max-width: 1000px;">
    <div style="flex: 1; min-width: 250px; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 10px;">
      <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0;">ZIP Archive Import</h3>
      <p style="font-size: 15px; color: #64748b; line-height: 1.5; margin: 0;">Directly unpack zip archives with HTML and images preserved as data assets.</p>
    </div>
    <div style="flex: 1; min-width: 250px; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 10px;">
      <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0;">Visual Inspector</h3>
      <p style="font-size: 15px; color: #64748b; line-height: 1.5; margin: 0;">Point-and-click editing for fonts, spacing, alignment, and modern palettes.</p>
    </div>
    <div style="flex: 1; min-width: 250px; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 10px;">
      <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 0;">Export Anywhere</h3>
      <p style="font-size: 15px; color: #64748b; line-height: 1.5; margin: 0;">Download ready-to-deploy HTML or packaged ZIP files in a single click.</p>
    </div>
  </div>
</section>`);
    } else {
      setPastedCode(`<section style="padding: 70px 24px; background: #ffffff; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
  <h2 style="font-size: 40px; font-weight: 800; color: #18181b; margin: 0;">Simple Transparent Pricing</h2>
  <p style="font-size: 18px; color: #71717a; margin: 0;">Choose the plan that fits your business.</p>
  <div style="display: flex; gap: 24px; width: 100%; max-width: 700px; justify-content: center; flex-wrap: wrap; margin-top: 10px;">
    <div style="flex: 1; min-width: 280px; padding: 32px; background: #fafafa; border: 1px solid #e4e4e7; border-radius: 16px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
      <h3 style="font-size: 24px; font-weight: 700; margin: 0;">Starter</h3>
      <p style="font-size: 38px; font-weight: 800; color: #f97316; margin: 0;">$0</p>
      <p style="color: #71717a; font-size: 14px;">Free forever for personal sites</p>
      <a href="#" style="background: #27272a; color: #ffffff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; width: 100%; text-align: center;">Get Started</a>
    </div>
    <div style="flex: 1; min-width: 280px; padding: 32px; background: #18181b; color: #ffffff; border-radius: 16px; display: flex; flex-direction: column; gap: 16px; align-items: center;">
      <h3 style="font-size: 24px; font-weight: 700; margin: 0; color: #ffffff;">Pro</h3>
      <p style="font-size: 38px; font-weight: 800; color: #f97316; margin: 0;">$29</p>
      <p style="color: #a1a1aa; font-size: 14px;">Unlimited exports and domains</p>
      <a href="#" style="background: #f97316; color: #ffffff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; width: 100%; text-align: center;">Go Pro</a>
    </div>
  </div>
</section>`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#1c1917] border border-[#3c3836] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3c3836] bg-[#221f1d]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Upload size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
                Upload Code or ZIP File
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  .zip • .html • .json
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Import existing websites, templates, or ZIP archives into the Canvas builder.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#3c3836] bg-[#1a1715] px-6">
          <button
            onClick={() => { setActiveTab("file"); setParsedResult(null); setError(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "file"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <FolderArchive size={14} />
            Upload File (.zip / .html)
          </button>
          <button
            onClick={() => { setActiveTab("paste"); setParsedResult(null); setError(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "paste"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Code2 size={14} />
            Paste Code (HTML)
          </button>
          <button
            onClick={() => { setActiveTab("export"); setParsedResult(null); setError(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === "export"
                ? "border-orange-500 text-orange-400 bg-orange-500/5"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            <Download size={14} />
            Export ZIP Archive
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-300">Upload / Import Error</p>
                <p className="mt-0.5 text-stone-300">{error}</p>
              </div>
            </div>
          )}

          {/* TAB 1: FILE UPLOAD */}
          {activeTab === "file" && (
            <div className="space-y-4">
              {!parsedResult ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                    dragActive
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-stone-700 bg-stone-900/50 hover:border-orange-500/60 hover:bg-stone-900"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip,.html,.htm,.json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileProcess(e.target.files[0]);
                      }
                    }}
                  />

                  {loading ? (
                    <div className="py-6 flex flex-col items-center gap-3 text-orange-400">
                      <Loader2 size={32} className="animate-spin" />
                      <p className="text-xs font-semibold text-stone-200">Processing file and unpacking assets...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-400 border border-orange-500/20 shadow-inner">
                        <Upload size={26} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-stone-200">
                          Click to upload or drag & drop file here
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                          Supports full <span className="text-orange-400 font-medium">.zip</span> archives (HTML + CSS + images), standalone <span className="text-orange-400 font-medium">.html</span> files, or <span className="text-orange-400 font-medium">.json</span> projects.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-[11px] font-mono border border-stone-700 flex items-center gap-1.5">
                          <FileArchive size={12} className="text-orange-400" /> .zip bundle
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-[11px] font-mono border border-stone-700 flex items-center gap-1.5">
                          <FileCode size={12} className="text-amber-400" /> .html website
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-stone-800 text-stone-300 text-[11px] font-mono border border-stone-700 flex items-center gap-1.5">
                          <Layers size={12} className="text-cyan-400" /> .json project
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Parsed Result Preview */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-700/80 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-100">{parsedResult.filename}</h4>
                          <p className="text-xs text-stone-400">
                            Successfully parsed and ready to import into Canvas
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setParsedResult(null)}
                        className="text-xs text-stone-400 hover:text-stone-200 underline"
                      >
                        Choose another file
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2.5 rounded-lg bg-stone-800/60 border border-stone-700/50">
                        <p className="text-[11px] text-stone-400">Format</p>
                        <p className="text-sm font-bold text-orange-400 uppercase mt-0.5">{parsedResult.fileType}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-800/60 border border-stone-700/50">
                        <p className="text-[11px] text-stone-400">Canvas Blocks</p>
                        <p className="text-sm font-bold text-stone-200 mt-0.5">{parsedResult.elementCount} elements</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-stone-800/60 border border-stone-700/50">
                        <p className="text-[11px] text-stone-400">Images Extracted</p>
                        <p className="text-sm font-bold text-stone-200 mt-0.5">{parsedResult.imagesCount} assets</p>
                      </div>
                    </div>

                    {parsedResult.filesList.length > 1 && (
                      <div className="mt-2 text-xs text-stone-400">
                        <span className="font-semibold text-stone-300">Files inside ZIP:</span>{" "}
                        <span className="font-mono text-stone-400">
                          {parsedResult.filesList.slice(0, 5).join(", ")}
                          {parsedResult.filesList.length > 5 ? ` +${parsedResult.filesList.length - 5} more` : ""}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => applyImport("replace")}
                      className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30"
                    >
                      <ArrowRight size={14} />
                      Replace Entire Canvas
                    </button>
                    <button
                      onClick={() => applyImport("append")}
                      className="flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs transition flex items-center justify-center gap-2"
                    >
                      <Layers size={14} />
                      Append to Bottom of Current Site
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PASTE CODE */}
          {activeTab === "paste" && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-300">
                    Paste HTML or Web Code
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-stone-400">Quick templates:</span>
                    <button
                      type="button"
                      onClick={() => insertSampleSnippet("hero")}
                      className="px-2 py-0.5 rounded bg-stone-800 text-orange-400 hover:bg-stone-700 transition"
                    >
                      Hero
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSampleSnippet("features")}
                      className="px-2 py-0.5 rounded bg-stone-800 text-orange-400 hover:bg-stone-700 transition"
                    >
                      Features
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSampleSnippet("pricing")}
                      className="px-2 py-0.5 rounded bg-stone-800 text-orange-400 hover:bg-stone-700 transition"
                    >
                      Pricing
                    </button>
                  </div>
                </div>
                <textarea
                  value={pastedCode}
                  onChange={(e) => setPastedCode(e.target.value)}
                  placeholder="<section style='padding: 40px; background: #fff;'>&#10;  <h1>Welcome to my website</h1>&#10;  <p>Edit this visually in Canvas!</p>&#10;</section>"
                  rows={9}
                  className="w-full bg-[#141210] border border-stone-700 rounded-xl p-3.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              {!parsedResult ? (
                <button
                  type="button"
                  onClick={handlePasteSubmit}
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} />
                  Convert & Review Blocks
                </button>
              ) : (
                <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-700 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-green-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={15} /> Code converted ({parsedResult.elementCount} blocks)
                    </span>
                    <button
                      onClick={() => setParsedResult(null)}
                      className="text-stone-400 hover:text-stone-200 underline"
                    >
                      Edit code
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => applyImport("replace")}
                      className="flex-1 py-2 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition"
                    >
                      Replace Canvas
                    </button>
                    <button
                      onClick={() => applyImport("append")}
                      className="flex-1 py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs transition"
                    >
                      Append as Section
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPORT ZIP */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-700/70 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 mx-auto flex items-center justify-center">
                  <FolderArchive size={24} />
                </div>
                <h4 className="text-sm font-bold text-stone-100">Package Current Canvas into ZIP</h4>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Downloads a complete <span className="text-orange-400 font-mono">canvas-website.zip</span> archive containing:
                </p>
                <div className="flex justify-center gap-3 text-xs text-stone-300 font-mono pt-1">
                  <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700">📄 index.html</span>
                  <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700">⚙️ canvas-project.json</span>
                  <span className="px-2.5 py-1 rounded bg-stone-800 border border-stone-700">📝 README.md</span>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleExportZip}
                    disabled={loading}
                    className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-orange-900/30"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    Download ZIP Archive
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-[#3c3836] bg-[#1a1715] flex items-center justify-between text-[11px] text-stone-400">
          <span>Supported: ZIP archives, standalone HTML files, Canvas JSON</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md text-stone-300 hover:bg-stone-800 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
