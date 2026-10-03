import React from "react";
import { Sparkles } from "lucide-react";
import type { BNode } from "./types";
import { isContainer } from "./types";

interface Props {
  node: BNode;
  onChange: (patch: Partial<BNode>) => void;
  onStyle: (key: string, value: string) => void;
  onOpenAi?: () => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="insp-field"><span>{label}</span>{children}</label>
);

function toHex(v = "") { return /^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"; }

export function Inspector({ node, onChange, onStyle, onOpenAi }: Props) {
  const s = node.style;
  const txt = (key: string, label: string, ph = "") => (
    <Field label={label}>
      <input className="insp-input" value={s[key] ?? ""} placeholder={ph} onChange={(e) => onStyle(key, e.target.value)} />
    </Field>
  );
  const color = (key: string, label: string) => (
    <Field label={label}>
      <div className="insp-color">
        <input type="color" value={toHex(s[key])} onChange={(e) => onStyle(key, e.target.value)} />
        <input className="insp-input" value={s[key] ?? ""} placeholder="none" onChange={(e) => onStyle(key, e.target.value)} />
      </div>
    </Field>
  );
  const select = (key: string, label: string, opts: string[]) => (
    <Field label={label}>
      <select className="insp-input" value={s[key] ?? ""} onChange={(e) => onStyle(key, e.target.value)}>
        <option value="">—</option>
        {opts.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </Field>
  );

  return (
    <div className="insp">
      {onOpenAi && (
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--chrome-3)", background: "var(--chrome)" }}>
          <button
            type="button"
            onClick={onOpenAi}
            style={{
              width: "100%",
              padding: "9px 12px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ea580c 0%, #d97706 100%)",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(234, 88, 12, 0.3)",
            }}
          >
            <Sparkles size={14} />
            <span>Ask AI to Redesign This</span>
          </button>
        </div>
      )}
      <div className="insp-group">
        <h4>Content</h4>
        {(node.type === "heading" || node.type === "text" || node.type === "button") && (
          <Field label="Text"><textarea className="insp-input" rows={3} value={node.text} onChange={(e) => onChange({ text: e.target.value })} /></Field>
        )}
        {node.type === "heading" && (
          <Field label="Heading level">
            <select className="insp-input" value={String(node.level ?? 2)} onChange={(e) => onChange({ level: Number(e.target.value) })}>
              {[1, 2, 3, 4, 5, 6].map((l) => <option key={l} value={l}>H{l}</option>)}
            </select>
          </Field>
        )}
        {node.type === "button" && (
          <Field label="Link"><input className="insp-input" value={node.href} onChange={(e) => onChange({ href: e.target.value })} /></Field>
        )}
        {node.type === "image" && (
          <Field label="Image URL"><input className="insp-input" value={node.src} onChange={(e) => onChange({ src: e.target.value })} /></Field>
        )}
        {node.type === "video" && (
          <Field label="Video Embed URL"><input className="insp-input" value={node.videoUrl} placeholder="https://www.youtube.com/embed/..." onChange={(e) => onChange({ videoUrl: e.target.value })} /></Field>
        )}
        {node.type === "countdown" && (
          <Field label="Target Date & Time"><input type="datetime-local" className="insp-input" value={node.targetDate} onChange={(e) => onChange({ targetDate: e.target.value })} /></Field>
        )}
        {node.type === "stars" && (
          <>
            <Field label="Rating (1-5)"><input type="number" min={1} max={5} className="insp-input" value={node.rating ?? 5} onChange={(e) => onChange({ rating: Number(e.target.value) })} /></Field>
            <Field label="Author / Client"><input className="insp-input" value={node.author} placeholder="e.g. John Doe, CEO" onChange={(e) => onChange({ author: e.target.value })} /></Field>
            <Field label="Quote Text"><textarea rows={2} className="insp-input" value={node.text} onChange={(e) => onChange({ text: e.target.value })} /></Field>
          </>
        )}
        {node.type === "map" && (
          <Field label="Map Location / Address"><input className="insp-input" value={node.mapQuery} placeholder="e.g. Times Square, New York" onChange={(e) => onChange({ mapQuery: e.target.value })} /></Field>
        )}
        {isContainer(node.type) && <p className="insp-hint">Containers hold other elements.</p>}
        {node.type === "divider" && <p className="insp-hint">A horizontal line.</p>}
      </div>

      {/* Motion & Hover Micro-Interactions */}
      <div className="insp-group">
        <h4>Motion & Hover Effects</h4>
        <Field label="Scroll Animation">
          <select
            className="insp-input"
            value={node.animation || "none"}
            onChange={(e) => onChange({ animation: e.target.value as any })}
          >
            <option value="none">None</option>
            <option value="fade-up">Fade Up</option>
            <option value="slide-left">Slide In Left</option>
            <option value="slide-right">Slide In Right</option>
            <option value="zoom-in">Zoom In</option>
            <option value="bounce">Bounce In</option>
          </select>
        </Field>
        <Field label="Hover Effect">
          <select
            className="insp-input"
            value={node.hoverEffect || "none"}
            onChange={(e) => onChange({ hoverEffect: e.target.value as any })}
          >
            <option value="none">None</option>
            <option value="lift">Lift Shadow</option>
            <option value="glow">Neon Glow</option>
            <option value="scale">Scale 3D</option>
            <option value="tilt">Tilt Highlight</option>
          </select>
        </Field>
      </div>

      <div className="insp-group">
        <h4>Colors</h4>
        {node.type !== "image" && color("color", "Text color")}
        {color("background", "Background")}
      </div>

      {node.type !== "image" && node.type !== "divider" && (
        <div className="insp-group">
          <h4>Typography</h4>
          {txt("fontSize", "Size", "16px")}
          {select("fontWeight", "Weight", ["300", "400", "500", "600", "700", "800"])}
          {select("textAlign", "Align", ["left", "center", "right"])}
          {txt("lineHeight", "Line height", "1.5")}
          {select("fontFamily", "Font", ["inherit", "Georgia, serif", "'Space Grotesk', sans-serif", "'DM Sans', sans-serif", "monospace"])}
        </div>
      )}

      {isContainer(node.type) && (
        <div className="insp-group">
          <h4>Layout</h4>
          {select("flexDirection", "Direction", ["row", "column"])}
          {select("alignItems", "Align items", ["flex-start", "center", "flex-end", "stretch"])}
          {select("justifyContent", "Justify", ["flex-start", "center", "flex-end", "space-between"])}
          {txt("gap", "Gap", "16px")}
          {select("flexWrap", "Wrap", ["nowrap", "wrap"])}
        </div>
      )}

      <div className="insp-group">
        <h4>Box</h4>
        {txt("width", "Width", "auto")}
        {txt("maxWidth", "Max width")}
        {txt("padding", "Padding", "0px")}
        {txt("margin", "Margin", "0px")}
        {txt("borderRadius", "Radius", "0px")}
        {txt("border", "Border", "1px solid #ccc")}
        {txt("boxShadow", "Shadow")}
        {txt("opacity", "Opacity", "1")}
      </div>
    </div>
  );
}
