/**
 * POST /api/process
 *
 * Orchestrates the full AI pipeline for a ProductPost:
 *   1. Fetch the post from MongoDB (validates it exists)
 *   2. Photoroom  → remove background
 *   3. Gemini     → analyse image, generate title + 3 captions + hashtags
 *   4. Stability  → generate lifestyle scene
 *   5. Update the post with all results, set status = "completed"
 *
 * All API keys stay server-side.  The client only sends { postId }.
 *
 * Returns the fully serialised, completed ProductPost.
 */

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import ProductPost from "@/lib/db/models/ProductPost";
import { removeBackground } from "@/lib/ai/photoroom";
import { generateScene } from "@/lib/ai/stability";
import { generateCaptions } from "@/lib/ai/gemini";

/** Exact scene prompt from the specification */
const SCENE_PROMPT =
  "A bright, sunny, minimalist playroom with natural lighting, soft shadows, " +
  "and a clean aesthetic, perfect for showcasing handcrafted wooden toys.";

export async function POST(req: NextRequest) {
  try {
    const { postId } = (await req.json()) as { postId?: string };

    if (!postId) {
      return NextResponse.json(
        { error: "Missing required field: postId" },
        { status: 400 }
      );
    }

    /* ── 1. Fetch the post ── */
    await connectDB();
    const post = await ProductPost.findById(postId);

    if (!post) {
      return NextResponse.json(
        { error: `Post ${postId} not found` },
        { status: 404 }
      );
    }

    // Guard: don't re-process an already-completed post
    if (post.status === "completed") {
      return NextResponse.json(serialise(post));
    }

    // Mark as processing
    post.status = "processing";
    await post.save();

    const originalImage = post.originalImage;

    /* ── 2. Background removal (Photoroom) ── */
    let removedBgImage: string;
    try {
      const bgResult = await removeBackground(originalImage);
      removedBgImage = bgResult.imageBase64;
      // No dedicated field — we store the final image in processedImage later
      await post.save();
    } catch (err) {
      console.error("Photoroom failed:", err);
      return await failPost(post, "Background removal failed", err);
    }

    /* ── 3. Caption generation (Gemini) — 3 captions + hashtags ── */
    let productTitle: string;
    let captions: string[];
    let hashtags: string[];
    try {
      const geminiResult = await generateCaptions(originalImage);
      productTitle = geminiResult.productTitle;
      captions = geminiResult.captions;
      hashtags = geminiResult.hashtags;
      post.productTitle = productTitle;
      post.captions = captions;
      post.hashtags = hashtags;
      await post.save();
    } catch (err) {
      console.error("Gemini failed:", err);
      return await failPost(post, "Caption generation failed", err);
    }

    /* ── 4. Scene generation (Stability AI) ── */
    try {
      const sceneResult = await generateScene(removedBgImage, SCENE_PROMPT);
      post.processedImage = sceneResult.imageBase64;
      await post.save();
    } catch (err) {
      console.error("Stability AI failed:", err);
      // Scene gen is non-critical — fallback to background-removed image
      post.processedImage = removedBgImage;
      console.warn("Falling back to removed-bg image for scene");
    }

    /* ── 5. Mark complete ── */
    post.status = "completed";
    post.errorMessage = undefined;
    await post.save();

    return NextResponse.json(serialise(post));
  } catch (err) {
    console.error("Process API unhandled error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/* ── Helpers ── */

async function failPost(
  post: InstanceType<typeof ProductPost>,
  message: string,
  err: unknown
) {
  post.status = "failed";
  post.errorMessage = `${message}: ${err instanceof Error ? err.message : String(err)}`;
  await post.save();
  return NextResponse.json(
    { error: post.errorMessage },
    { status: 502 }
  );
}

function serialise(post: InstanceType<typeof ProductPost>) {
  const obj = post.toObject();
  return {
    id: String(obj._id),
    originalImage: obj.originalImage,
    processedImage: obj.processedImage ?? null,
    captions: obj.captions ?? [],
    hashtags: obj.hashtags ?? [],
    productTitle: obj.productTitle ?? null,
    status: obj.status,
    errorMessage: obj.errorMessage ?? null,
    createdAt: obj.createdAt.toISOString(),
    updatedAt: obj.updatedAt.toISOString(),
  };
}
