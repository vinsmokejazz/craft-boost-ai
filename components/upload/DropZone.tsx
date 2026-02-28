"use client";

import { useCallback, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, X, CheckCircle2 } from "lucide-react";

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  acceptedTypes?: string[];
  maxSizeMB?: number;
}

export default function DropZone({
  onFileAccepted,
  acceptedTypes = ["image/png", "image/jpeg", "image/webp"],
  maxSizeMB = 10,
}: Readonly<DropZoneProps>) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Unsupported format. Please upload ${acceptedTypes
          .map((t) => t.split("/")[1].toUpperCase())
          .join(", ")}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large. Maximum size is ${maxSizeMB} MB`;
      }
      return null;
    },
    [acceptedTypes, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onFileAccepted(file);
    },
    [validate, onFileAccepted]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearPreview = () => {
    setPreview(null);
    setFileName(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

    let borderClass = "border-white/8 bg-surface hover:border-white/15";
    if (isDragOver) {
      borderClass = "border-accent bg-accent/5";
    } else if (preview) {
      borderClass = "border-accent/30 bg-surface-elevated";
    }

    return (
    <div className="w-full">
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        whileHover={preview ? {} : { scale: 1.005 }}
        whileTap={preview ? {} : { scale: 0.995 }}
        className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-colors duration-300 ${borderClass}`}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={onSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {preview ? (
            /* ── Preview state ── */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="relative flex flex-col items-center gap-4 p-6"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-72 w-auto rounded-xl object-contain"
                />
                {/* Subtle glow */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/20" />
              </div>

              {/* File info */}
              <div className="flex items-center gap-2 text-sm text-white/60">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="max-w-50 truncate">{fileName}</span>
              </div>

              {/* Clear button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview();
                }}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 transition hover:bg-black/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            /* ── Idle / drag state ── */
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 px-6 py-16"
            >
              {/* Animated icon ring */}
              <motion.div
                animate={
                  isDragOver
                    ? { scale: 1.15, rotate: 6 }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative flex h-16 w-16 items-center justify-center"
              >
                <div className="absolute inset-0 rounded-2xl bg-accent/10 animate-pulse-glow" />
                {isDragOver ? (
                  <ImagePlus className="relative z-10 h-8 w-8 text-accent-bright" />
                ) : (
                  <Upload className="relative z-10 h-8 w-8 text-accent" />
                )}
              </motion.div>

              <div className="text-center">
                <p className="text-base font-medium text-foreground">
                  {isDragOver
                    ? "Drop your image here"
                    : "Drag & drop your craft photo"}
                </p>
                <p className="mt-1 text-sm text-white/40">
                  or{" "}
                  <span className="text-accent underline underline-offset-2">
                    browse files
                  </span>{" "}
                  — PNG, JPG, WebP up to {maxSizeMB} MB
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag-over ambient glow */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(167,139,250,0.08) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 text-sm text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
