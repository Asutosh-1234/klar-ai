'use client'

import * as React from "react";
import { ComposeAttachment } from "@/lib/types";

interface ComposeAttachmentsProps {
  attachments: ComposeAttachment[];
  onRemove: (idx: number) => void;
}

export function ComposeAttachments({
  attachments,
  onRemove,
}: ComposeAttachmentsProps) {
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video_file";
    if (mimeType.startsWith("audio/")) return "audiotrack";
    if (mimeType.includes("pdf")) return "picture_as_pdf";
    if (mimeType.includes("zip") || mimeType.includes("tar") || mimeType.includes("rar")) return "folder_zip";
    if (mimeType.includes("text/")) return "description";
    return "attach_file";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (attachments.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
      {attachments.map((file, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 bg-[#1C222E]/80 border border-white/5 rounded-lg px-2.5 py-1.5 max-w-[240px] group/item hover:border-white/15 transition-all"
        >
          <span className="material-symbols-outlined text-[15px] text-primary shrink-0">
            {getFileIcon(file.mimeType)}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-white font-medium truncate" title={file.filename}>
              {file.filename}
            </span>
            <span className="text-[8px] text-on-surface-variant/50">
              {formatFileSize(file.size)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="text-on-surface-variant/60 hover:text-white transition-colors cursor-pointer w-4 h-4 rounded-full flex items-center justify-center hover:bg-white/5 shrink-0 ml-1.5"
            title="Remove attachment"
          >
            <span className="material-symbols-outlined text-[10px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
