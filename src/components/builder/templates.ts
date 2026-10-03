import { uid, type BNode } from "./types";

export interface SectionTemplate {
  id: string;
  category: "navbar" | "hero" | "features" | "pricing" | "faq" | "contact" | "footer";
  title: string;
  description: string;
  generate: () => BNode;
}

const bn = (node: BNode): BNode => node;

export const SECTION_TEMPLATES: SectionTemplate[] = [
  // 1. Modern Navbar
  {
    id: "nav-modern",
    category: "navbar",
    title: "Modern Glass Navbar",
    description: "Sleek branding with navigation links and a high-contrast CTA button",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "rgba(18, 17, 16, 0.9)",
        padding: "16px 32px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backdropFilter: "blur(12px)",
      },
      children: [
        bn({
          id: uid(),
          type: "heading",
          level: 3,
          text: "Apex Studio.",
          style: {
            fontSize: "20px",
            fontWeight: "800",
            color: "#ffffff",
            margin: "0",
            letterSpacing: "-0.03em",
          },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
          },
          children: [
            bn({ id: uid(), type: "text", text: "Features", style: { color: "#d1d5db", fontSize: "14px", fontWeight: "500", margin: "0", cursor: "pointer" } }),
            bn({ id: uid(), type: "text", text: "Solutions", style: { color: "#d1d5db", fontSize: "14px", fontWeight: "500", margin: "0", cursor: "pointer" } }),
            bn({ id: uid(), type: "text", text: "Pricing", style: { color: "#d1d5db", fontSize: "14px", fontWeight: "500", margin: "0", cursor: "pointer" } }),
            bn({ id: uid(), type: "text", text: "FAQ", style: { color: "#d1d5db", fontSize: "14px", fontWeight: "500", margin: "0", cursor: "pointer" } }),
          ],
        }),
        bn({
          id: uid(),
          type: "button",
          text: "Get Started Free →",
          href: "#",
          style: {
            backgroundColor: "#f97316",
            color: "#ffffff",
            padding: "9px 18px",
            borderRadius: "9999px",
            fontSize: "13px",
            fontWeight: "600",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(249, 115, 22, 0.35)",
          },
        }),
      ],
    }),
  },

  // 2. Catchy Hero Header
  {
    id: "hero-saas",
    category: "hero",
    title: "High-Converting Hero Header",
    description: "Punchy headline, value proposition subtitle, dual CTA buttons, and mockup",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#0d0f17",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      },
      children: [
        bn({
          id: uid(),
          type: "container",
          style: {
            backgroundColor: "rgba(249, 115, 22, 0.15)",
            border: "1px solid rgba(249, 115, 22, 0.35)",
            padding: "6px 14px",
            borderRadius: "9999px",
            marginBottom: "20px",
          },
          children: [
            bn({
              id: uid(),
              type: "text",
              text: "✨ Introducing Canvas AI 2.0 • Faster, Smarter Visual Builder",
              style: { color: "#fb923c", fontSize: "13px", fontWeight: "600", margin: "0" },
            }),
          ],
        }),
        bn({
          id: uid(),
          type: "heading",
          level: 1,
          text: "Build Beautiful Websites in Minutes, Not Weeks",
          style: {
            fontSize: "48px",
            fontWeight: "800",
            lineHeight: "1.15",
            letterSpacing: "-0.03em",
            color: "#ffffff",
            maxWidth: "760px",
            margin: "0 auto 20px auto",
          },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "Empower your creative vision with visual drag-and-drop, AI design assistants, and clean production code export with zero friction.",
          style: {
            fontSize: "17px",
            lineHeight: "1.6",
            color: "#9ca3af",
            maxWidth: "620px",
            margin: "0 auto 32px auto",
          },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "40px",
          },
          children: [
            bn({
              id: uid(),
              type: "button",
              text: "Start Building Now →",
              href: "#",
              style: {
                backgroundColor: "#f97316",
                color: "#ffffff",
                padding: "14px 28px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                textDecoration: "none",
                boxShadow: "0 8px 24px rgba(249, 115, 22, 0.4)",
              },
            }),
            bn({
              id: uid(),
              type: "button",
              text: "Watch 1-Min Demo",
              href: "#",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#f3f4f6",
                padding: "14px 24px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              },
            }),
          ],
        }),
        bn({
          id: uid(),
          type: "image",
          src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
          style: {
            width: "100%",
            maxWidth: "880px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
          },
        }),
      ],
    }),
  },

  // 3. Feature Grid
  {
    id: "features-grid",
    category: "features",
    title: "3-Column Feature Cards",
    description: "Highlight core value points with modern card containers and badges",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#11141f",
        padding: "72px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children: [
        bn({
          id: uid(),
          type: "heading",
          level: 2,
          text: "Engineered for Lightning-Fast Results",
          style: {
            fontSize: "32px",
            fontWeight: "800",
            color: "#ffffff",
            textAlign: "center",
            margin: "0 0 12px 0",
          },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "Everything you need to launch high-performance landing pages without writing code.",
          style: {
            fontSize: "15px",
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "560px",
            margin: "0 0 48px 0",
          },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            width: "100%",
            maxWidth: "1060px",
            justifyContent: "center",
            flexWrap: "wrap",
          },
          children: [
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "28px",
                borderRadius: "16px",
                flex: "1 1 300px",
                maxWidth: "340px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 3, text: "⚡ Real-time Visual Editing", style: { fontSize: "18px", fontWeight: "700", color: "#f97316", margin: "0 0 10px 0" } }),
                bn({ id: uid(), type: "text", text: "Click any block, edit text on the spot, tweak CSS live with zero delay or preview reloading.", style: { fontSize: "14px", lineHeight: "1.5", color: "#9ca3af", margin: "0" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "28px",
                borderRadius: "16px",
                flex: "1 1 300px",
                maxWidth: "340px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 3, text: "🤖 Gemini AI Assistant", style: { fontSize: "18px", fontWeight: "700", color: "#38bdf8", margin: "0 0 10px 0" } }),
                bn({ id: uid(), type: "text", text: "Select any element and describe your desired visual changes in natural Hindi or English.", style: { fontSize: "14px", lineHeight: "1.5", color: "#9ca3af", margin: "0" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "28px",
                borderRadius: "16px",
                flex: "1 1 300px",
                maxWidth: "340px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 3, text: "📦 Code & ZIP Import", style: { fontSize: "18px", fontWeight: "700", color: "#a855f7", margin: "0 0 10px 0" } }),
                bn({ id: uid(), type: "text", text: "Upload your existing HTML or ZIP archives and transform them immediately into editable blocks.", style: { fontSize: "14px", lineHeight: "1.5", color: "#9ca3af", margin: "0" } }),
              ],
            }),
          ],
        }),
      ],
    }),
  },

  // 4. Pricing Tables
  {
    id: "pricing-tier",
    category: "pricing",
    title: "3-Tier Pricing Table",
    description: "Starter, Pro (Popular badge with highlight), and Enterprise cards",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#090d16",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children: [
        bn({
          id: uid(),
          type: "heading",
          level: 2,
          text: "Simple, Transparent Pricing",
          style: { fontSize: "34px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 10px 0" },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "Choose the perfect plan for your project. Upgrade or cancel anytime.",
          style: { fontSize: "15px", color: "#9ca3af", textAlign: "center", margin: "0 0 48px 0" },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            width: "100%",
            maxWidth: "1020px",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "stretch",
          },
          children: [
            // Starter
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "#111827",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "32px",
                flex: "1 1 280px",
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
              children: [
                bn({
                  id: uid(),
                  type: "container",
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    bn({ id: uid(), type: "heading", level: 3, text: "Starter", style: { fontSize: "20px", color: "#ffffff", margin: "0 0 8px 0" } }),
                    bn({ id: uid(), type: "heading", level: 2, text: "$0 / mo", style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" } }),
                    bn({ id: uid(), type: "text", text: "• Up to 3 live projects\n• Standard visual editor\n• Unlimited HTML exports", style: { fontSize: "14px", lineHeight: "1.8", color: "#9ca3af", whiteSpace: "pre-line" } }),
                  ],
                }),
                bn({
                  id: uid(),
                  type: "button",
                  text: "Get Started Free",
                  href: "#",
                  style: { backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", marginTop: "24px" },
                }),
              ],
            }),
            // Pro (Featured)
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "#171f30",
                border: "2px solid #f97316",
                borderRadius: "16px",
                padding: "32px",
                flex: "1 1 280px",
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 10px 30px rgba(249, 115, 22, 0.2)",
              },
              children: [
                bn({
                  id: uid(),
                  type: "container",
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    bn({ id: uid(), type: "text", text: "🔥 MOST POPULAR", style: { fontSize: "11px", fontWeight: "800", color: "#f97316", letterSpacing: "0.08em", margin: "0 0 6px 0" } }),
                    bn({ id: uid(), type: "heading", level: 3, text: "Pro Creator", style: { fontSize: "20px", color: "#ffffff", margin: "0 0 8px 0" } }),
                    bn({ id: uid(), type: "heading", level: 2, text: "$29 / mo", style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" } }),
                    bn({ id: uid(), type: "text", text: "• Unlimited websites & pages\n• Full Gemini AI Assistant\n• AI Image Generation\n• Custom domain export", style: { fontSize: "14px", lineHeight: "1.8", color: "#e5e7eb", whiteSpace: "pre-line" } }),
                  ],
                }),
                bn({
                  id: uid(),
                  type: "button",
                  text: "Start Pro Trial →",
                  href: "#",
                  style: { backgroundColor: "#f97316", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "700", marginTop: "24px", boxShadow: "0 4px 14px rgba(249, 115, 22, 0.4)" },
                }),
              ],
            }),
            // Enterprise
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "#111827",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "16px",
                padding: "32px",
                flex: "1 1 280px",
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
              children: [
                bn({
                  id: uid(),
                  type: "container",
                  style: { display: "flex", flexDirection: "column" },
                  children: [
                    bn({ id: uid(), type: "heading", level: 3, text: "Enterprise", style: { fontSize: "20px", color: "#ffffff", margin: "0 0 8px 0" } }),
                    bn({ id: uid(), type: "heading", level: 2, text: "$89 / mo", style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", margin: "0 0 16px 0" } }),
                    bn({ id: uid(), type: "text", text: "• Team collaboration tools\n• Priority server rendering\n• 24/7 dedicated support", style: { fontSize: "14px", lineHeight: "1.8", color: "#9ca3af", whiteSpace: "pre-line" } }),
                  ],
                }),
                bn({
                  id: uid(),
                  type: "button",
                  text: "Contact Sales",
                  href: "#",
                  style: { backgroundColor: "rgba(255,255,255,0.08)", color: "#ffffff", padding: "12px 20px", borderRadius: "10px", textAlign: "center", textDecoration: "none", fontWeight: "600", marginTop: "24px" },
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  },

  // 5. FAQ Accordion
  {
    id: "faq-accordion",
    category: "faq",
    title: "FAQ Questions & Answers",
    description: "Pre-formatted questions with expandable responses for common inquiries",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#121110",
        padding: "72px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children: [
        bn({
          id: uid(),
          type: "heading",
          level: 2,
          text: "Frequently Asked Questions",
          style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 12px 0" },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "Got questions? We have answers to help you get the most out of our visual builder.",
          style: { fontSize: "15px", color: "#9ca3af", textAlign: "center", margin: "0 0 40px 0" },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            width: "100%",
            maxWidth: "760px",
          },
          children: [
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "20px 24px",
                borderRadius: "12px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 4, text: "❓ Do I need coding skills to use this builder?", style: { fontSize: "16px", fontWeight: "700", color: "#f3f4f6", margin: "0 0 8px 0" } }),
                bn({ id: uid(), type: "text", text: "No! Canvas is 100% visual. You can edit text in place, tweak styles with visual controls, or simply tell the AI Assistant to redesign any element.", style: { fontSize: "14px", color: "#9ca3af", margin: "0", lineHeight: "1.5" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "20px 24px",
                borderRadius: "12px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 4, text: "❓ Can I export the clean production HTML code?", style: { fontSize: "16px", fontWeight: "700", color: "#f3f4f6", margin: "0 0 8px 0" } }),
                bn({ id: uid(), type: "text", text: "Yes! Click the 'Download HTML' button in the top bar to receive clean, standalone HTML/CSS that works on Netlify, Vercel, GitHub Pages, or any server.", style: { fontSize: "14px", color: "#9ca3af", margin: "0", lineHeight: "1.5" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: {
                backgroundColor: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "20px 24px",
                borderRadius: "12px",
              },
              children: [
                bn({ id: uid(), type: "heading", level: 4, text: "❓ How does the AI Assistant modify elements?", style: { fontSize: "16px", fontWeight: "700", color: "#f3f4f6", margin: "0 0 8px 0" } }),
                bn({ id: uid(), type: "text", text: "You can click on any element, click the ✨ Sparkles button, and type what you want in Hindi or English. Gemini applies the changes live to your canvas!", style: { fontSize: "14px", color: "#9ca3af", margin: "0", lineHeight: "1.5" } }),
              ],
            }),
          ],
        }),
      ],
    }),
  },

  // 6. Contact Us Form
  {
    id: "contact-form",
    category: "contact",
    title: "Interactive Contact Us Section",
    description: "Name, Email, Message input fields with submit button",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#0e111a",
        padding: "72px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children: [
        bn({
          id: uid(),
          type: "heading",
          level: 2,
          text: "Get in Touch With Us",
          style: { fontSize: "32px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 10px 0" },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "Have a question or proposal? Drop us a message and our team will get back to you within 24 hours.",
          style: { fontSize: "15px", color: "#9ca3af", textAlign: "center", maxWidth: "540px", margin: "0 0 36px 0" },
        }),
        bn({
          id: uid(),
          type: "container",
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "36px",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "520px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
          },
          children: [
            bn({
              id: uid(),
              type: "container",
              style: { display: "flex", flexDirection: "column", gap: "6px" },
              children: [
                bn({ id: uid(), type: "text", text: "Your Name", style: { fontSize: "13px", fontWeight: "600", color: "#e5e7eb", margin: "0" } }),
                bn({ id: uid(), type: "text", text: "Rahul Sharma", style: { backgroundColor: "#1f2937", padding: "10px 14px", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", border: "1px solid #374151" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: { display: "flex", flexDirection: "column", gap: "6px" },
              children: [
                bn({ id: uid(), type: "text", text: "Email Address", style: { fontSize: "13px", fontWeight: "600", color: "#e5e7eb", margin: "0" } }),
                bn({ id: uid(), type: "text", text: "rahul@example.com", style: { backgroundColor: "#1f2937", padding: "10px 14px", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", border: "1px solid #374151" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "container",
              style: { display: "flex", flexDirection: "column", gap: "6px" },
              children: [
                bn({ id: uid(), type: "text", text: "Message", style: { fontSize: "13px", fontWeight: "600", color: "#e5e7eb", margin: "0" } }),
                bn({ id: uid(), type: "text", text: "Tell us about your project requirements...", style: { backgroundColor: "#1f2937", padding: "10px 14px", borderRadius: "8px", color: "#9ca3af", fontSize: "13px", border: "1px solid #374151", minHeight: "60px" } }),
              ],
            }),
            bn({
              id: uid(),
              type: "button",
              text: "Send Message Now 🚀",
              href: "#",
              style: {
                backgroundColor: "#f97316",
                color: "#ffffff",
                padding: "13px 24px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "700",
                textAlign: "center",
                textDecoration: "none",
                marginTop: "10px",
                boxShadow: "0 4px 15px rgba(249, 115, 22, 0.4)",
              },
            }),
          ],
        }),
      ],
    }),
  },

  // 7. Footer
  {
    id: "footer-clean",
    category: "footer",
    title: "Clean Modern Footer",
    description: "Brand logo, links columns, social icons, and copyright",
    generate: (): BNode => bn({
      id: uid(),
      type: "section",
      style: {
        backgroundColor: "#07080c",
        padding: "48px 32px 24px 32px",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      children: [
        bn({
          id: uid(),
          type: "container",
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            maxWidth: "1060px",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "20px",
          },
          children: [
            bn({
              id: uid(),
              type: "heading",
              level: 3,
              text: "Canvas Studio.",
              style: { fontSize: "20px", fontWeight: "800", color: "#ffffff", margin: "0" },
            }),
            bn({
              id: uid(),
              type: "container",
              style: { display: "flex", flexDirection: "row", gap: "24px" },
              children: [
                bn({ id: uid(), type: "text", text: "Privacy Policy", style: { color: "#9ca3af", fontSize: "13px", margin: "0", cursor: "pointer" } }),
                bn({ id: uid(), type: "text", text: "Terms of Service", style: { color: "#9ca3af", fontSize: "13px", margin: "0", cursor: "pointer" } }),
                bn({ id: uid(), type: "text", text: "Documentation", style: { color: "#9ca3af", fontSize: "13px", margin: "0", cursor: "pointer" } }),
                bn({ id: uid(), type: "text", text: "Support", style: { color: "#9ca3af", fontSize: "13px", margin: "0", cursor: "pointer" } }),
              ],
            }),
          ],
        }),
        bn({
          id: uid(),
          type: "divider",
          style: { width: "100%", maxWidth: "1060px", borderColor: "rgba(255, 255, 255, 0.08)", margin: "0 0 24px 0" },
        }),
        bn({
          id: uid(),
          type: "text",
          text: "© 2026 Canvas Visual Builder. All rights reserved. Crafted with precision.",
          style: { fontSize: "12px", color: "#6b7280", margin: "0", textAlign: "center" },
        }),
      ],
    }),
  },
];
