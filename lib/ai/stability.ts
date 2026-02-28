/**
 * Stability AI — Generative Scene Fill
 * https://platform.stability.ai/docs/api-reference
 *
 * Takes a product image (with transparent / removed background)
 * and generates a stylised lifestyle scene around it.
 *
 * Runs SERVER-SIDE only.
 */

import { requireEnv, base64ToBuffer, bufferToBase64 } from "./utils";

export interface GenerateSceneResult {
  /** Final composed image as a base64 data-URI */
  imageBase64: string;
}

/**
 * Generates a lifestyle scene around the product.
 *
 * @param removedBgDataUri  The transparent-background product image (PNG data-URI)
 * @param prompt            Text prompt describing the desired scene
 */
export async function generateScene(
  removedBgDataUri: string,
  prompt: string
): Promise<GenerateSceneResult> {
  const apiKey = requireEnv("STABILITY_API_KEY");
  const { buffer } = base64ToBuffer(removedBgDataUri);

  // Use Stable Diffusion's "image-to-image" or "inpaint" endpoint.
  // We send the cutout product and ask for an outpaint / scene fill.
  const formData = new FormData();
  formData.append(
    "image",
    new Blob([new Uint8Array(buffer)], { type: "image/png" }),
    "product.png"
  );
  formData.append("prompt", prompt);
  formData.append("output_format", "png");

  // Stability AI v2beta search-and-replace / outpaint endpoint
  const response = await fetch(
    "https://api.stability.ai/v2beta/stable-image/edit/search-and-replace",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "image/*",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Stability AI error (${response.status}): ${errText}`
    );
  }

  const resultBuffer = Buffer.from(await response.arrayBuffer());
  return {
    imageBase64: bufferToBase64(resultBuffer, "image/png"),
  };
}

/**
 * Build a rich scene-generation prompt based on what the AI
 * knows about the product. Called from the orchestrator.
 */
export function buildScenePrompt(productTitle: string): string {
  return (
    `A beautiful, high-end product photography scene for a handcrafted artisanal toy: "${productTitle}". ` +
    `The toy is placed on a rustic wooden surface with soft, warm studio lighting. ` +
    `Blurred cozy background with fairy lights, craft supplies, and warm earth tones. ` +
    `Professional lifestyle product photography, shallow depth of field, 4K quality.`
  );
}
