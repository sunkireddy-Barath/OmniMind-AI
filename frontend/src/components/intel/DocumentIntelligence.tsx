"use client";

import React, { useState } from "react";
import {
  Upload,
  File,
  CheckCircle,
  AlertCircle,
  Loader2,
  Database,
  ShieldCheck,
  Cpu,
} from "lucide-react";

import { apiClient } from "@/lib/api";
import toast from "react-hot-toast";

export default function DocumentIntelligence() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setStatus(null);

    try {
      const data = await apiClient.uploadDocument(file);
      setStatus({ type: "success", message: data.message });
      setFile(null);
      toast.success("Sync complete.");
    } catch (error: any) {
      console.error("Upload failed:", error);
      setStatus({ type: "error", message: error.message || "Upload failed" });
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Knowledge Base Management
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Upload and index your documents into the pgvector knowledge base.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--glass-bg)] border-2 border-dashed border-[var(--border-primary)] rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-blue-500/50 group">
            <div className="w-20 h-20 bg-[var(--bg-main)] rounded-full flex items-center justify-center mb-6 shadow-xl">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>

            <input
              type="file"
              id="dash-file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.txt,.csv"
            />
            <label
              htmlFor="dash-file-upload"
              className="cursor-pointer bg-blue-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95"
            >
              {file ? "Change File" : "Choose Asset"}
            </label>

            {file && (
              <div className="mt-8 flex items-center gap-3 bg-[var(--bg-main)] px-6 py-3 rounded-xl border border-[var(--border-primary)]">
                <File className="w-5 h-5 text-blue-600" />
                <span className="text-[var(--text-primary)] font-medium">
                  {file.name}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600/20 disabled:opacity-30 text-blue-600 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Database className="w-6 h-6" />
            )}
            {loading ? "Processing..." : "Sync to Knowledge Base"}
          </button>

          {status && (
            <div
              className={`p-6 rounded-2xl flex items-center gap-4 ${status.type === "success" ? "bg-green-500/5 border border-green-500/20 text-green-500" : "bg-red-500/5 border border-red-500/20 text-red-500"}`}
            >
              <CheckCircle className="w-6 h-6" />
              <p className="font-semibold">{status.message}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--glass-bg)] border border-[var(--border-primary)] rounded-2xl p-6 shadow-sm">
            <h4 className="text-[var(--text-primary)] font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Vector Protocol
            </h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Documents are processed using Sentence Transformers
              (all-MiniLM-L6) and stored in pgvector for semantic retrieval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
