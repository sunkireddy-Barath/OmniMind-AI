"use client";

import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
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

export default function DocumentsPage() {
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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/intel/upload`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: "success", message: data.message });
        setFile(null);
      } else {
        setStatus({ type: "error", message: data.detail || "Upload failed" });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus({ type: "error", message: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto p-6">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Document Intelligence
          </h1>
          <p className="text-zinc-400 text-lg">
            Upload knowledge assets to expand the platform's intelligence with
            RAG and pgvector.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-blue-500/50 group">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-2xl">
                <Upload className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Select relevant files
              </h3>
              <p className="text-zinc-500 mb-8 max-w-sm">
                Support for PDF, DOCX, TXT, and CSV. Files are chunked and
                embedded automatically.
              </p>

              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.docx,.txt,.csv"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-white text-black px-10 py-4 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-xl"
              >
                {file ? "Change File" : "Choose File"}
              </label>

              {file && (
                <div className="mt-8 flex items-center gap-3 bg-zinc-800/50 px-6 py-3 rounded-xl border border-zinc-700 animate-in fade-in slide-in-from-top-2">
                  <File className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">{file.name}</span>
                  <span className="text-zinc-500 text-xs">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Database className="w-6 h-6" />
              )}
              {loading ? "Processing Document..." : "Index into Knowledge Base"}
            </button>

            {status && (
              <div
                className={`p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300 ${status.type === "success" ? "bg-emerald-950/30 border border-emerald-800 text-emerald-400" : "bg-red-950/30 border border-red-800 text-red-400"}`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
                <p className="font-semibold">{status.message}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2 italic">
                <Cpu className="w-4 h-4 text-blue-400" /> Engine Specs
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Retrieval</span>
                  <span className="text-zinc-300 font-mono">
                    pgvector-RS256
                  </span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Embedding</span>
                  <span className="text-zinc-300 font-mono">all-MiniLM-L6</span>
                </li>
                <li className="flex justify-between border-b border-zinc-800 pb-2">
                  <span className="text-zinc-500">Chunk Size</span>
                  <span className="text-zinc-300 font-mono">1000 chars</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-zinc-500">Overlap</span>
                  <span className="text-zinc-300 font-mono">200 chars</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
              <ShieldCheck className="w-10 h-10 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Secure Storage</h3>
              <p className="text-blue-100/80 leading-relaxed">
                Your knowledge documents are processed locally and securely
                stored as vector embeddings in our PostgreSQL vault.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
