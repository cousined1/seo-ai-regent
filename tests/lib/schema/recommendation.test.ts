import { describe, it, expect } from "vitest";
import {
  recommendSchemaTypes,
  generateJsonLd,
  validateJsonLd,
  type ArticleContent,
  type SchemaRecommendation,
  type ValidationResult,
} from "@/lib/schema/recommendation";

describe("recommendSchemaTypes", () => {
  it("recommends Article schema for blog-style content", () => {
    const content: ArticleContent = {
      title: "How to Do Keyword Research in 2024",
      headings: ["Introduction", "Step 1: Brainstorm Topics", "Conclusion"],
      hasFaq: false,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
      author: "John Doe",
      publishedDate: "2024-01-15",
    };

    const recommendations = recommendSchemaTypes(content);

    const articleRec = recommendations.find((r) => r.type === "ARTICLE");
    expect(articleRec).toBeDefined();
    expect(articleRec!.confidence).toBeGreaterThan(0.7);
  });

  it("recommends FAQ schema when questions are detected", () => {
    const content: ArticleContent = {
      title: "SEO FAQ Guide",
      headings: ["What is SEO?", "How does SEO work?", "Why is SEO important?"],
      hasFaq: true,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
      author: "Jane Smith",
      publishedDate: "2024-02-20",
    };

    const recommendations = recommendSchemaTypes(content);

    const faqRec = recommendations.find((r) => r.type === "FAQ");
    expect(faqRec).toBeDefined();
    expect(faqRec!.confidence).toBeGreaterThan(0.5);
  });

  it("recommends HowTo schema for step-by-step content", () => {
    const content: ArticleContent = {
      title: "How to Build a Website",
      headings: ["Step 1: Choose a Domain", "Step 2: Get Hosting", "Step 3: Install WordPress"],
      hasFaq: false,
      hasHowTo: true,
      hasProduct: false,
      hasReview: false,
      author: "Bob Wilson",
      publishedDate: "2024-03-10",
    };

    const recommendations = recommendSchemaTypes(content);

    const howtoRec = recommendations.find((r) => r.type === "HOW_TO");
    expect(howtoRec).toBeDefined();
    expect(howtoRec!.confidence).toBeGreaterThan(0.7);
  });

  it("recommends multiple schema types when applicable", () => {
    const content: ArticleContent = {
      title: "Best SEO Tools Review",
      headings: ["Introduction", "Tool 1: Ahrefs", "Tool 2: SEMrush", "FAQ"],
      hasFaq: true,
      hasHowTo: false,
      hasProduct: false,
      hasReview: true,
      author: "Alice Brown",
      publishedDate: "2024-04-05",
    };

    const recommendations = recommendSchemaTypes(content);

    expect(recommendations.length).toBeGreaterThanOrEqual(2);
    const types = recommendations.map((r) => r.type);
    expect(types).toContain("ARTICLE");
    expect(types).toContain("REVIEW");
  });

  it("returns empty recommendations for minimal content", () => {
    const content: ArticleContent = {
      title: "Short Post",
      headings: [],
      hasFaq: false,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
      author: "Unknown",
      publishedDate: "2024-05-01",
    };

    const recommendations = recommendSchemaTypes(content);

    expect(recommendations.length).toBeLessThanOrEqual(1);
  });
});

describe("generateJsonLd", () => {
  it("generates valid Article JSON-LD", () => {
    const jsonLd = generateJsonLd("ARTICLE", {
      title: "Test Article",
      author: "John Doe",
      publishedDate: "2024-01-15",
      url: "https://example.com/article",
      description: "A test article",
      headings: ["Introduction", "Body", "Conclusion"],
      hasFaq: false,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
    });

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Article");
    expect((jsonLd as any).headline).toBe("Test Article");
    expect((jsonLd as any).author.name).toBe("John Doe");
  });

  it("generates FAQ JSON-LD with questions and answers", () => {
    const faqData = {
      questions: [
        { question: "What is SEO?", answer: "SEO stands for Search Engine Optimization." },
        { question: "Why is SEO important?", answer: "SEO helps your website rank higher." },
      ],
    };

    const jsonLd = generateJsonLd("FAQ", {
      title: "SEO FAQ",
      author: "Jane",
      publishedDate: "2024-02-20",
      url: "https://example.com/faq",
      description: "FAQ about SEO",
      headings: [],
      hasFaq: true,
      hasHowTo: false,
      hasProduct: false,
      hasReview: false,
      faqData,
    });

    expect(jsonLd["@type"]).toBe("FAQPage");
    expect((jsonLd as any).mainEntity).toHaveLength(2);
    expect((jsonLd as any).mainEntity[0]["@type"]).toBe("Question");
  });

  it("generates HowTo JSON-LD with steps", () => {
    const howtoData = {
      steps: [
        { name: "Step 1", text: "Choose a domain name" },
        { name: "Step 2", text: "Get web hosting" },
      ],
    };

    const jsonLd = generateJsonLd("HOW_TO", {
      title: "How to Build a Website",
      author: "Bob",
      publishedDate: "2024-03-10",
      url: "https://example.com/howto",
      description: "Step-by-step guide",
      headings: [],
      hasFaq: false,
      hasHowTo: true,
      hasProduct: false,
      hasReview: false,
      howtoData,
    });

    expect(jsonLd["@type"]).toBe("HowTo");
    expect((jsonLd as any).step).toHaveLength(2);
  });
});

describe("validateJsonLd", () => {
  it("returns valid for well-formed Article JSON-LD", () => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Test Article",
      author: { "@type": "Person", name: "John" },
      datePublished: "2024-01-15",
    };

    const result: ValidationResult = validateJsonLd("ARTICLE", jsonLd);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("returns errors for missing required fields", () => {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
    };

    const result: ValidationResult = validateJsonLd("ARTICLE", jsonLd);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("validates FAQ schema structure", () => {
    const validFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is SEO?",
          acceptedAnswer: { "@type": "Answer", text: "SEO is optimization." },
        },
      ],
    };

    const result: ValidationResult = validateJsonLd("FAQ", validFaq);
    expect(result.valid).toBe(true);
  });

  it("detects invalid FAQ structure", () => {
    const invalidFaq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    };

    const result: ValidationResult = validateJsonLd("FAQ", invalidFaq);
    expect(result.valid).toBe(false);
  });

  it("validates HowTo schema structure", () => {
    const validHowTo = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to Build a Website",
      step: [
        { "@type": "HowToStep", name: "Step 1", text: "Choose a domain" },
      ],
    };

    const result: ValidationResult = validateJsonLd("HOW_TO", validHowTo);
    expect(result.valid).toBe(true);
  });
});
