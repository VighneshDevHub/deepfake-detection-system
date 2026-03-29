"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Upload, X, File, Video, Image as ImageIcon, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: Accept;
  maxSize?: number;
  className?: string;
  type?: "image" | "video" | "both";
}

export function FileUploader({
  onFileSelect,
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB
  className,
  type = "both",
}: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
      }
    },
    [onFileSelect]
  );

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreview(null);
  };

  const defaultAccept: Accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    "video/*": [".mp4", ".avi", ".mov", ".mkv"],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || (type === "image" ? { "image/*": [".jpeg", ".jpg", ".png", ".webp"] } : type === "video" ? { "video/*": [".mp4", ".avi", ".mov", ".mkv"] } : defaultAccept),
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 transition-all hover:bg-white/5 backdrop-blur-3xl",
        isDragActive
          ? "border-primary bg-primary/5 glow-primary"
          : "border-white/10 bg-white/5",
        className
      )}
    >
      <input {...getInputProps()} />

      {selectedFile ? (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative group">
            {preview ? (
              <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-2xl bg-zinc-800 border border-white/10 shadow-2xl">
                {selectedFile.type.startsWith("video/") ? (
                  <Video size={64} className="text-zinc-600" />
                ) : (
                  <File size={64} className="text-zinc-600" />
                )}
              </div>
            )}
            <button
              onClick={removeFile}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-error text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-20"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-black text-white">{selectedFile.name}</p>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • READY FOR SCAN
            </p>
          </div>
          
          <Button variant="outline" size="sm" className="rounded-xl border-white/5 bg-white/5 font-bold text-zinc-400">
            CHANGE FILE
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary glow-primary group-hover:scale-110 transition-all">
            <ShieldAlert size={40} />
          </div>
          <div className="text-center">
            <p className="mb-2 text-xl font-black text-white">
              {isDragActive ? "DROP FORENSIC DATA" : "INITIALIZE SCAN"}
            </p>
            <p className="text-sm font-medium text-zinc-500 max-w-xs mx-auto">
              {type === "image" ? "Upload JPEG, PNG, or WebP" : type === "video" ? "Upload MP4, AVI, MOV, or MKV" : "Drag & drop images or videos for deepfake analysis."}
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
              <ImageIcon size={14} className="text-primary" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Images</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 border border-white/5">
              <Video size={14} className="text-accent" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Videos</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
