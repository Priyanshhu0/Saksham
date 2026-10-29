import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, X, AlertCircle } from 'lucide-react';

interface FileUploadZoneProps {
  label?: string;
  hint?: string;
  accept?: string;
  selectedFile: { name: string; size?: string } | null;
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  maxSizeMb?: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  hint = 'Supports PDF, DOC, DOCX, PNG, JPG up to 25 MB from your PC',
  accept = '.pdf,.doc,.docx,.png,.jpg,.jpeg',
  selectedFile,
  onFileSelect,
  onFileRemove,
  maxSizeMb = 25,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum allowed size of ${maxSizeMb} MB`);
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      {label && <label className="block font-bold text-[#111111]">{label}</label>}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="p-3 bg-white border border-[#111111] rounded-lg flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded bg-[#111111] text-white flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#111111] truncate text-xs">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-[#777777] font-mono mt-0.5">
                {selectedFile.size && <span>{selectedFile.size}</span>}
                <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3 inline" /> Ready to upload
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#111111] bg-[#F7F7F5] hover:bg-[#EEEEEC] border border-[#E5E5E5] rounded transition-colors cursor-pointer"
            >
              Change
            </button>
            {onFileRemove && (
              <button
                type="button"
                onClick={onFileRemove}
                className="p-1 text-[#777777] hover:text-[#DC2626] rounded transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-4 sm:p-5 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-150 ${
            isDragging
              ? 'border-[#111111] bg-[#EEEEEC]'
              : 'border-[#CCCCCC] hover:border-[#111111] bg-[#FAFAFA] hover:bg-[#F5F5F3]'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#111111] mx-auto mb-2 shadow-xs">
            <Upload className="w-4 h-4" />
          </div>

          <p className="font-bold text-xs text-[#111111]">
            Click to upload from PC <span className="font-normal text-[#666666]">or drag and drop</span>
          </p>
          <p className="text-[11px] text-[#777777] mt-0.5">{hint}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[11px] text-[#DC2626] mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

