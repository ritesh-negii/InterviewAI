// src/pages/profile/ProfileSetup.jsx

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfileApi } from "../../api/profileApi";
import { toast } from "react-hot-toast";
import { 
  GraduationCap, 
  Target, 
  Briefcase, 
  Calendar,
  ArrowRight,
  CheckCircle2,
  BookOpen
} from "lucide-react";

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth(); // ✅ Add refreshUser
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Check if user came from dashboard
  const fromDashboard = location.state?.from === "dashboard";
  // Or check if profile is already completed
  const isEditing = fromDashboard || user?.profileCompleted;

  const [form, setForm] = useState({
    college: user?.profile?.college || "",
    degree: user?.profile?.degree || "",
    year: user?.profile?.year || "",
    targetRole: user?.profile?.targetRole || "",
    experience: user?.profile?.experience || "Fresher",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleNext = () => {
    // Validation for each step
    if (step === 1 && !form.college) {
      toast.error("Please enter your college name");
      return;
    }
    if (step === 2 && !form.degree) {
      toast.error("Please select your degree");
      return;
    }
    if (step === 3 && !form.year) {
      toast.error("Please select your year");
      return;
    }
    if (step === 4 && !form.targetRole) {
      toast.error("Please select your target role");
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (!form.experience) {
      toast.error("Please select your experience level");
      return;
    }

    setLoading(true);
    try {
      await updateProfileApi(form);
      
      // ✅ Refresh user data in context
      if (refreshUser) {
        await refreshUser();
      }
      
      toast.success("Profile updated! 🎉");
      
      // If user already completed profile before, they're editing - go back to dashboard
      // Otherwise, it's first-time setup - go to resume upload
      if (isEditing) {
        navigate("/dashboard");
      } else {
        navigate("/resume-upload");
      }
    } catch (error) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Progress calculation (now 5 steps)
  const progress = (step / 5) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

      {/* Main Container */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/20">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-semibold text-blue-700">Step {step} of 5</span>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {isEditing ? "Edit Your Profile" : `Welcome, ${user?.name?.split(' ')[0]}! 👋`}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEditing 
              ? "Update your information to keep your profile current"
              : "Let's set up your profile to personalize your experience"
            }
          </p>
          
          {/* Back to Dashboard button (only show when editing) */}
          {isEditing && (
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-semibold text-sm"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                  i < step 
                    ? 'bg-green-500 text-white scale-110' 
                    : i === step 
                    ? 'bg-blue-600 text-white scale-125 shadow-lg' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < step ? <CheckCircle2 size={20} /> : i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          
          {/* STEP 1: College */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <GraduationCap className="text-blue-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                  <p className="text-gray-600">Where are you studying?</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  College/University Name *
                </label>
                <input
                  name="college"
                  value={form.college}
                  placeholder="e.g., Indian Institute of Technology, Delhi"
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                  autoFocus
                />
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: Degree */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <BookOpen className="text-indigo-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Degree</h2>
                  <p className="text-gray-600">What degree are you pursuing?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "B.Tech",
                  "B.E.",
                  "B.Sc",
                  "BCA",
                  "M.Tech",
                  "MCA",
                  "MBA",
                  "Other"
                ].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => setForm({ ...form, degree: deg })}
                    className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                      form.degree === deg
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-105 shadow-lg'
                        : 'border-gray-300 hover:border-indigo-400 hover:shadow-md'
                    }`}
                  >
                    {deg}
                  </button>
                ))}
              </div>

              {/* Custom input for "Other" */}
              {form.degree === "Other" && (
                <input
                  name="degree"
                  placeholder="Enter your degree"
                  onChange={handleChange}
                  className="w-full p-4 border-2 border-indigo-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                  autoFocus
                />
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Year */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Calendar className="text-purple-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Year of Study</h2>
                  <p className="text-gray-600">Which year are you in?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate", "Other"].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setForm({ ...form, year: yr })}
                    className={`p-6 rounded-xl border-2 font-semibold text-lg transition-all ${
                      form.year === yr
                        ? 'border-purple-600 bg-purple-50 text-purple-700 scale-105 shadow-lg'
                        : 'border-gray-300 hover:border-purple-400 hover:shadow-md'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Target Role */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Target className="text-green-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Target Role</h2>
                  <p className="text-gray-600">What job are you preparing for?</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  "Software Developer",
                  "Frontend Developer",
                  "Backend Developer",
                  "Full Stack Developer",
                  "Data Analyst",
                  "Data Scientist",
                  "DevOps Engineer",
                  "Product Manager"
                ].map((role) => (
                  <button
                    key={role}
                    onClick={() => setForm({ ...form, targetRole: role })}
                    className={`p-4 rounded-xl border-2 font-medium transition-all ${
                      form.targetRole === role
                        ? 'border-green-600 bg-green-50 text-green-700 scale-105 shadow-lg'
                        : 'border-gray-300 hover:border-green-400 hover:shadow-md'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Experience */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Briefcase className="text-orange-600" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Experience Level</h2>
                  <p className="text-gray-600">How much experience do you have?</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { value: "Fresher", label: "Fresher", desc: "No professional experience" },
                  { value: "0-1 years", label: "0-1 Year", desc: "Just starting out" },
                  { value: "1-2 years", label: "1-2 Years", desc: "Some experience" },
                  { value: "2+ years", label: "2+ Years", desc: "Experienced professional" }
                ].map((exp) => (
                  <button
                    key={exp.value}
                    onClick={() => setForm({ ...form, experience: exp.value })}
                    className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                      form.experience === exp.value
                        ? 'border-orange-600 bg-orange-50 shadow-lg scale-105'
                        : 'border-gray-300 hover:border-orange-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold text-lg ${
                          form.experience === exp.value ? 'text-orange-700' : 'text-gray-900'
                        }`}>
                          {exp.label}
                        </div>
                        <div className="text-sm text-gray-600">{exp.desc}</div>
                      </div>
                      {form.experience === exp.value && (
                        <CheckCircle2 className="text-orange-600" size={24} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup <CheckCircle2 size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Tip */}
        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-sm text-blue-800 text-center">
            💡 <strong>Tip:</strong> This information helps us personalize your interview questions
          </p>
        </div>

      </div>
    </div>
  );
}