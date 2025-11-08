// Ensure ROOT_URL doesn't have trailing slash
const ROOT_URL = (process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000").replace(/\/$/, "");

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Virtuals",
    subtitle: "Discover Virtual Tokens on Base",
    description: "Browse and explore virtual tokens with real-time data, sorting by volume, price change, or age.",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#f0fdf4",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["virtuals", "tokens", "base", "crypto"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Discover Virtual Tokens",
    ogTitle: "Virtuals - Base Mini App",
    ogDescription: "Browse and explore virtual tokens on Base",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;

