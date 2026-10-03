export type NodeType =
  | "section"
  | "container"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "divider"
  | "video"
  | "carousel"
  | "countdown"
  | "stars"
  | "map";

export interface BNode {
  id: string;
  type: NodeType;
  level?: number; // heading tag level 1-6 (h1..h6)
  text?: string;
  src?: string;
  href?: string;
  videoUrl?: string;
  carouselImages?: string[];
  targetDate?: string;
  rating?: number;
  author?: string;
  mapQuery?: string;
  animation?: "none" | "fade-up" | "slide-left" | "slide-right" | "zoom-in" | "bounce";
  hoverEffect?: "none" | "lift" | "glow" | "scale" | "tilt";
  style: Record<string, string>;
  children?: BNode[];
}

export interface Snapshot {
  id: string;
  name: string;
  timestamp: number;
  pages: any[];
  activePageId: string;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

export const isContainer = (t: NodeType) => t === "section" || t === "container";

export function createNode(type: NodeType): BNode {
  const id = uid();
  switch (type) {
    case "section":
      return { id, type, style: { padding: "64px 32px", background: "#f6f1ea", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }, children: [] };
    case "container":
      return { id, type, style: { display: "flex", flexDirection: "row", gap: "16px", padding: "16px", width: "100%", justifyContent: "center" }, children: [] };
    case "heading":
      return { id, type, level: 2, text: "New heading", style: { fontSize: "40px", fontWeight: "700", color: "#1c1917", margin: "0" } };
    case "text":
      return { id, type, text: "Write something meaningful here.", style: { fontSize: "18px", color: "#57534e", lineHeight: "1.6", margin: "0" } };
    case "button":
      return { id, type, text: "Click me", href: "#", style: { background: "#c2410c", color: "#ffffff", padding: "12px 28px", borderRadius: "999px", fontSize: "16px", fontWeight: "600", display: "inline-block", textDecoration: "none" } };
    case "image":
      return { id, type, src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200", style: { width: "100%", maxWidth: "640px", borderRadius: "16px", display: "block" } };
    case "divider":
      return { id, type, style: { width: "100%", height: "1px", background: "#d6d3d1", border: "none", margin: "16px 0" } };
    case "video":
      return {
        id,
        type,
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        style: { width: "100%", maxWidth: "720px", height: "400px", borderRadius: "16px", overflow: "hidden", border: "none", margin: "16px auto" },
      };
    case "carousel":
      return {
        id,
        type,
        carouselImages: [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
          "https://images.unsplash.com/photo-1517976487507-5b3b4a45a74c?w=1200",
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
        ],
        style: { width: "100%", maxWidth: "800px", height: "420px", borderRadius: "16px", overflow: "hidden", margin: "16px auto" },
      };
    case "countdown":
      return {
        id,
        type,
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        style: { padding: "24px 32px", background: "#18181b", borderRadius: "16px", color: "#ffffff", maxWidth: "560px", margin: "16px auto", textAlign: "center" },
      };
    case "stars":
      return {
        id,
        type,
        rating: 5,
        text: "“Canvas transformed our landing page workflow! It saved us over 40 hours of development time and looks stunning.”",
        author: "Sarah Jenkins, VP Design at Stripe",
        src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        style: { padding: "28px", background: "#ffffff", borderRadius: "16px", border: "1px solid #e5e7eb", maxWidth: "520px", margin: "16px auto", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
      };
    case "map":
      return {
        id,
        type,
        mapQuery: "San Francisco, CA",
        style: { width: "100%", maxWidth: "760px", height: "360px", borderRadius: "16px", overflow: "hidden", border: "none", margin: "16px auto" },
      };
  }
}

export const defaultPage: BNode = {
  id: "root",
  type: "section",
  style: { display: "flex", flexDirection: "column", background: "#ffffff", minHeight: "100%" },
  children: [
    {
      id: "hero", type: "section",
      style: { padding: "120px 32px", background: "#1c1917", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", textAlign: "center" },
      children: [
        { id: "h1", type: "heading", level: 1, text: "Build your site, visually.", style: { fontSize: "64px", fontWeight: "700", color: "#fafaf9", margin: "0", maxWidth: "800px", lineHeight: "1.05" } },
        { id: "p1", type: "text", text: "Click any element to select it. Double-click text to edit. Use the panel on the right to change styles.", style: { fontSize: "20px", color: "#a8a29e", margin: "0", maxWidth: "600px", lineHeight: "1.6" } },
        { id: "b1", type: "button", text: "Get started", href: "#", style: { background: "#ea580c", color: "#ffffff", padding: "14px 32px", borderRadius: "999px", fontSize: "16px", fontWeight: "600", display: "inline-block", textDecoration: "none" } },
      ],
    },
    {
      id: "feat", type: "section",
      style: { padding: "80px 32px", background: "#f6f1ea", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" },
      children: [
        { id: "h2", type: "heading", level: 2, text: "Simple, fast, code-free.", style: { fontSize: "36px", fontWeight: "700", color: "#1c1917", margin: "0" } },
        {
          id: "row", type: "container",
          style: { display: "flex", flexDirection: "row", gap: "24px", maxWidth: "960px", width: "100%", justifyContent: "center", flexWrap: "wrap" },
          children: [
            { id: "c1", type: "container", style: { flex: "1 1 260px", padding: "24px", background: "#ffffff", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
              { id: "c1-h", type: "heading", level: 3, text: "Direct editing", style: { fontSize: "20px", fontWeight: "600", color: "#1c1917", margin: "0" } },
              { id: "c1-p", type: "text", text: "Type right on the canvas. No separate forms or modals.", style: { fontSize: "15px", color: "#78716c", margin: "0", lineHeight: "1.5" } },
            ] },
            { id: "c2", type: "container", style: { flex: "1 1 260px", padding: "24px", background: "#ffffff", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
              { id: "c2-h", type: "heading", level: 3, text: "Clean HTML export", style: { fontSize: "20px", fontWeight: "600", color: "#1c1917", margin: "0" } },
              { id: "c2-p", type: "text", text: "Download portable, semantic HTML with inline CSS anytime.", style: { fontSize: "15px", color: "#78716c", margin: "0", lineHeight: "1.5" } },
            ] },
            { id: "c3", type: "container", style: { flex: "1 1 260px", padding: "24px", background: "#ffffff", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
              { id: "c3-h", type: "heading", level: 3, text: "Responsive preview", style: { fontSize: "20px", fontWeight: "600", color: "#1c1917", margin: "0" } },
              { id: "c3-p", type: "text", text: "Check your layout on desktop, tablet, and mobile views.", style: { fontSize: "15px", color: "#78716c", margin: "0", lineHeight: "1.5" } },
            ] },
          ],
        },
      ],
    },
  ],
};

export function findNode(root: BNode, id: string): BNode | null {
  if (root.id === id) return root;
  for (const c of root.children ?? []) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return null;
}

export function findParent(root: BNode, id: string): BNode | null {
  for (const c of root.children ?? []) {
    if (c.id === id) return root;
    const found = findParent(c, id);
    if (found) return found;
  }
  return null;
}

export function mapTree(root: BNode, fn: (n: BNode) => BNode): BNode {
  const updated = fn(root);
  if (!updated.children) return updated;
  return { ...updated, children: updated.children.map((c) => mapTree(c, fn)) };
}

export function insertChildAt(root: BNode, parentId: string, index: number, child: BNode): BNode {
  return mapTree(root, (n) => {
    if (n.id !== parentId) return n;
    const children = [...(n.children ?? [])];
    children.splice(Math.max(0, Math.min(index, children.length)), 0, child);
    return { ...n, children };
  });
}

export function cloneWithIds(n: BNode): BNode {
  const c: BNode = { ...n, id: uid(), style: { ...n.style } };
  if (n.children) c.children = n.children.map(cloneWithIds);
  return c;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function toHTML(n: BNode): string {
  const css = Object.entries(n.style).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
  switch (n.type) {
    case "heading": { const tag = `h${n.level ?? 2}`; return `<${tag} style="${css}">${esc(n.text)}</${tag}>`; }
    case "text": return `<p style="${css}">${esc(n.text)}</p>`;
    case "button": return `<a href="${n.href || '#'}" style="${css}">${esc(n.text)}</a>`;
    case "image": return `<img src="${n.src}" style="${css}" alt=""/>`;
    case "divider": return `<hr style="${css}"/>`;
    case "video": return `<div style="${css}"><iframe src="${n.videoUrl}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe></div>`;
    case "carousel": return `<div style="${css}"><img src="${(n.carouselImages || [])[0]}" style="width:100%;height:100%;object-fit:cover;" alt=""/></div>`;
    case "countdown": return `<div style="${css}"><h3>Offer Ends In:</h3><div style="font-size:24px;font-weight:bold;">07 Days : 14 Hours : 32 Mins</div></div>`;
    case "stars": return `<div style="${css}"><div style="color:#f59e0b;font-size:20px;">★★★★★</div><p>${esc(n.text)}</p><strong>${esc(n.author)}</strong></div>`;
    case "map": return `<div style="${css}"><iframe src="https://maps.google.com/maps?q=${encodeURIComponent(n.mapQuery || 'San Francisco')}&t=&z=13&ie=UTF8&iwloc=&output=embed" style="width:100%;height:100%;border:none;"></iframe></div>`;
    default: return `<div style="${css}">${(n.children ?? []).map(toHTML).join("")}</div>`;
  }
}
