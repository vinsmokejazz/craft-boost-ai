/**
 * Runtime validation for required server-only environment variables.
 * Call from any server-side code — throws with a clear message
 * if a key is missing, preventing silent failures.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Add it to .env.local (see .env.local.example).`
    );
  }
  return value;
}

/**
 * Extracts the raw binary buffer and MIME type from a base64 data-URI.
 * e.g. "data:image/png;base64,iVBOR..." → { buffer, mimeType: "image/png" }
 */
export function base64ToBuffer(dataUri: string): {
  buffer: Buffer;
  mimeType: string;
} {
  const match = /^data:(.+?);base64,([\s\S]+)$/.exec(dataUri);
  if (!match) {
    throw new Error("Invalid base64 data-URI");
  }
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], "base64"),
  };
}

/**
 * Converts a raw buffer back to a base64 data-URI.
 */
export function bufferToBase64(buffer: Buffer, mimeType: string): string {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}
