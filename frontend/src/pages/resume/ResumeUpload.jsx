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
  ArrowRight,
  Plus,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadResumeApi, confirmResumeApi } from "../../api/resumeApi";

export default function ResumeUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  // Upload handler
  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await uploadResumeApi(formData);

      setParsedData({
        ...res.data,
        resumeId: res.resumeId,
      });

      toast.success("Resume uploaded & analyzed!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Confirm handler
  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await confirmResumeApi(parsedData.resumeId);
      toast.success("Resume confirmed ✅");
      navigate("/dashboard");
    } catch (err) {
      console.error("CONFIRM ERROR:", err);
      toast.error(err.message || "Failed to confirm resume");
    } finally {
      setConfirming(false);
    }
  };

  // Edit handlers for skills
  const addSkill = () => {
    setParsedData({
      ...parsedData,
      skills: [...(parsedData.skills || []), ""],
    });
  };

  const updateSkill = (index, value) => {
    const updated = [...parsedData.skills];
    updated[index] = value;
    setParsedData({ ...parsedData, skills: updated });
  };

  const removeSkill = (index) => {
    const updated = parsedData.skills.filter((_, i) => i !== index);
    setParsedData({ ...parsedData, skills: updated });
  };

  return (
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
            Upload your resume and let our AI extract your skills, projects, and
            experience automatically
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
          {!parsedData ? (
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
                    <Upload
                      size={48}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {dragActive
                      ? "Drop your resume here"
                      : "Drag & drop your resume"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      click to browse
                    </span>
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
                      <X
                        size={24}
                        className="text-gray-400 group-hover:text-red-600"
                      />
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
            <div className="animate-fadeIn">
              {/* Success Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  ✅ Resume Analyzed Successfully
                </h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  {editMode ? "Done Editing" : "Edit"}
                </button>
              </div>

              {/* Basic Info (if available) */}
              {(parsedData.name || parsedData.email || parsedData.phone) && (
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    👤 Personal Information
                  </h3>
                  {parsedData.name && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Name:</strong> {parsedData.name}
                    </p>
                  )}
                  {parsedData.email && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Email:</strong> {parsedData.email}
                    </p>
                  )}
                  {parsedData.phone && (
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Phone:</strong> {parsedData.phone}
                    </p>
                  )}
                </div>
              )}

              {/* SKILLS */}
              {parsedData.skills && parsedData.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    🛠 Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {parsedData.skills.map((skill, index) =>
                      editMode ? (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            value={skill}
                            onChange={(e) => updateSkill(index, e.target.value)}
                            className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                            placeholder="Skill name"
                          />
                          <button
                            onClick={() => removeSkill(index)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                          >
                            <X size={16} className="text-red-600" />
                          </button>
                        </div>
                      ) : (
                        <span
                          key={index}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold"
                        >
                          {skill}
                        </span>
                      )
                    )}
                    {editMode && (
                      <button
                        onClick={addSkill}
                        className="px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full text-sm font-semibold text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                      >
                        <Plus size={16} /> Add Skill
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {parsedData.projects && parsedData.projects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    📂 Projects
                  </h3>
                  <div className="space-y-4">
                    {parsedData.projects.map((project, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {project.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {project.description}
                        </p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {project.technologies.map((tech, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPERIENCE */}
              {parsedData.experience && parsedData.experience.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                    💼 Work Experience
                  </h3>
                  <div className="space-y-4">
                    {parsedData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      >
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {exp.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {exp.company} • {exp.duration}
                        </p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONFIRM BUTTON */}
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                {confirming ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                    Confirming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={22} /> Confirm & Continue
                  </>
                )}
              </button>
            </div>
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