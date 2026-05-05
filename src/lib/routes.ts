export type RouteCategory =
  | "marketing"
  | "auth"
  | "conversion"
  | "app"
  | "account"
  | "resource"
  | "legal";

export interface SiteRoute {
  href: string;
  label: string;
  description: string;
  category: RouteCategory;
  public: boolean;
  sitemap: boolean;
  priority?: number;
  changeFrequency?: "weekly" | "monthly";
}

export const routes = {
  home: {
    href: "/",
    label: "Home",
    description: "SEO AI Regent's product narrative and scoring overview.",
    category: "marketing",
    public: true,
    sitemap: true,
    priority: 1,
    changeFrequency: "weekly",
  },
  features: {
    href: "/features",
    label: "Features",
    description: "Core Content Score, GEO Score, SERP, and editorial guidance features.",
    category: "marketing",
    public: true,
    sitemap: true,
    priority: 0.85,
    changeFrequency: "weekly",
  },
  pricing: {
    href: "/pricing",
    label: "Pricing",
    description: "Plan options for operators, teams, and larger editorial programs.",
    category: "conversion",
    public: true,
    sitemap: true,
    priority: 0.85,
    changeFrequency: "weekly",
  },
  demo: {
    href: "/demo",
    label: "Live Demo",
    description: "Inspect the canonical scoring loop without creating an account.",
    category: "conversion",
    public: true,
    sitemap: true,
    priority: 0.8,
    changeFrequency: "weekly",
  },
  about: {
    href: "/about",
    label: "About",
    description: "Why SEO AI Regent treats Google ranking and AI retrieval as peer surfaces.",
    category: "marketing",
    public: true,
    sitemap: true,
    priority: 0.65,
    changeFrequency: "monthly",
  },
  contact: {
    href: "/contact",
    label: "Contact",
    description: "Sales, support, and launch-readiness contact paths.",
    category: "marketing",
    public: true,
    sitemap: true,
    priority: 0.65,
    changeFrequency: "monthly",
  },
  help: {
    href: "/help",
    label: "Help Center",
    description: "Help paths for scoring, billing, and account access.",
    category: "resource",
    public: true,
    sitemap: true,
    priority: 0.6,
    changeFrequency: "monthly",
  },
  docs: {
    href: "/docs",
    label: "Documentation",
    description: "Product concepts, scoring surfaces, and implementation notes.",
    category: "resource",
    public: true,
    sitemap: true,
    priority: 0.6,
    changeFrequency: "monthly",
  },
  faq: {
    href: "/faq",
    label: "FAQ",
    description: "Answers to common questions about scores, teams, billing, and data handling.",
    category: "resource",
    public: true,
    sitemap: true,
    priority: 0.6,
    changeFrequency: "monthly",
  },
  support: {
    href: "/support",
    label: "Support",
    description: "Support routing for product, billing, and account issues.",
    category: "resource",
    public: true,
    sitemap: true,
    priority: 0.55,
    changeFrequency: "monthly",
  },
  login: {
    href: "/login",
    label: "Login",
    description: "Authenticate into SEO AI Regent.",
    category: "auth",
    public: false,
    sitemap: false,
  },
  register: {
    href: "/register",
    label: "Get Started",
    description: "Create a production account.",
    category: "auth",
    public: false,
    sitemap: false,
  },
  editor: {
    href: "/app/editor",
    label: "Editor",
    description: "Authenticated editor-style scoring workspace.",
    category: "app",
    public: false,
    sitemap: false,
  },
  billing: {
    href: "/account/billing",
    label: "Billing",
    description: "Manage plans, checkout, and customer portal access.",
    category: "account",
    public: false,
    sitemap: false,
  },
  privacy: {
    href: "/privacy",
    label: "Privacy Policy",
    description: "Privacy practices for SEO AI Regent.",
    category: "legal",
    public: true,
    sitemap: true,
    priority: 0.4,
    changeFrequency: "monthly",
  },
  terms: {
    href: "/terms",
    label: "Terms of Service",
    description: "Terms of service for SEO AI Regent.",
    category: "legal",
    public: true,
    sitemap: true,
    priority: 0.4,
    changeFrequency: "monthly",
  },
  cookies: {
    href: "/cookies",
    label: "Cookie Policy",
    description: "How SEO AI Regent uses cookies and consent preferences.",
    category: "legal",
    public: true,
    sitemap: true,
    priority: 0.4,
    changeFrequency: "monthly",
  },
} as const satisfies Record<string, SiteRoute>;

export const primaryNavigation = [
  routes.home,
  routes.features,
  routes.pricing,
  routes.about,
  routes.contact,
  routes.demo,
] as const;

export const authNavigation = [routes.login, routes.register] as const;

export const appNavigation = [routes.editor, routes.billing, routes.help, routes.support] as const;

export const footerGroups = [
  {
    title: "Product",
    links: [routes.features, routes.pricing, routes.demo, routes.editor],
  },
  {
    title: "Company",
    links: [routes.about, routes.contact],
  },
  {
    title: "Resources",
    links: [routes.help, routes.docs, routes.faq, routes.support],
  },
  {
    title: "Legal",
    links: [routes.privacy, routes.terms, routes.cookies],
  },
] as const;

export const sitemapRoutes = Object.values(routes).filter((route) => route.sitemap);

export function getRouteByHref(href: string) {
  return Object.values(routes).find((route) => route.href === href);
}
