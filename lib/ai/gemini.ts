/**
 * Google Gemini API — Product Analysis & Caption Generation
 * https://ai.google.dev/gemini-api/docs
 *
 * Accepts the original product image, analyses it, and returns:
 * - A short product title
 * - A marketing caption / description (SEO-optimised)
 * - A set of relevant hashtags
 *
 * Runs SERVER-SIDE only — the Gemini API key never reaches the client.
 */

import { requireEnv, base64ToBuffer } from "./utils";

export interface GeminiCaptionResult {
  productTitle: string;
  captions: string[];
  hashtags: string[];
}

/**
 * Analyses a product image with Gemini's multimodal vision
 * and generates marketing copy.
 */
export async function generateCaptions(
  imageDataUri: string
): Promise<GeminiCaptionResult> {
  const apiKey = requireEnv("GEMINI_API_KEY");
  const { buffer, mimeType } = base64ToBuffer(imageDataUri);
  const imageBase64Raw = buffer.toString("base64");

  // Gemini v1beta generateContent with inline image
  const body = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageBase64Raw,
            },
          },
          {
            text: `You are an expert marketing copywriter for artisanal, handcrafted toys and gifts.

Analyse this product image and return a JSON object with exactly these keys:

{
  "productTitle": "A short, catchy product name (max 8 words)",
  "captions": [
    "First caption: an engaging, SEO-optimised Instagram caption (~60 words). Highlight craftsmanship and uniqueness.",
    "Second caption: a playful, emotive caption (~50 words). Focus on gift-giving and joy.",
    "Third caption: a concise, hashtag-ready caption (~40 words). Emphasize handmade quality and artisan pride."
  ],
  "hashtags": ["array", "of", "10", "relevant", "hashtags", "without-the-hash-symbol"]
}

IMPORTANT:
- Return ONLY the raw JSON object, no markdown fences, no extra text.
- Generate exactly 3 distinct Instagram captions tailored for an artisanal toy maker.
- Hashtags should be lowercase, no spaces, no # prefix.
- Focus on artisan, handmade, craft, toy, and gift niches.`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 512,
    },
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();

  // Navigate Gemini response structure
  const textContent =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip potential markdown code fences
  const cleaned = textContent
    .replaceAll(/```json\s*/gi, "")
    .replaceAll(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as GeminiCaptionResult;

    // Ensure hashtags never have a leading #
    parsed.hashtags = (parsed.hashtags ?? []).map((h: string) =>
      h.replace(/^#/, "").toLowerCase()
    );

    // Normalise captions — accept both old `caption` (string) and new `captions` (array)
    let captions: string[] = parsed.captions ?? [];
    if (captions.length === 0 && (parsed as unknown as Record<string, unknown>).caption) {
      captions = [String((parsed as unknown as Record<string, unknown>).caption)];
    }

    return {
      productTitle: parsed.productTitle || "Handcrafted Artisan Toy",
      captions:
        captions.length > 0
          ? captions
          : [
              "A beautifully handcrafted artisanal creation, made with love and care.",
              "Give the gift of handmade magic — a toy built to inspire wonder.",
              "Crafted by hand, cherished forever. Shop small, gift big.",
            ],
      hashtags:
        parsed.hashtags.length > 0
          ? parsed.hashtags
          : ["handmade", "artisan", "crafttoy", "handcrafted", "giftideas"],
    };
  } catch {
    // If Gemini returns badly formatted JSON, provide sensible defaults
    console.error("Failed to parse Gemini response:", cleaned);
    return {
      productTitle: "Handcrafted Artisan Toy",
      captions: [
        "A beautifully handcrafted artisanal creation, made with love and extraordinary attention to detail. Perfect as a unique gift for any occasion.",
        "There's something magical about a toy made by hand — every detail tells a story of care and craftsmanship.",
        "Handmade. Heartfelt. Built to last a lifetime of play and imagination.",
      ],
      hashtags: [
        "handmade",
        "artisan",
        "crafttoy",
        "handcrafted",
        "giftideas",
        "uniquetoys",
        "madewithlove",
        "artisantoy",
        "craftboost",
        "shopsmall",
      ],
    };
  }
}
