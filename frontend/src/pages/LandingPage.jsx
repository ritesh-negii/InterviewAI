import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Brain, Mic, FileText, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();



  return (
    <div className="relative overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold text-gray-900">InterviewAI</span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/auth/login")}
              className="px-6 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/auth/signup")}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Floating Background Effects */}
      <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-30 top-10 left-10 animate-float"></div>
      <div className="absolute w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-float-delayed"></div>

      {/* HERO SECTION */}
      <section className="min-h-screen pt-20 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-blue-50 to-indigo-100">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.2] animate-fadeInUp">
          Crack Your Dream Job with  
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 ml-2">
            InterviewAI
          </span>
        </h1>

        <p className="text-gray-700 mt-4 text-lg md:text-xl max-w-2xl animate-fadeInUp">
          Get AI-powered mock interviews, instant feedback, resume analysis,
          and personalized improvement plans — all in one platform.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeInUp">
          <button
            onClick={() => navigate("/auth/signup")}
            className="px-10 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all"
          >
            Get Started Free
          </button>

          <button
            onClick={() => navigate("/auth/login")}
            className="px-10 py-3 rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-blue-50 text-lg font-semibold transition-all"
          >
            Login
          </button>
        </div>

      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">10K+</div>
            <div className="text-gray-600 mt-2">Mock Interviews</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">95%</div>
            <div className="text-gray-600 mt-2">Success Rate</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">500+</div>
            <div className="text-gray-600 mt-2">Happy Users</div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Why Choose InterviewAI?
        </h2>

        <p className="text-center text-gray-600 max-w-xl mx-auto mb-12">
          Everything you need to practice smarter and get hired faster.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">

          <FeatureCard
            icon={<Brain size={40} className="text-blue-600" />}
            title="AI Interview Questions"
            desc="Personalized technical, HR, and project questions based on your skills."
          />

          <FeatureCard
            icon={<Mic size={40} className="text-purple-600" />}
            title="Voice Interviews"
            desc="Practice real-time speaking interviews with instant feedback."
          />

          <FeatureCard
            icon={<FileText size={40} className="text-green-600" />}
            title="Resume Analysis"
            desc="Upload your resume and let AI extract skills, issues, and improvements."
          />

          <FeatureCard
            icon={<BarChart3 size={40} className="text-orange-600" />}
            title="Detailed Analytics"
            desc="Track your progress, strengths, weaknesses, and score trends."
          />

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <StepCard number="1" title="Upload Resume" desc="AI analyzes your skills" />
          <StepCard number="2" title="Choose Type" desc="Technical, HR, or behavioral" />
          <StepCard number="3" title="Practice" desc="Answer AI-generated questions" />
          <StepCard number="4" title="Improve" desc="Get instant feedback & analytics" />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands of successful candidates who prepared with InterviewAI
        </p>
        <button
          onClick={() => navigate("/auth/signup")}
          className="px-10 py-3 rounded-xl bg-white text-blue-600 hover:bg-gray-100 text-lg font-semibold shadow-lg hover:scale-[1.03] transition-all"
        >
          Get Started Free — No Credit Card Required
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold">InterviewAI</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your AI-powered interview preparation platform
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © {new Date().getFullYear()} InterviewAI • Built with ❤️ using MERN Stack & AI
          </div>
        </div>
      </footer>

    </div>
  );
}

/** FEATURE CARD COMPONENT */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 bg-white shadow-xl rounded-2xl border border-gray-200 hover:shadow-2xl hover:scale-[1.03] transition-all">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

/** STEP CARD COMPONENT */
function StepCard({ number, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
        {number}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}