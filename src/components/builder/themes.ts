export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  buttonRadius: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "modern-saas",
    name: "Modern SaaS (Dark)",
    description: "Deep obsidian navy with electric indigo accents and crisp typography",
    fontFamily: "'Inter', system-ui, sans-serif",
    primaryColor: "#3b82f6",
    accentColor: "#6366f1",
    backgroundColor: "#090d16",
    cardBackground: "#111827",
    textColor: "#f9fafb",
    mutedTextColor: "#9ca3af",
    borderColor: "#1f2937",
    buttonRadius: "10px",
  },
  {
    id: "cyberpunk-neon",
    name: "Cyberpunk Glow",
    description: "Vibrant neon purple, magenta, and cyan with high-tech futuristic contrast",
    fontFamily: "'Space Grotesk', system-ui, sans-serif",
    primaryColor: "#a855f7",
    accentColor: "#06b6d4",
    backgroundColor: "#06030c",
    cardBackground: "#110b22",
    textColor: "#faf5ff",
    mutedTextColor: "#c084fc",
    borderColor: "#3b0764",
    buttonRadius: "12px",
  },
  {
    id: "apple-minimal",
    name: "Minimalist Clean (Light)",
    description: "Crisp white studio aesthetic, deep black accents, and pure whitespace",
    fontFamily: "'Inter', system-ui, sans-serif",
    primaryColor: "#18181b",
    accentColor: "#f97316",
    backgroundColor: "#ffffff",
    cardBackground: "#f4f4f5",
    textColor: "#09090b",
    mutedTextColor: "#71717a",
    borderColor: "#e4e4e7",
    buttonRadius: "9999px",
  },
  {
    id: "luxury-warm",
    name: "Luxury Warm Beige",
    description: "Warm parchment tones, deep espresso typography, and gold highlights",
    fontFamily: "'Playfair Display', Georgia, serif",
    primaryColor: "#d97706",
    accentColor: "#b45309",
    backgroundColor: "#fcfaf7",
    cardBackground: "#f5f0ea",
    textColor: "#292524",
    mutedTextColor: "#78716c",
    borderColor: "#e7e0d6",
    buttonRadius: "8px",
  },
  {
    id: "emerald-forest",
    name: "Emerald Horizon",
    description: "Deep pine green background with glowing jade and gold accents",
    fontFamily: "'Outfit', system-ui, sans-serif",
    primaryColor: "#10b981",
    accentColor: "#14b8a6",
    backgroundColor: "#051814",
    cardBackground: "#0b2b24",
    textColor: "#ecfdf5",
    mutedTextColor: "#6ee7b7",
    borderColor: "#164e40",
    buttonRadius: "12px",
  },
  {
    id: "sunset-coral",
    name: "Sunset Ember",
    description: "Warm charcoal dark mode with fiery coral and amber radiant glow",
    fontFamily: "'Poppins', system-ui, sans-serif",
    primaryColor: "#f97316",
    accentColor: "#fbbf24",
    backgroundColor: "#121110",
    cardBackground: "#1c1917",
    textColor: "#fafaf9",
    mutedTextColor: "#a8a29e",
    borderColor: "#292524",
    buttonRadius: "9999px",
  },
];

export const GOOGLE_FONTS = [
  { name: "Inter (Clean & Modern)", value: "'Inter', system-ui, sans-serif" },
  { name: "Poppins (Friendly Geometric)", value: "'Poppins', system-ui, sans-serif" },
  { name: "Playfair Display (Editorial Serif)", value: "'Playfair Display', Georgia, serif" },
  { name: "Space Grotesk (Tech & Futuristic)", value: "'Space Grotesk', system-ui, sans-serif" },
  { name: "Outfit (Trendy & Bold)", value: "'Outfit', system-ui, sans-serif" },
  { name: "Roboto (Neutral Standard)", value: "'Roboto', system-ui, sans-serif" },
  { name: "DM Sans (Geometric Sans)", value: "'DM Sans', system-ui, sans-serif" },
];
