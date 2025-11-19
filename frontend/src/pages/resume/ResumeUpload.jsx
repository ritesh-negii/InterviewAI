// src/pages/resume/ResumeUpload.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../api/axiosInstance";                 // ✅ IMPORTANT FIX
import { uploadResumeApi } from "../../api/resumeApi";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (selected) => {
    if (selected.type !== "application/pdf") {
      toast.error("❌ Only PDF files allowed");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      toast.error("❌ File size must be less than 5MB");
      return;
    }
    setFile(selected);
    toast.success("PDF selected!");
  };

  const removeFile = () => {
    setFile(null);
    setParsedData(null);
  };

  // ============================
  // ⭐ FIXED UPLOAD LOGIC
  // ============================
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file); // must match backend name

      const res = await uploadResumeApi(formData);

      // backend returns { success, message, data }
      setParsedData(res.data);     // your backend returns data inside res.data

      toast.success("Resume uploaded & analyzed!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    // ⬇️ UI unchanged
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
            <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              AI-Powered Resume Parser
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your resume and let our AI extract your skills, projects, and experience automatically
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">

          { !parsedData ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-3 border-dashed rounded-2xl p-12 transition-all duration-300 ${
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="mb-6 p-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Upload size={48} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {dragActive ? "Drop your resume here" : "Drag & drop your resume"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or <span className="text-blue-600 dark:text-blue-400 font-semibold">click to browse</span>
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <AlertCircle size={16} />
                    <span>PDF only, max 5MB</span>
                  </div>
                </label>
              </div>

              {/* File Preview */}
              {file && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-blue-200 dark:border-gray-500 animate-fadeIn">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl">
                      <FileText size={32} className="text-white" />
                    </div>

                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {file.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {(file.size / 1024).toFixed(1)} KB • PDF Document
                      </p>
                    </div>

                    <button
                      onClick={removeFile}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors group"
                    >
                      <X size={24} className="text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles size={22} />
                    Upload & Analyze with AI
                    <ArrowRight size={22} />
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Show parsed result */}
              <h2 className="text-2xl font-bold text-white">Resume Parsed!</h2>
              <pre className="text-gray-200 mt-4">
                {JSON.stringify(parsedData, null, 2)}
              </pre>
            </>
          )}

        </div>

        {!parsedData && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              Skip for now →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
