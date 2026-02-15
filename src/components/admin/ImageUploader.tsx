"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface UploadedImage {
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newImages = [...images];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url } = await res.json();
          newImages.push({
            url,
            altText: file.name.replace(/\.[^/.]+$/, ""),
            isPrimary: newImages.length === 0,
            sortOrder: newImages.length,
          });
        }
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    onChange(newImages);
    setUploading(false);
  }

  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index);
    if (newImages.length > 0 && !newImages.some((img) => img.isPrimary)) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  }

  function setPrimary(index: number) {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(newImages);
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">Product Images</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square bg-muted rounded-sm overflow-hidden group">
            <Image src={img.url} alt={img.altText} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPrimary(i)}
                className={`text-xs px-2 py-1 rounded ${img.isPrimary ? "bg-accent text-white" : "bg-white text-foreground"}`}
              >
                {img.isPrimary ? "Primary" : "Set Primary"}
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="text-xs px-2 py-1 rounded bg-red-500 text-white"
              >
                Remove
              </button>
            </div>
            {img.isPrimary && (
              <span className="absolute top-1 left-1 bg-accent text-white text-[10px] px-1.5 py-0.5 rounded">
                Primary
              </span>
            )}
          </div>
        ))}
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleUpload(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-border rounded-sm p-8 text-center cursor-pointer hover:border-accent transition-colors"
      >
        {uploading ? (
          <p className="text-sm text-text-muted">Uploading...</p>
        ) : (
          <>
            <p className="text-sm text-text-muted">Drag and drop images here, or click to browse</p>
            <p className="text-xs text-text-muted mt-1">JPEG, PNG, WebP, GIF (max 5MB)</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>
    </div>
  );
}
