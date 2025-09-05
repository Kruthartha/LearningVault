import { useState } from "react";
import {
  BookOpen,
  Award,
  Users,
  Target,
  Play,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  Rocket,
  Trophy,
  Code,
  Brain,
  Heart,
  ChevronRight,
  Globe,
  Lightbulb,
} from "lucide-react";

const WelcomeScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [experience, setExperience] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <p>No user found!</p>;

  const learningTracks = [
{
  id: "fullstack",
  title: "Full-Stack Development",
  description: "Become a versatile developer by mastering both frontend and backend technologies. Build complete web applications using React, Node.js, databases, and APIs from scratch.",
  icon: Globe,
  duration: "6-9 months",
  skills: [
    "React", 
    "Node.js", 
    "Express.js", 
    "MongoDB", 
    "SQL", 
    "HTML", 
    "CSS", 
    "JavaScript", 
    "RESTful Services", 
    "Authentication & Authorization", 
  ],
  color: "blue",
  popular: true,
},
    {
      id: "aiml",
      title: "Artificial Intelligence and Machine Learning",
      description:
        "Master AI and ML concepts while building intelligent applications using popular frameworks like TensorFlow, PyTorch, and Scikit-learn.",
      icon: Sparkles,
      duration: "9-12 months",
      skills: [
        "Python3",
        "TensorFlow",
        "PyTorch",
        "Scikit-learn",
        "Data Analysis",
      ],
      color: "blue",
      locked: "true",
    },
  ];

  const learningGoals = [
    { id: "career", label: "Switch to a tech career", icon: Rocket },
    { id: "skills", label: "Learn new skills", icon: Lightbulb },
    { id: "promotion", label: "Get a promotion", icon: Trophy },
    { id: "side-project", label: "Build a side project", icon: Star },
    { id: "freelance", label: "Start freelancing", icon: Heart },
    { id: "hobby", label: "Personal interest", icon: BookOpen },
  ];

  const experienceLevels = [
    {
      id: "Beginner",
      title: "Baby Learner",
      description: "New to coding and tech",
    },
    {
      id: "Intermediate",
      title: "Rising Developer",
      description: "Familiar with basics, want to go deeper",
    },
    {
      id: "Advanced",
      title: "Seasoned Engineer",
      description: "Know some programming, want to specialize",
    },
  ];

  const handleGoalToggle = (goalId) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  };

  const TrackCard = ({ track }) => {
    const isLocked = track.locked;
    const isSelected = selectedTrack === track.id;

    return (
      <div
        onClick={isLocked ? undefined : () => setSelectedTrack(track.id)}
        className={`relative bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 ${
          isSelected && !isLocked
            ? `border-${track.color}-500 bg-${track.color}-50/30`
            : "border-gray-100"
        } ${
          isLocked
            ? "opacity-60 cursor-not-allowed"
            : "cursor-pointer hover:shadow-lg group hover:border-gray-200"
        }`}
      >
        {/* Badges: Show "Coming Soon" if locked, otherwise show "Most Popular" if applicable */}
        {isLocked ? (
          <div className="absolute -top-3 left-6">
            <span className="bg-gray-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              Coming Soon
            </span>
          </div>
        ) : track.popular ? (
          <div className="absolute -top-3 left-6">
            <span className="bg-gradient-to-r from-blue-700 to-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </span>
          </div>
        ) : null}

        {/* Card Content */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-${track.color}-50 rounded-xl`}>
            <track.icon className={`w-6 h-6 text-${track.color}-600`} />
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all ${
              isSelected && !isLocked
                ? `bg-${track.color}-500 border-${track.color}-500`
                : "border-gray-300"
            }`}
          >
            {isSelected && !isLocked && (
              <CheckCircle className="w-full h-full text-white" />
            )}
          </div>
        </div>

        <h3
          className={`text-lg font-semibold text-gray-900 mb-2 ${
            !isLocked && "group-hover:text-blue-600"
          } transition-colors`}
        >
          {track.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">{track.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span>⏱️ {track.duration}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {track.skills.map((skill) => (
            <span
              key={skill}
              className={`text-xs px-2 py-1 bg-${track.color}-100 text-${track.color}-700 rounded-full`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    );
  };
  // --- ^^^ CHANGE: The TrackCard component is updated above ^^^ ---

  const steps = [
    // Welcome Step
    <div className="text-center max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-black mb-4">
          Welcome to <span className="font-extralight">Learning</span>
          <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
            Vault
          </span>
        </h1>
        <p className="text-xl text-gray-600 font-light mb-8">
          Hi {user.first_name}! We're excited to help you start your learning
          journey. Let's personalize your experience.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Personalized Path
          </h3>
          <p className="text-sm text-gray-600">
            Get a learning path tailored specifically to your goals and
            experience level
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Expert Mentors</h3>
          <p className="text-sm text-gray-600">
            Get guidance from industry professionals who've been where you want
            to go
          </p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Real Projects</h3>
          <p className="text-sm text-gray-600">
            Build portfolio-worthy projects that demonstrate your skills to
            employers
          </p>
        </div>
      </div>
    </div>,

    // Goals Step
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
          What are your learning goals?
        </h2>
        <p className="text-lg text-gray-600 font-light">
          Select all that apply. This helps us create the perfect learning path
          for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {learningGoals.map((goal) => (
          <div
            key={goal.id}
            onClick={() => handleGoalToggle(goal.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
              selectedGoals.includes(goal.id)
                ? "border-blue-500 bg-blue-50/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${
                  selectedGoals.includes(goal.id)
                    ? "bg-blue-100"
                    : "bg-gray-100"
                }`}
              >
                <goal.icon
                  className={`w-6 h-6 ${
                    selectedGoals.includes(goal.id)
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                />
              </div>
              <span
                className={`font-medium ${
                  selectedGoals.includes(goal.id)
                    ? "text-blue-900"
                    : "text-gray-900"
                }`}
              >
                {goal.label}
              </span>
              <div
                className={`ml-auto w-5 h-5 rounded-full border-2 transition-all ${
                  selectedGoals.includes(goal.id)
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedGoals.includes(goal.id) && (
                  <CheckCircle className="w-full h-full text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Experience Step
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
          What's your coding experience?
        </h2>
        <p className="text-lg text-gray-600 font-light">
          This helps us recommend the right starting point for your journey.
        </p>
      </div>

      <div className="space-y-4">
        {experienceLevels.map((level) => (
          <div
            key={level.id}
            onClick={() => setExperience(level.id)}
            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
              experience === level.id
                ? "border-blue-500 bg-blue-50/30"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    experience === level.id ? "text-blue-900" : "text-gray-900"
                  }`}
                >
                  {level.title}
                </h3>
                <p className="text-gray-600">{level.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  experience === level.id
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {experience === level.id && (
                  <CheckCircle className="w-full h-full text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Track Selection Step
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
          Choose your learning track
        </h2>
        <p className="text-lg text-gray-600 font-light">
          Based on your goals, here are the tracks we recommend for you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {learningTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>,

    // Final Step
    <div className="text-center max-w-3xl mx-auto">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <Rocket className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl md:text-4xl font-light text-black mb-4">
        You're all set!
      </h2>
      <p className="text-lg text-gray-600 font-light mb-8">
        We've created a personalized learning path just for you. Let's start
        building your future!
      </p>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Learning Summary
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Track:</span>
            <div className="font-medium text-gray-900 mt-1">
              {learningTracks.find((t) => t.id === selectedTrack)?.title ||
                "Not selected"}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Experience:</span>
            <div className="font-medium text-gray-900 mt-1 capitalize">
              {experienceLevels.find((l) => l.id === experience)?.title ||
                "Not selected"}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Goals:</span>
            <div className="font-medium text-gray-900 mt-1">
              {selectedGoals.length} selected
            </div>
          </div>
        </div>
      </div>
    </div>,
  ];

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return selectedGoals.length > 0;
      case 2:
        return experience !== "";
      case 3:
        return selectedTrack !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

const handleGetStarted = async () => {
  if (!user) return;

  // Prepare the payload
  const payload = {
    learning_goals: selectedGoals,        // array of selected goal ids
    coding_experience: experience,        // string like "beginner"
    learning_track: selectedTrack         // string like "fullstack"
  };

  try {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/user/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      // Onboarding successful
      localStorage.setItem("welcomeSeen", "true");

      // Optionally update local user profile info
      if (data.onboarding) {
        localStorage.setItem("userProfile", JSON.stringify(data.onboarding));
      }

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      console.error("Onboarding failed:", data.message);
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    console.error("Error submitting onboarding:", err);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-light text-black">
              Learning
              <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                Vault
              </span>
            </h1>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "bg-blue-500 w-8"
                      : index < currentStep
                      ? "bg-blue-300"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
        <div className="min-h-[60vh] flex flex-col justify-center">
          {steps[currentStep]}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 max-w-3xl mx-auto">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentStep === 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Back
          </button>

          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Start Learning 
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                canProceed()
                  ? "bg-slate-800 text-white hover:bg-slate-700 shadow-sm hover:shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
