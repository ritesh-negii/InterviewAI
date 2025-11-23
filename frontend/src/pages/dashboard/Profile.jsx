// src/pages/dashboard/Profile.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Target,
  Briefcase,
  Edit,
  Save,
  X,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { updateProfileApi } from "../../api/profileApi";

export default function Profile() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    college: user?.profile?.college || "",
    degree: user?.profile?.degree || "",
    year: user?.profile?.year || "",
    targetRole: user?.profile?.targetRole || "",
    experience: user?.profile?.experience || "Fresher",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfileApi(formData);
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
      
      setEditMode(false);
      toast.success("Profile updated successfully! ✅");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original values
    setFormData({
      college: user?.profile?.college || "",
      degree: user?.profile?.degree || "",
      year: user?.profile?.year || "",
      targetRole: user?.profile?.targetRole || "",
      experience: user?.profile?.experience || "Fresher",
    });
    setEditMode(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="text-blue-600 dark:text-blue-400" size={32} />
            My Profile
          </h1>
        </div>

        {editMode ? (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X size={18} /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit size={18} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-6xl font-bold border-4 border-white/30">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <p className="text-blue-100 flex items-center gap-2 justify-center md:justify-start mb-2">
              <Mail size={18} />
              {user?.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {user?.profile?.targetRole || "No target role set"}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {user?.profile?.experience || "Experience not set"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <GraduationCap className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Education
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* College */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              College/University
            </label>
            {editMode ? (
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              />
            ) : (
              <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                {user?.profile?.college || "Not set"}
              </p>
            )}
          </div>

          {/* Degree */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Degree
            </label>
            {editMode ? (
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              >
                <option value="">Select Degree</option>
                <option value="B.Tech">B.Tech</option>
                <option value="B.E.">B.E.</option>
                <option value="B.Sc">B.Sc</option>
                <option value="BCA">BCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MCA">MCA</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                {user?.profile?.degree || "Not set"}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Year of Study
            </label>
            {editMode ? (
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                {user?.profile?.year || "Not set"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Career Goals Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
            <Target className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Career Goals
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Target Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Target Role
            </label>
            {editMode ? (
              <select
                name="targetRole"
                value={formData.targetRole}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              >
                <option value="">Select Role</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Product Manager">Product Manager</option>
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                {user?.profile?.targetRole || "Not set"}
              </p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Experience Level
            </label>
            {editMode ? (
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 outline-none transition-all"
              >
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 Year</option>
                <option value="1-2 years">1-2 Years</option>
                <option value="2+ years">2+ Years</option>
              </select>
            ) : (
              <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white font-medium">
                {user?.profile?.experience || "Not set"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
            <Briefcase className="text-orange-600 dark:text-orange-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Account Status
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {user?.profileCompleted ? "✅" : "⏳"}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Profile Setup</p>
          </div>

          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {user?.resumeUploaded ? "✅" : "⏳"}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Resume Uploaded</p>
          </div>

          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              0
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Interviews</p>
          </div>

          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              0
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hours Practiced</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!editMode && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/resume-upload", { state: { from: "dashboard" } })}
            className="flex-1 md:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
          >
            Update Resume
          </button>
          <button
            onClick={() => navigate("/dashboard/interview")}
            className="flex-1 md:flex-none px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
          >
            Start Interview
          </button>
        </div>
      )}
    </div>
  );
}