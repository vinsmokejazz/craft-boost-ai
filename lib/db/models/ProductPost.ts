import mongoose, { Schema, type Document, type Model } from "mongoose";

/* ── TypeScript Interface ── */

export interface IProductPost extends Document {
  /** Original uploaded image (base64 data-URI or cloud URL) */
  originalImage: string;

  /** Final AI-processed image (scene-generated or bg-removed fallback) */
  processedImage?: string;

  /** Array of AI-generated marketing captions (typically 3) */
  captions: string[];

  /** AI-generated SEO hashtags */
  hashtags: string[];

  /** Short product title inferred by the AI */
  productTitle?: string;

  /** Processing status for tracking within the pipeline */
  status: "pending" | "processing" | "completed" | "failed";

  /** Optional error message when status === "failed" */
  errorMessage?: string;

  /** Auto-managed timestamps */
  createdAt: Date;
  updatedAt: Date;
}

/* ── Mongoose Schema ── */

const ProductPostSchema = new Schema<IProductPost>(
  {
    originalImage: { type: String, required: true },
    processedImage: { type: String, default: undefined },
    captions: { type: [String], default: [] },
    hashtags: { type: [String], default: [] },
    productTitle: { type: String, default: undefined },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    errorMessage: { type: String, default: undefined },
  },
  {
    timestamps: true, // auto createdAt / updatedAt
  }
);

/* ── Indexes ── */
ProductPostSchema.index({ status: 1, createdAt: -1 });

/**
 * Reuse existing model during dev hot-reloads,
 * otherwise compile a fresh one.
 */
const ProductPost: Model<IProductPost> =
  mongoose.models.ProductPost ??
  mongoose.model<IProductPost>("ProductPost", ProductPostSchema);

export default ProductPost;
