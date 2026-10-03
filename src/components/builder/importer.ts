import JSZip from "jszip";
import { type BNode, type NodeType, uid } from "./types";

export function countNodes(node: BNode): number {
  let count = 1;
  for (const child of node.children ?? []) {
    count += countNodes(child);
  }
  return count;
}

export function parseInlineStyle(styleAttr: string | null): Record<string, string> {
  const style: Record<string, string> = {};
  if (!styleAttr) return style;
  const rules = styleAttr.split(";");
  for (const rule of rules) {
    const idx = rule.indexOf(":");
    if (idx !== -1) {
      const prop = rule.slice(0, idx).trim();
      const val = rule.slice(idx + 1).trim();
      if (prop && val) {
        // convert kebab-case to camelCase
        const camel = prop.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
        style[camel] = val;
      }
    }
  }
  return style;
}

function resolveAssetSrc(rawSrc: string, assetMap?: Record<string, string>): string {
  if (!rawSrc) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200";
  if (!assetMap) return rawSrc;
  
  // Direct match
  if (assetMap[rawSrc]) return assetMap[rawSrc];

  // Normalized path match
  const cleanPath = rawSrc.replace(/^\.\//, "").replace(/^\//, "");
  if (assetMap[cleanPath]) return assetMap[cleanPath];

  // Basename match
  const baseName = rawSrc.split("/").pop();
  if (baseName && assetMap[baseName]) return assetMap[baseName];

  return rawSrc;
}

function domNodeToBNode(el: HTMLElement, assetMap?: Record<string, string>): BNode | null {
  const tagName = el.tagName.toUpperCase();
  const inlineStyle = parseInlineStyle(el.getAttribute("style"));

  // Skip invisible or script elements
  if (["SCRIPT", "STYLE", "NOSCRIPT", "META", "LINK", "SVG", "PATH", "IFRAME"].includes(tagName)) {
    return null;
  }

  // Heading tags H1 - H6
  if (/^H[1-6]$/.test(tagName)) {
    const level = parseInt(tagName.charAt(1), 10);
    const text = el.innerText?.trim() || el.textContent?.trim() || `Heading ${level}`;
    return {
      id: uid(),
      type: "heading",
      level,
      text,
      style: {
        fontSize: level === 1 ? "48px" : level === 2 ? "36px" : level === 3 ? "28px" : "20px",
        fontWeight: "700",
        color: inlineStyle.color || "#1c1917",
        margin: "0",
        ...inlineStyle,
      },
    };
  }

  // Paragraph, span, small text
  if (["P", "SPAN", "LABEL", "SMALL", "B", "STRONG", "EM", "I", "BLOCKQUOTE"].includes(tagName)) {
    // If it does not contain structural elements, treat as text
    if (!el.querySelector("div, section, p, h1, h2, h3, h4, h5, h6, img, ul, ol, table")) {
      const text = el.innerText?.trim() || el.textContent?.trim() || "";
      if (!text) return null;
      return {
        id: uid(),
        type: "text",
        text,
        style: {
          fontSize: "16px",
          color: inlineStyle.color || "#57534e",
          lineHeight: "1.6",
          margin: "0",
          ...inlineStyle,
        },
      };
    }
  }

  // Button or Anchor Link
  if (tagName === "BUTTON" || tagName === "A") {
    const href = el.getAttribute("href") || "#";
    const text = el.innerText?.trim() || el.textContent?.trim() || "Click here";
    return {
      id: uid(),
      type: "button",
      text,
      href,
      style: {
        background: inlineStyle.background || inlineStyle.backgroundColor || "#c2410c",
        color: inlineStyle.color || "#ffffff",
        padding: inlineStyle.padding || "12px 28px",
        borderRadius: inlineStyle.borderRadius || "999px",
        fontSize: inlineStyle.fontSize || "16px",
        fontWeight: inlineStyle.fontWeight || "600",
        display: "inline-block",
        textDecoration: "none",
        ...inlineStyle,
      },
    };
  }

  // Image tag
  if (tagName === "IMG") {
    const rawSrc = el.getAttribute("src") || "";
    const resolved = resolveAssetSrc(rawSrc, assetMap);
    return {
      id: uid(),
      type: "image",
      src: resolved,
      style: {
        width: inlineStyle.width || "100%",
        maxWidth: inlineStyle.maxWidth || "640px",
        borderRadius: inlineStyle.borderRadius || "12px",
        display: "block",
        ...inlineStyle,
      },
    };
  }

  // Horizontal divider
  if (tagName === "HR") {
    return {
      id: uid(),
      type: "divider",
      style: {
        width: "100%",
        height: "1px",
        background: inlineStyle.background || "#d6d3d1",
        border: "none",
        margin: inlineStyle.margin || "16px 0",
        ...inlineStyle,
      },
    };
  }

  // Containers and Sections
  const isSectionTag = ["SECTION", "HEADER", "FOOTER", "NAV", "MAIN", "ARTICLE"].includes(tagName);
  const nodeType: NodeType = isSectionTag ? "section" : "container";

  const children: BNode[] = [];

  for (const childNode of Array.from(el.childNodes)) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      const txt = childNode.textContent?.trim();
      if (txt && txt.length > 0) {
        children.push({
          id: uid(),
          type: "text",
          text: txt,
          style: {
            fontSize: "16px",
            color: "#57534e",
            lineHeight: "1.6",
            margin: "0",
          },
        });
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      const bnode = domNodeToBNode(childNode as HTMLElement, assetMap);
      if (bnode) {
        children.push(bnode);
      }
    }
  }

  const defaultStyle: Record<string, string> = isSectionTag
    ? {
        padding: inlineStyle.padding || "64px 32px",
        background: inlineStyle.background || inlineStyle.backgroundColor || "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: inlineStyle.gap || "24px",
        alignItems: inlineStyle.alignItems || "center",
        width: "100%",
      }
    : {
        display: "flex",
        flexDirection: inlineStyle.display === "flex" && inlineStyle.flexDirection ? inlineStyle.flexDirection : "column",
        gap: inlineStyle.gap || "16px",
        padding: inlineStyle.padding || "16px",
        width: "100%",
      };

  return {
    id: uid(),
    type: nodeType,
    style: {
      ...defaultStyle,
      ...inlineStyle,
    },
    children,
  };
}

export function htmlToBNode(htmlString: string, assetMap?: Record<string, string>): BNode {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const body = doc.body;
  const children: BNode[] = [];

  for (const childNode of Array.from(body.childNodes)) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      const txt = childNode.textContent?.trim();
      if (txt) {
        children.push({
          id: uid(),
          type: "text",
          text: txt,
          style: { fontSize: "18px", color: "#57534e", lineHeight: "1.6", margin: "0" },
        });
      }
    } else if (childNode.nodeType === Node.ELEMENT_NODE) {
      const parsed = domNodeToBNode(childNode as HTMLElement, assetMap);
      if (parsed) {
        children.push(parsed);
      }
    }
  }

  // Ensure root page is always structured properly
  return {
    id: "root",
    type: "section",
    style: {
      display: "flex",
      flexDirection: "column",
      background: "#ffffff",
      minHeight: "100%",
      width: "100%",
    },
    children: children.length > 0 ? children : [
      {
        id: uid(),
        type: "section",
        style: { padding: "64px 32px", background: "#f6f1ea", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" },
        children: [
          { id: uid(), type: "heading", level: 1, text: "Imported Website", style: { fontSize: "40px", fontWeight: "700", color: "#1c1917" } },
          { id: uid(), type: "text", text: "Start customizing your imported layout.", style: { fontSize: "18px", color: "#57534e" } }
        ]
      }
    ],
  };
}

export interface ParseResult {
  page: BNode;
  filename: string;
  elementCount: number;
  imagesCount: number;
  filesList: string[];
  fileType: "zip" | "html" | "json";
}

export async function parseUploadedFile(file: File): Promise<ParseResult> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "zip") {
    const zip = await JSZip.loadAsync(file);
    const assetMap: Record<string, string> = {};
    const filesList: string[] = [];

    const fileEntries: { name: string; file: JSZip.JSZipObject }[] = [];
    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && !relativePath.startsWith("__MACOSX/")) {
        fileEntries.push({ name: relativePath, file: zipEntry });
        filesList.push(relativePath);
      }
    });

    // 1. Extract images
    let imagesCount = 0;
    for (const { name, file: zipFile } of fileEntries) {
      const fileExt = name.split(".").pop()?.toLowerCase();
      if (["png", "jpg", "jpeg", "svg", "webp", "gif", "bmp"].includes(fileExt || "")) {
        const mime = fileExt === "svg" ? "image/svg+xml" : `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;
        const base64 = await zipFile.async("base64");
        const dataUri = `data:${mime};base64,${base64}`;
        assetMap[name] = dataUri;
        assetMap[name.replace(/^\.\//, "")] = dataUri;
        const baseOnly = name.split("/").pop();
        if (baseOnly) {
          assetMap[baseOnly] = dataUri;
        }
        imagesCount++;
      }
    }

    // 2. Check for canvas/builder project JSON
    const jsonEntry = fileEntries.find(
      (e) =>
        e.name.endsWith(".json") &&
        (e.name.includes("project") || e.name.includes("builder") || e.name.includes("site") || e.name.includes("page"))
    );
    if (jsonEntry) {
      try {
        const jsonText = await jsonEntry.file.async("text");
        const parsed = JSON.parse(jsonText);
        if (parsed.id && parsed.type && parsed.style) {
          return {
            page: parsed,
            filename: file.name,
            elementCount: countNodes(parsed),
            imagesCount,
            filesList,
            fileType: "zip",
          };
        }
      } catch {
        // proceed to HTML check
      }
    }

    // 3. Find HTML file
    const indexHtml =
      fileEntries.find((e) => e.name.toLowerCase().endsWith("index.html")) ||
      fileEntries.find((e) => e.name.toLowerCase().endsWith(".html") || e.name.toLowerCase().endsWith(".htm"));

    if (!indexHtml) {
      throw new Error("No HTML file (e.g., index.html) or valid project JSON found inside the ZIP archive.");
    }

    const htmlContent = await indexHtml.file.async("text");
    const page = htmlToBNode(htmlContent, assetMap);

    return {
      page,
      filename: file.name,
      elementCount: countNodes(page),
      imagesCount,
      filesList,
      fileType: "zip",
    };
  }

  if (ext === "json") {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed || !parsed.type || !parsed.style) {
      throw new Error("Invalid project JSON: Must contain node type and style definitions.");
    }
    return {
      page: parsed,
      filename: file.name,
      elementCount: countNodes(parsed),
      imagesCount: 0,
      filesList: [file.name],
      fileType: "json",
    };
  }

  if (ext === "html" || ext === "htm") {
    const htmlText = await file.text();
    const page = htmlToBNode(htmlText);
    return {
      page,
      filename: file.name,
      elementCount: countNodes(page),
      imagesCount: 0,
      filesList: [file.name],
      fileType: "html",
    };
  }

  throw new Error("Unsupported file format. Please upload a .zip, .html, or .json file.");
}
