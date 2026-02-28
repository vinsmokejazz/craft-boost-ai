/**
 * Photoroom API — Background Removal
 * https://www.photoroom.com/api/docs
 *
 * Accepts a product image, returns the same image with
 * a transparent (removed) background as a PNG buffer.
 *
 * Runs SERVER-SIDE only — the API key never reaches the client.
 */

import { requireEnv, base64ToBuffer, bufferToBase64 } from "./utils";

export interface RemoveBgResult {
  /** Transparent-background image as a base64 data-URI (PNG) */
  imageBase64: string;
}

export async function removeBackground(
  imageDataUri: string
): Promise<RemoveBgResult> {
  const apiKey = requireEnv("PHOTOROOM_API_KEY");
  const { buffer, mimeType } = base64ToBuffer(imageDataUri);

  // Photoroom expects a multipart/form-data POST
  const formData = new FormData();
  formData.append(
    "image_file",
    new Blob([new Uint8Array(buffer)], { type: mimeType }),
    "product.png"
  );

  const response = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Photoroom API error (${response.status}): ${errText}`
    );
  }

  const resultBuffer = Buffer.from(await response.arrayBuffer());
  return {
    imageBase64: bufferToBase64(resultBuffer, "image/png"),
  };
}
