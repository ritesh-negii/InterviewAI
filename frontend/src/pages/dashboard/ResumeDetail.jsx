import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowLeft, Save, X, RefreshCcw, Plus, Trash2, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import { getMyResumeApi, updateResumeApi } from "../../api/resumeApi";

export default function ResumeDetail() {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editableData, setEditableData] = useState({
    skills: [],
    projects: [],
    experience: [],
    education: []
  });

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await getMyResumeApi();
      let data = res.resume.parsedData;
      
      // Safety check: Ensure parsedData is an object, not a string
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      
      setResume(res.resume);
      setEditableData(data || { skills: [], projects: [], experience: [], education: [] });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateResumeApi(resume._id, { parsedData: editableData });
      
      const updatedResume = {
        ...resume,
        parsedData: editableData
      };
      
      setResume(updatedResume);
      setEditMode(false);
      toast.success("Resume updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableData(resume.parsedData);
    setEditMode(false);
  };

  const handleReAnalyze = () => {
    navigate("/resume-upload", { state: { from: "dashboard" } });
  };

  // Helper functions
  const updateProject = (index, field, value) => {
    const newProjects = [...editableData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setEditableData({ ...editableData, projects: newProjects });
  };

  const updateExperience = (index, field, value) => {
    const newExperience = [...editableData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setEditableData({ ...editableData, experience: newExperience });
  };

  const addProject = () => {
    setEditableData({
      ...editableData,
      projects: [
        ...editableData.projects,
        { name: "New Project", description: "", technologies: [] }
      ]
    });
  };

  const removeProject = (index) => {
    const newProjects = editableData.projects.filter((_, i) => i !== index);
    setEditableData({ ...editableData, projects: newProjects });
  };

  const addExperience = () => {
    setEditableData({
      ...editableData,
      experience: [
        ...editableData.experience,
        { title: "New Position", company: "", duration: "", description: "" }
      ]
    });
  };

  const removeExperience = (index) => {
    const newExperience = editableData.experience.filter((_, i) => i !== index);
    setEditableData({ ...editableData, experience: newExperience });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 dark:text-gray-400 mb-4">No resume found.</p>
        <button
          onClick={() => navigate("/resume-upload")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Upload Resume
        </button>
      </div>
    );
  }

  const displayData = editMode ? editableData : (resume.parsedData || {});

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="text-blue-600 dark:text-blue-400" /> Resume Detail
          </h1>
        </div>

        <div className="flex gap-3">
          {editMode ? (
            <>
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
                {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText size={18} /> Edit Content
              </button>
              <button
                onClick={handleReAnalyze}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <RefreshCcw size={18} /> Re-Analyze
              </button>
            </>
          )}
        </div>
      </div>

      {/* Resume Status Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {new Date(resume.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
            resume.status === 'confirmed'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
          }`}>
            {resume.status === 'confirmed' ? '✅ Confirmed' : '⏳ Pending'}
          </span>
        </div>
      </div>

      {/* 🛠 SKILLS SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">🛠 Skills</h2>
          {editMode && (
            <button
              onClick={() => setEditableData({...editableData, skills: [...editableData.skills, "New Skill"]})}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700"
            >
              <Plus size={14} /> Add Skill
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3">
          {displayData.skills && displayData.skills.length > 0 ? (
            displayData.skills.map((skill, index) => (
              editMode ? (
                <div key={index} className="relative group">
                  <input
                    value={skill}
                    onChange={(e) => {
                      const newSkills = [...editableData.skills];
                      newSkills[index] = e.target.value;
                      setEditableData({ ...editableData, skills: newSkills });
                    }}
                    className="px-4 py-2 w-32 rounded-full bg-gray-50 dark:bg-gray-700 border border-blue-300 dark:border-blue-600 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                  <button
                    onClick={() => {
                      const newSkills = editableData.skills.filter((_, i) => i !== index);
                      setEditableData({ ...editableData, skills: newSkills });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <span key={index} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {skill}
                </span>
              )
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No skills listed</p>
          )}
        </div>
      </div>

      {/* 📂 PROJECTS SECTION */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">📂 Projects</h2>
          {editMode && (
            <button
              onClick={addProject}
              className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700"
            >
              <Plus size={14} /> Add Project
            </button>
          )}
        </div>
        
        <div className="grid gap-4">
          {displayData.projects && displayData.projects.length > 0 ? (
            displayData.projects.map((project, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-bold"
                      placeholder="Project Name"
                    />
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm h-24"
                      placeholder="Project Description"
                    />
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove Project
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.technologies.map((tech, i) => (
                          <span key={i} className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No projects listed</p>
          )}
        </div>
      </div>

      {/* 💼 EXPERIENCE SECTION */}
      {displayData.experience && displayData.experience.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">💼 Work Experience</h2>
            {editMode && (
              <button
                onClick={addExperience}
                className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700"
              >
                <Plus size={14} /> Add Experience
              </button>
            )}
          </div>
          
          <div className="grid gap-4">
            {displayData.experience.map((exp, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 font-bold"
                      placeholder="Job Title"
                    />
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      placeholder="Company Name"
                    />
                    <input
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                      placeholder="Duration (e.g., 2022-2024)"
                    />
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full p-2 rounded bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm h-24"
                      placeholder="Description"
                    />
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Remove Experience
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{exp.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company} • {exp.duration}</p>
                    {exp.description && (
                      <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🎓 EDUCATION SECTION */}
      {displayData.education && displayData.education.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎓 Education</h2>
          <div className="grid gap-4">
            {displayData.education.map((edu, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{edu.degree}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                {edu.year && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{edu.year}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

