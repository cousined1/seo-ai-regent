export interface ArticleContent {
  title: string;
  headings: string[];
  hasFaq: boolean;
  hasHowTo: boolean;
  hasProduct: boolean;
  hasReview: boolean;
  author: string;
  publishedDate: string;
  url?: string;
  description?: string;
  faqData?: {
    questions: Array<{ question: string; answer: string }>;
  };
  howtoData?: {
    steps: Array<{ name: string; text: string }>;
  };
}

export interface SchemaRecommendation {
  type: string;
  confidence: number;
  explanation: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

interface JsonLdBase {
  "@context": string;
  "@type": string;
}

interface ArticleJsonLd extends JsonLdBase {
  headline: string;
  author: { "@type": string; name: string };
  datePublished: string;
  description?: string;
  image?: string;
}

interface FaqJsonLd extends JsonLdBase {
  mainEntity: Array<{
    "@type": string;
    name: string;
    acceptedAnswer: { "@type": string; text: string };
  }>;
}

interface HowToJsonLd extends JsonLdBase {
  name: string;
  step: Array<{
    "@type": string;
    name: string;
    text: string;
  }>;
}

type JsonLdOutput = ArticleJsonLd | FaqJsonLd | HowToJsonLd | Record<string, unknown>;

export function recommendSchemaTypes(
  content: ArticleContent
): SchemaRecommendation[] {
  const recommendations: SchemaRecommendation[] = [];

  // Article schema - almost always applicable
  if (content.title && content.author) {
    recommendations.push({
      type: "ARTICLE",
      confidence: 0.9,
      explanation: "Standard Article schema for blog posts and articles. Improves visibility in Google News and Top Stories.",
    });
  }

  // FAQ schema
  if (content.hasFaq || content.faqData?.questions?.length) {
    const questionCount = content.faqData?.questions?.length || 0;
    const headingFaqCount = content.headings.filter((h) =>
      /^(what|how|why|when|where|who|is|can|does|should)/i.test(h)
    ).length;

    const totalQuestions = Math.max(questionCount, headingFaqCount);
    if (totalQuestions > 0) {
      recommendations.push({
        type: "FAQ",
        confidence: Math.min(0.5 + totalQuestions * 0.1, 0.95),
        explanation: `Detected ${totalQuestions} FAQ-style headings/questions. FAQ schema enables rich results in search.`,
      });
    }
  }

  // HowTo schema
  if (content.hasHowTo) {
    const stepCount = content.headings.filter(
      (h) => /^step \d|step one|step two|step three/i.test(h)
    ).length;

    recommendations.push({
      type: "HOW_TO",
      confidence: stepCount > 0 ? 0.85 : 0.6,
      explanation: `How-to content detected${stepCount > 0 ? ` with ${stepCount} steps` : ""}. HowTo schema enables step-by-step rich results.`,
    });
  }

  // Review schema
  if (content.hasReview) {
    recommendations.push({
      type: "REVIEW",
      confidence: 0.8,
      explanation: "Review content detected. Review schema enables star ratings in search results.",
    });
  }

  // Product schema
  if (content.hasProduct) {
    recommendations.push({
      type: "PRODUCT",
      confidence: 0.75,
      explanation: "Product-related content detected. Product schema enables rich product information in search.",
    });
  }

  // Sort by confidence descending
  recommendations.sort((a, b) => b.confidence - a.confidence);

  return recommendations;
}

export function generateJsonLd(
  schemaType: string,
  content: ArticleContent
): JsonLdOutput {
  switch (schemaType) {
    case "ARTICLE":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: content.title,
        author: {
          "@type": "Person",
          name: content.author,
        },
        datePublished: content.publishedDate,
        description: content.description || "",
        ...(content.url ? { url: content.url } : {}),
      };

    case "FAQ": {
      const questions = content.faqData?.questions || [];
      const headingQuestions = content.headings
        .filter((h) => /^(what|how|why|when|where|who|is|can|does|should)/i.test(h))
        .map((q) => ({ question: q, answer: "Answer to be provided." }));

      const allQuestions = questions.length > 0 ? questions : headingQuestions;

      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: allQuestions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
      };
    }

    case "HOW_TO": {
      const steps = content.howtoData?.steps || [];

      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: content.title,
        step: steps.map((s) => ({
          "@type": "HowToStep",
          name: s.name,
          text: s.text,
        })),
      };
    }

    case "REVIEW":
      return {
        "@context": "https://schema.org",
        "@type": "Review",
        itemReviewed: {
          "@type": "Product",
          name: content.title,
        },
        author: {
          "@type": "Person",
          name: content.author,
        },
        datePublished: content.publishedDate,
        reviewBody: content.description || "",
      };

    case "BREADCRUMB":
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://example.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.title,
          },
        ],
      };

    default:
      return {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: content.title,
      };
  }
}

export function validateJsonLd(
  schemaType: string,
  jsonLd: Record<string, unknown>
): ValidationResult {
  const errors: string[] = [];

  // Basic validation
  if (!jsonLd["@context"]) {
    errors.push("Missing @context field");
  } else if (jsonLd["@context"] !== "https://schema.org") {
    errors.push("@context should be https://schema.org");
  }

  if (!jsonLd["@type"]) {
    errors.push("Missing @type field");
  }

  // Type-specific validation
  switch (schemaType) {
    case "ARTICLE": {
      const article = jsonLd as unknown as ArticleJsonLd;
      if (!article.headline) errors.push("Article missing headline");
      if (!article.author) errors.push("Article missing author");
      if (!article.datePublished) errors.push("Article missing datePublished");
      break;
    }

    case "FAQ": {
      const faq = jsonLd as unknown as FaqJsonLd;
      if (!faq.mainEntity || !Array.isArray(faq.mainEntity)) {
        errors.push("FAQ missing mainEntity array");
      } else if (faq.mainEntity.length === 0) {
        errors.push("FAQ must have at least one question");
      } else {
        for (let i = 0; i < faq.mainEntity.length; i++) {
          const q = faq.mainEntity[i];
          if (!q.name) errors.push(`FAQ question ${i + 1} missing name`);
          if (!q.acceptedAnswer?.text)
            errors.push(`FAQ question ${i + 1} missing answer`);
        }
      }
      break;
    }

    case "HOW_TO": {
      const howto = jsonLd as unknown as HowToJsonLd;
      if (!howto.name) errors.push("HowTo missing name");
      if (!howto.step || !Array.isArray(howto.step)) {
        errors.push("HowTo missing step array");
      } else if (howto.step.length === 0) {
        errors.push("HowTo must have at least one step");
      }
      break;
    }

    case "REVIEW": {
      if (!jsonLd.itemReviewed) errors.push("Review missing itemReviewed");
      if (!jsonLd.author) errors.push("Review missing author");
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
