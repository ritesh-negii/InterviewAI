// src/pages/dashboard/Home.jsx - DAY 2 VERSION

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BarChart2, PlayCircle, User, FileText, TrendingUp } from "lucide-react";

// ⏸️ DAY 8: Uncomment these imports when you create analyticsApi.js
// import { getUserStatsApi, getInterviewHistoryApi } from "../../api/analyticsApi";
// import { useEffect, useState } from "react";

export default function DashboardHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ⏸️ DAY 8: Uncomment this state management for real data
  // const [stats, setStats] = useState({
  //   totalInterviews: 0,
  //   averageScore: 0,
  //   improvement: 0
  // });
  // const [recentSessions, setRecentSessions] = useState([]);
  // const [loading, setLoading] = useState(true);

  // ⏸️ DAY 8: Uncomment this useEffect to fetch real data from API
  // useEffect(() => {
  //   fetchDashboardData();
  // }, []);

  // ⏸️ DAY 8: Uncomment this function to fetch stats and history
  // const fetchDashboardData = async () => {
  //   try {
  //     setLoading(true);
  //     const statsResponse = await getUserStatsApi();
  //     const historyResponse = await getInterviewHistoryApi();
  //     
  //     setStats(statsResponse.data);
  //     setRecentSessions(historyResponse.data?.sessions?.slice(0, 3) || []);
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ⏸️ DAY 8: Uncomment this loading state
  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Welcome back, {user?.name || "User"} 👋
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Start your first interview to see your progress here!
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        
        {/* Total Interviews Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Total Interviews
            </h3>
            <BarChart2 className="text-blue-600" size={26} />
          </div>
          {/* 🔴 DAY 2: Static value */}
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">0</p>
          {/* ⏸️ DAY 8: Replace above line with dynamic data */}
          {/* <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {stats.totalInterviews}
          </p> */}
        </div>

        {/* Average Score Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Avg Score
            </h3>
            <User className="text-green-600" size={26} />
          </div>
          {/* 🔴 DAY 2: Static value */}
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">-</p>
          {/* ⏸️ DAY 8: Replace above line with dynamic data */}
          {/* <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {stats.averageScore > 0 ? `${stats.averageScore}/10` : "-"}
          </p> */}
        </div>

        {/* Improvement Card */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              Improvement
            </h3>
            <TrendingUp className="text-yellow-500" size={26} />
          </div>
          {/* 🔴 DAY 2: Static value */}
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">-</p>
          {/* ⏸️ DAY 8: Replace above line with dynamic data */}
          {/* <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {stats.improvement > 0 ? `+${stats.improvement}%` : "-"}
          </p> */}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🎯 Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate("/dashboard/interview")}
            className="py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <PlayCircle size={22} /> Start Interview
          </button>

          <button 
            onClick={() => navigate("/dashboard/profile")}
            className="py-3 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
          >
            <User size={20} /> Edit Profile
          </button>

          <button 
            onClick={() => navigate("/dashboard/resume")}
            className="py-3 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2 transition-colors"
          >
            <FileText size={20} /> Update Resume
          </button>
        </div>
      </div>

      {/* Recent Sessions Section */}
      <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            📝 Recent Sessions
          </h2>
          {/* ⏸️ DAY 8: Uncomment "View All" button when sessions exist */}
          {/* {recentSessions.length > 0 && (
            <button 
              onClick={() => navigate("/dashboard/analytics")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </button>
          )} */}
        </div>

        {/* 🔴 DAY 2: Show empty state by default */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No interviews yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start your first mock interview to see your progress here
          </p>
          <button
            onClick={() => navigate("/dashboard/interview")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Start Your First Interview
          </button>
        </div>

        {/* ⏸️ DAY 8: Uncomment this section to show real sessions */}
        {/* {recentSessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
              No interviews yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start your first mock interview to see your progress here
            </p>
            <button
              onClick={() => navigate("/dashboard/interview")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Your First Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session, index) => (
              <div 
                key={session._id || index}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl flex justify-between items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/interview/${session._id}/results`)}
              >
                <div>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    {session.interviewType || "Technical"} Interview
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(session.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-blue-600 font-bold text-lg">
                  {session.overallScore || "8"}/10
                </span>
              </div>
            ))}
          </div>
        )} */}
      </div>

      {/* ⏸️ DAY 8: Uncomment this motivational tip section */}
      {/* {stats.totalInterviews > 0 && (
        <div className="mt-10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-blue-100 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            💡 Tip of the Day
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Practice the STAR method (Situation, Task, Action, Result) for behavioral interview questions to structure your answers effectively.
          </p>
        </div>
      )} */}
    </div>
  );
}