"use server";

import { connectDB } from "@/lib/db/connect";
import ProductPost, { type IProductPost } from "@/lib/db/models/ProductPost";
import { revalidatePath } from "next/cache";

/* ─────────────── Serialisation Helper ─────────────── */

/**
 * Mongoose documents carry methods, __v, etc.
 * Serialise to a plain object safe for the server → client boundary.
 */
function serialise(doc: IProductPost) {
  const obj = doc.toObject();
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

export type SerializedPost = ReturnType<typeof serialise>;

/* ─────────────── saveProductPost ─────────────── */

/**
 * Creates a new ProductPost from AI-processed data.
 * Called by the API route after the full pipeline completes,
 * or manually to persist initial upload state.
 */
export async function saveProductPost(
  data: {
    originalImage: string;
    processedImage?: string;
    captions?: string[];
    hashtags?: string[];
    productTitle?: string;
    status?: IProductPost["status"];
  }
): Promise<SerializedPost> {
  await connectDB();

  const post = await ProductPost.create({
    originalImage: data.originalImage,
    processedImage: data.processedImage ?? undefined,
    captions: data.captions ?? [],
    hashtags: data.hashtags ?? [],
    productTitle: data.productTitle ?? undefined,
    status: data.status ?? "pending",
  });

  revalidatePath("/");
  return serialise(post);
}

/* ─────────────── getRecentPosts ─────────────── */

/**
 * Fetches the latest posts, sorted by newest first.
 * Supports pagination and optional status filtering.
 */
export async function getRecentPosts(
  page = 1,
  limit = 12,
  statusFilter?: IProductPost["status"]
): Promise<{
  posts: SerializedPost[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await connectDB();

  const query = statusFilter ? { status: statusFilter } : {};
  const skip = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    ProductPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ProductPost.countDocuments(query),
  ]);

  return {
    posts: docs.map(serialise),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/* ─────────────── getProductPost ─────────────── */

/**
 * Fetches a single post by ID. Returns null if not found.
 */
export async function getProductPost(id: string): Promise<SerializedPost | null> {
  await connectDB();

  const post = await ProductPost.findById(id).lean<IProductPost>();
  if (!post) return null;

  return {
    id: String(post._id),
    originalImage: post.originalImage,
    processedImage: post.processedImage ?? null,
    captions: post.captions ?? [],
    hashtags: post.hashtags ?? [],
    productTitle: post.productTitle ?? null,
    status: post.status,
    errorMessage: post.errorMessage ?? null,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
  };
}

/* ─────────────── updateProductPost ─────────────── */

/**
 * Partially updates a post. Used by the AI pipeline for
 * incremental progress saves.
 */
export async function updateProductPost(
  id: string,
  data: Partial<
    Pick<
      IProductPost,
      | "processedImage"
      | "captions"
      | "hashtags"
      | "productTitle"
      | "status"
      | "errorMessage"
    >
  >
): Promise<SerializedPost> {
  await connectDB();

  const post = await ProductPost.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!post) throw new Error(`Post ${id} not found`);

  revalidatePath("/");
  return serialise(post);
}

/* ─────────────── deleteProductPost ─────────────── */

/**
 * Permanently removes a post.
 */
export async function deleteProductPost(id: string): Promise<{ success: true; id: string }> {
  await connectDB();

  const result = await ProductPost.findByIdAndDelete(id);
  if (!result) throw new Error(`Post ${id} not found`);

  revalidatePath("/");
  return { success: true, id };
}
