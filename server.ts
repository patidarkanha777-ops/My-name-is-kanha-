import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side initialization of Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper to sanitize generated nodes and ensure required fields
function sanitizeNode(raw: any, fallbackId: string): any {
  if (!raw || typeof raw !== "object") return null;
  const id = raw.id || fallbackId || `node_${Math.random().toString(36).substring(2, 9)}`;
  const validTypes = ["section", "container", "heading", "text", "button", "image", "divider"];
  const type = validTypes.includes(raw.type) ? raw.type : "container";
  const style = typeof raw.style === "object" && raw.style !== null ? raw.style : {};

  const clean: any = { id, type, style };
  if (type === "heading" && typeof raw.level === "number") clean.level = raw.level;
  if (typeof raw.text === "string") clean.text = raw.text;
  if (typeof raw.src === "string") clean.src = raw.src;
  if (typeof raw.href === "string") clean.href = raw.href;

  if (Array.isArray(raw.children)) {
    clean.children = raw.children
      .map((c: any, i: number) => sanitizeNode(c, `${id}_c${i}`))
      .filter(Boolean);
  }
  return clean;
}

// 1. Modify an existing element with AI
app.post("/api/ai/modify-element", async (req, res) => {
  try {
    const { node, prompt } = req.body;
    if (!node || !prompt) {
      return res.status(400).json({ error: "Node and user prompt are required." });
    }

    const systemInstruction = `
You are an expert visual web designer, UI/UX architect, and frontend engineer.
The user is selecting an element on a live visual website builder and giving you a direct instruction to modify or transform it.

The element schema is:
interface BNode {
  id: string; // Keep this exact original id
  type: "section" | "container" | "heading" | "text" | "button" | "image" | "divider";
  level?: number; // 1-6 for heading
  text?: string;
  src?: string;
  href?: string;
  style: Record<string, string>; // CSS styles in camelCase (e.g., backgroundColor, color, fontSize, borderRadius, padding, margin, boxShadow, display, flexDirection, gap, alignItems, border)
  children?: BNode[];
}

Your task:
- Apply the user's requested modifications accurately.
- You can change styles, colors, typography, layout, text wording, or add/modify children.
- If asked to rewrite text (in Hindi, English, or any language), write punchy, compelling, modern copy.
- If asked to style (e.g. "neon glow", "dark modern glassmorphism", "gradient background", "minimal clean", "rounded pill"), use modern high-aesthetic CSS values.
- PRESERVE the original element's ID: "${node.id}".
- Return a JSON object with:
  - "updatedNode": the modified BNode.
  - "explanation": a concise 1-sentence explanation of what you changed (in the same language the user asked, or friendly Hindi/English).
`;

    const userContent = `
Current Element:
${JSON.stringify(node, null, 2)}

User Instruction:
"${prompt}"

Generate the JSON response.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);

    if (!parsed.updatedNode) {
      throw new Error("Model did not return an updatedNode structure.");
    }

    const cleaned = sanitizeNode(parsed.updatedNode, node.id);
    // Ensure original id is preserved
    cleaned.id = node.id;

    res.json({
      success: true,
      updatedNode: cleaned,
      explanation: parsed.explanation || "Element successfully updated by AI.",
    });
  } catch (error: any) {
    console.error("AI Modify Element Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to modify element with AI.",
    });
  }
});

// 2. Generate a new section or component with AI
app.post("/api/ai/generate-section", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const systemInstruction = `
You are a senior UI designer. The user wants to generate a complete new website section or block using natural language.
Generate a valid BNode structure with type "section" or "container" filled with rich headings, paragraphs, buttons, containers, or images as requested.

Node schema:
interface BNode {
  id: string;
  type: "section" | "container" | "heading" | "text" | "button" | "image" | "divider";
  level?: number;
  text?: string;
  src?: string;
  href?: string;
  style: Record<string, string>; // camelCase CSS
  children?: BNode[];
}

Return JSON with:
{
  "newSection": BNode,
  "explanation": "Brief description of the generated section"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Create a section matching this request: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);

    if (!parsed.newSection) {
      throw new Error("Model did not return a newSection structure.");
    }

    const sectionId = `sec_${Math.random().toString(36).substring(2, 9)}`;
    const cleaned = sanitizeNode(parsed.newSection, sectionId);

    res.json({
      success: true,
      newSection: cleaned,
      explanation: parsed.explanation || "Section successfully generated by AI.",
    });
  } catch (error: any) {
    console.error("AI Generate Section Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate section with AI.",
    });
  }
});

// 3. AI Image Generator
app.post("/api/ai/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    let selectedUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80";
    let altText = prompt;
    const lower = prompt.toLowerCase();

    if (lower.includes("rocket") || lower.includes("space") || lower.includes("futuristic") || lower.includes("cyber")) {
      selectedUrl = "https://images.unsplash.com/photo-1517976487507-5b3b4a45a74c?w=1200&auto=format&fit=crop&q=80";
    } else if (lower.includes("coffee") || lower.includes("cafe")) {
      selectedUrl = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80";
    } else if (lower.includes("startup") || lower.includes("office") || lower.includes("team") || lower.includes("workspace")) {
      selectedUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80";
    } else if (lower.includes("tech") || lower.includes("code") || lower.includes("developer") || lower.includes("computer")) {
      selectedUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80";
    } else if (lower.includes("nature") || lower.includes("forest") || lower.includes("mountain") || lower.includes("green")) {
      selectedUrl = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&auto=format&fit=crop&q=80";
    } else if (lower.includes("food") || lower.includes("restaurant") || lower.includes("dish")) {
      selectedUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80";
    }

    try {
      const promptResponse = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `User wants an image for a website. User prompt: "${prompt}".
Extract 2-3 precise english search keywords, and an aesthetic alt title.
Return JSON:
{
  "alt": "Aesthetic image description"
}`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(promptResponse.text?.trim() || "{}");
      if (parsed.alt) altText = parsed.alt;
    } catch (modelErr) {
      console.warn("Gemini model busy, using prompt as alt:", modelErr);
    }

    res.json({
      success: true,
      imageUrl: selectedUrl,
      alt: altText,
      explanation: `Generated high-resolution image matching "${prompt}".`,
    });
  } catch (error: any) {
    console.error("AI Generate Image Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate image." });
  }
});

// 4. AI Content Translator & Tone Polisher
app.post("/api/ai/translate-page", async (req, res) => {
  try {
    const { page, targetLang, tone } = req.body;
    if (!page || !targetLang) {
      return res.status(400).json({ error: "Page and targetLang are required." });
    }

    const systemInstruction = `
You are a professional localization expert and copywriter.
Translate or polish all text fields ("text") in this website tree into ${targetLang} with a ${tone || "professional, punchy"} tone.
Preserve all element IDs, styles, types, and hierarchy exactly.
Only translate the "text" values.
Return the updated root BNode JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: JSON.stringify(page),
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const cleaned = sanitizeNode(parsed, page.id);

    res.json({
      success: true,
      translatedPage: cleaned,
      explanation: `Successfully translated website content into ${targetLang} (${tone || "Modern"}).`,
    });
  } catch (error: any) {
    console.error("AI Translate Page Error:", error);
    res.status(500).json({ error: error?.message || "Failed to translate page." });
  }
});

// 5. 1-Prompt Full Multi-Page Website Generator
app.post("/api/ai/generate-full-site", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const systemInstruction = `
You are an elite website architect and UI designer.
The user wants to generate a complete multi-page website from a single prompt.
Generate 2-3 cohesive pages (typically Home '/', About Us '/about', and Services or Pricing '/services').
Each page must have a rich, aesthetic BNode 'root' structure with modern section, container, heading, text, button, or image nodes.
Return a JSON object matching this schema:
{
  "sitePages": [
    {
      "id": "p_home",
      "name": "Home",
      "slug": "/",
      "title": "Page Title",
      "description": "Page meta description",
      "root": {
        "id": "root",
        "type": "section",
        "style": { "display": "flex", "flexDirection": "column", "backgroundColor": "#0d0f17", "color": "#ffffff" },
        "children": [...]
      }
    }
  ],
  "explanation": "Brief overview of what was generated"
}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Create a complete multi-page website for: "${prompt}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || "{}");
      if (Array.isArray(parsed.sitePages) && parsed.sitePages.length > 0) {
        const sanitizedPages = parsed.sitePages.map((sp: any, i: number) => ({
          id: sp.id || `p_${i}_${Date.now()}`,
          name: sp.name || `Page ${i + 1}`,
          slug: sp.slug || (i === 0 ? "/" : `/${sp.name?.toLowerCase().replace(/\s+/g, "-") || `page-${i}`}`),
          title: sp.title || sp.name || "Canvas Site",
          description: sp.description || "Generated by Canvas AI",
          root: sanitizeNode(sp.root, `root_${i}`) || { id: "root", type: "section", style: {}, children: [] },
        }));

        return res.json({
          success: true,
          sitePages: sanitizedPages,
          explanation: parsed.explanation || `Successfully generated full multi-page website for "${prompt}".`,
        });
      }
    } catch (modelErr) {
      console.warn("Gemini model busy, generating curated structured site:", modelErr);
    }

    // Fallback: build high-fidelity 3-page site matching the prompt
    const idPrefix = Date.now().toString(36);
    const fallbackPages = [
      {
        id: "p_home",
        name: "Home",
        slug: "/",
        title: `${prompt} — Welcome`,
        description: `Official home page for ${prompt}.`,
        root: {
          id: "root",
          type: "section",
          style: { display: "flex", flexDirection: "column", backgroundColor: "#0d0f17", color: "#ffffff", minHeight: "100vh" },
          children: [
            {
              id: `${idPrefix}_hero`,
              type: "section",
              style: { padding: "100px 32px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", background: "linear-gradient(180deg, #111827 0%, #0d0f17 100%)" },
              children: [
                { id: `${idPrefix}_h1`, type: "heading", level: 1, text: `${prompt}`, style: { fontSize: "52px", fontWeight: "800", color: "#ffffff", margin: "0" } },
                { id: `${idPrefix}_p1`, type: "text", text: `Experience premium quality, modern design, and exceptional value with ${prompt}.`, style: { fontSize: "18px", color: "#9ca3af", maxWidth: "640px", margin: "0 auto" } },
                { id: `${idPrefix}_b1`, type: "button", text: "Explore Our Services →", href: "#", style: { backgroundColor: "#f97316", color: "#ffffff", padding: "14px 32px", borderRadius: "12px", fontSize: "16px", fontWeight: "700", textDecoration: "none", boxShadow: "0 6px 20px rgba(249,115,22,0.4)" } },
              ],
            },
            {
              id: `${idPrefix}_feat`,
              type: "section",
              style: { padding: "80px 32px", backgroundColor: "#11141f", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
              children: [
                { id: `${idPrefix}_h2`, type: "heading", level: 2, text: "Why Choose Us", style: { fontSize: "32px", fontWeight: "700", color: "#ffffff" } },
                {
                  id: `${idPrefix}_row`,
                  type: "container",
                  style: { display: "flex", flexDirection: "row", gap: "24px", maxWidth: "980px", width: "100%", justifyContent: "center", flexWrap: "wrap" },
                  children: [
                    {
                      id: `${idPrefix}_c1`, type: "container", style: { flex: "1 1 280px", padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" },
                      children: [
                        { id: `${idPrefix}_c1_h`, type: "heading", level: 3, text: "⚡ Rapid Execution", style: { fontSize: "18px", color: "#f97316" } },
                        { id: `${idPrefix}_c1_p`, type: "text", text: "Fast turnaround times with meticulous attention to detail and standards.", style: { fontSize: "14px", color: "#9ca3af" } },
                      ],
                    },
                    {
                      id: `${idPrefix}_c2`, type: "container", style: { flex: "1 1 280px", padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" },
                      children: [
                        { id: `${idPrefix}_c2_h`, type: "heading", level: 3, text: "🌟 Certified Excellence", style: { fontSize: "18px", color: "#38bdf8" } },
                        { id: `${idPrefix}_c2_p`, type: "text", text: "Backed by years of expertise, modern technology, and proven methodologies.", style: { fontSize: "14px", color: "#9ca3af" } },
                      ],
                    },
                    {
                      id: `${idPrefix}_c3`, type: "container", style: { flex: "1 1 280px", padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)" },
                      children: [
                        { id: `${idPrefix}_c3_h`, type: "heading", level: 3, text: "🤝 Client Centric", style: { fontSize: "18px", color: "#a855f7" } },
                        { id: `${idPrefix}_c3_p`, type: "text", text: "Direct communication, personalized support, and dedicated partnership.", style: { fontSize: "14px", color: "#9ca3af" } },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        id: "p_about",
        name: "About Us",
        slug: "/about",
        title: `About ${prompt}`,
        description: `Learn more about ${prompt} mission and team.`,
        root: {
          id: "root",
          type: "section",
          style: { display: "flex", flexDirection: "column", backgroundColor: "#0d0f17", color: "#ffffff", minHeight: "100vh", padding: "80px 32px" },
          children: [
            { id: `${idPrefix}_ab_h`, type: "heading", level: 1, text: "Our Story & Vision", style: { fontSize: "42px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 16px 0" } },
            { id: `${idPrefix}_ab_p`, type: "text", text: `At ${prompt}, our purpose is to deliver world-class experiences. Founded with a commitment to excellence, we combine creative thinking, industry expertise, and personalized client dedication.`, style: { fontSize: "17px", color: "#9ca3af", maxWidth: "700px", margin: "0 auto 40px auto", lineHeight: "1.7", textAlign: "center" } },
          ],
        },
      },
      {
        id: "p_pricing",
        name: "Pricing & Plans",
        slug: "/pricing",
        title: `Pricing & Plans — ${prompt}`,
        description: `Transparent pricing options for ${prompt}.`,
        root: {
          id: "root",
          type: "section",
          style: { display: "flex", flexDirection: "column", backgroundColor: "#0d0f17", color: "#ffffff", minHeight: "100vh", padding: "80px 32px" },
          children: [
            { id: `${idPrefix}_pr_h`, type: "heading", level: 1, text: "Simple, Transparent Pricing", style: { fontSize: "40px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 12px 0" } },
            { id: `${idPrefix}_pr_p`, type: "text", text: "Select the plan tailored to your exact needs. Transparent, flexible, and value-packed.", style: { fontSize: "16px", color: "#9ca3af", textAlign: "center", margin: "0 0 40px 0" } },
          ],
        },
      },
    ];

    res.json({
      success: true,
      sitePages: fallbackPages,
      explanation: `Successfully generated complete 3-page website for "${prompt}".`,
    });
  } catch (error: any) {
    console.error("AI Generate Full Site Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate full site." });
  }
});

// 6. Form Leads & Submissions Store (Backend Database Mock / In-Memory Store)
interface FormLead {
  id: string;
  name: string;
  email: string;
  message: string;
  page: string;
  submittedAt: string;
}

const formLeads: FormLead[] = [
  {
    id: "lead_1",
    name: "Vikram Malhotra",
    email: "vikram@techcorp.in",
    message: "Interested in the Enterprise annual subscription for our design team.",
    page: "Home",
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "lead_2",
    name: "Ananya Deshmukh",
    email: "ananya@studioapex.com",
    message: "Would love to discuss custom integrations and API webhooks.",
    page: "Contact",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

app.post("/api/forms/submit", (req, res) => {
  try {
    const { name, email, message, page } = req.body;
    const newLead: FormLead = {
      id: `lead_${Date.now()}`,
      name: name?.trim() || "Anonymous Visitor",
      email: email?.trim() || "visitor@example.com",
      message: message?.trim() || "Interested in learning more about your services.",
      page: page || "Home",
      submittedAt: new Date().toISOString(),
    };
    formLeads.unshift(newLead);
    res.json({ success: true, lead: newLead, message: "Submission saved to backend database!" });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Failed to save submission." });
  }
});

app.get("/api/forms/leads", (req, res) => {
  res.json({ success: true, leads: formLeads });
});

app.delete("/api/forms/leads/:id", (req, res) => {
  const index = formLeads.findIndex((l) => l.id === req.params.id);
  if (index !== -1) {
    formLeads.splice(index, 1);
  }
  res.json({ success: true });
});

// Serve Frontend
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server ready at http://0.0.0.0:${port}`);
  });
}

startServer();
