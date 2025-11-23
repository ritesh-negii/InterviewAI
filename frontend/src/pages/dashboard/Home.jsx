// src/pages/dashboard/Home.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Sparkles,
  FileText,
  User,
  LogOut,
  ChevronRight,
  Target,
  Calendar,
  Briefcase,
  GraduationCap,
  Code,
  MessageSquare,
  TrendingUp,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";
import { getMyResumeApi } from "../../api/resumeApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await getMyResumeApi();
      setResume(res.resume);
    } catch (error) {
      console.error("Failed to fetch resume:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Ready to ace your next interview? Let's get started!
        </p>
      </div>

        {/* Profile Summary Card */}
        {user?.profile && (
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Your Profile</h3>
                <p className="text-blue-100 text-sm md:text-base">
                  Keep your information updated for better interview preparation
                </p>
              </div>
              <button
                onClick={() => navigate("/profile-setup", { state: { from: "dashboard" } })}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold backdrop-blur-sm transition-all text-sm md:text-base"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap size={20} />
                  <span className="text-xs md:text-sm text-blue-100">Education</span>
                </div>
                <p className="font-semibold text-sm md:text-base">
                  {user.profile.degree || "Not set"}
                </p>
                <p className="text-xs md:text-sm text-blue-100 truncate">
                  {user.profile.college || "No college added"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} />
                  <span className="text-xs md:text-sm text-blue-100">Year</span>
                </div>
                <p className="font-semibold text-sm md:text-base">
                  {user.profile.year || "Not set"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} />
                  <span className="text-xs md:text-sm text-blue-100">Target Role</span>
                </div>
                <p className="font-semibold text-sm md:text-base">
                  {user.profile.targetRole || "Not set"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase size={20} />
                  <span className="text-xs md:text-sm text-blue-100">Experience</span>
                </div>
                <p className="font-semibold text-sm md:text-base">
                  {user.profile.experience || "Not set"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Resume Status Card */}
        {resume && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <FileText className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Resume Status
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated:{" "}
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                {resume.status === "confirmed" ? "✅ Confirmed" : "⏳ Pending"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Skills</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {resume.parsedData?.skills?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Projects</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {resume.parsedData?.projects?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Experience</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {resume.parsedData?.experience?.length || 0}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/resume-upload", { state: { from: "dashboard" } })}
              className="mt-6 w-full py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
            >
              Update Resume
            </button>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Start Mock Interview */}
          <div
            onClick={() => navigate("/dashboard/interview")}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="text-blue-600 dark:text-blue-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Start Mock Interview
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Practice with AI-powered interview questions based on your profile
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all">
              Get Started <ChevronRight size={20} />
            </div>
          </div>

          {/* Practice Coding */}
          <div
            onClick={() => navigate("/coding-practice")}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-purple-500 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Code className="text-purple-600 dark:text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Coding Practice
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Solve coding challenges tailored to your target role
            </p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-2 transition-all">
              Start Coding <ChevronRight size={20} />
            </div>
          </div>

          {/* View Progress */}
          <div
            onClick={() => navigate("/dashboard/analytics")}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-green-500 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-green-600 dark:text-green-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View your performance analytics and improvement areas
            </p>
            <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:gap-2 transition-all">
              View Stats <ChevronRight size={20} />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-700">
          <div className="flex items-center gap-3 mb-6">
            <Award className="text-orange-600 dark:text-orange-400" size={32} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Interview Journey
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">0</div>
              <p className="text-gray-600 dark:text-gray-400">Mock Interviews</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">0</div>
              <p className="text-gray-600 dark:text-gray-400">Questions Practiced</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">0</div>
              <p className="text-gray-600 dark:text-gray-400">Coding Problems</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">0%</div>
              <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
            Start practicing to see your progress! 🚀
          </p>
        </div>
      </div>
    );
  }