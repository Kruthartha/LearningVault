import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { projectsData } from "../../../data/projectsData.js";
import { LayoutContext } from "../../../Context/LayoutContext";

import { Allotment } from "allotment";
import "allotment/dist/style.css";

import {
  Asterisk,
  Upload,
  CircleCheck,
  Settings,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  X,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Bookmark,
  Share2,
  ArrowLeft,
  Code,
  Terminal,
  FileText,
  Lightbulb,
  Users,
  Star,
  Award,
  Hash,
  Tag,
  Github,
  ExternalLink,
  FolderOpen,
  GitBranch,
  Download,
  Play,
  Eye,
  Calendar,
  Target,
  Zap,
  AlertCircle,
  Info,
  Link,
  Rocket,
  CheckSquare,
} from "lucide-react";

const ProjectSolver = ({ onProjectComplete }) => {
  const { projectSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isModuleContext = location.state?.context === "module";
  const { setIsFullScreen } = useContext(LayoutContext);

  const project = projectsData[projectSlug];

  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionLogs, setSubmissionLogs] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProjectCompleted, setIsProjectCompleted] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState(null);

  const consoleRef = useRef(null);

  useEffect(() => {
    setIsFullScreen(true);
    return () => setIsFullScreen(false);
  }, [setIsFullScreen]);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [submissionLogs, validationResults]);

  const allTabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "requirements", label: "Requirements", icon: CheckSquare },
    { id: "resources", label: "Resources", icon: Lightbulb },
    { id: "submissions", label: "Submissions", icon: Github },
    { id: "discussions", label: "Discuss", icon: MessageSquare },
  ];

  const availableTabs = isModuleContext
    ? allTabs.filter((tab) =>
        ["overview", "requirements", "resources"].includes(tab.id)
      )
    : allTabs;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-600 bg-green-50 border-green-200";
      case "Intermediate":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "Advanced":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const validateProject = async () => {
    if (!githubUrl.trim()) {
      alert("Please enter a GitHub repository URL");
      return;
    }

    setIsValidating(true);
    setShowConsole(true);

    // Simulate API call to validate GitHub project
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockValidation = {
      repositoryExists: true,
      hasRequiredFiles: Math.random() > 0.2,
      meetsCriteria: Math.random() > 0.3,
      score: Math.floor(Math.random() * 30 + 70),
      feedback: [
        "✓ Repository structure looks good",
        "✓ README.md file present and well-documented",
        "✓ All required dependencies listed",
        "⚠ Consider adding more test cases",
        "✓ Code follows best practices",
      ],
    };

    setValidationResults(mockValidation);
    setSubmissionLogs([
      { type: "info", message: "Validating GitHub repository..." },
      { type: "info", message: "Checking repository structure..." },
      { type: "info", message: "Analyzing code quality..." },
      { type: "info", message: "Running automated tests..." },
      {
        type: mockValidation.meetsCriteria ? "success" : "error",
        message: mockValidation.meetsCriteria
          ? `Validation complete! Score: ${mockValidation.score}/100`
          : "Validation failed - requirements not met",
      },
    ]);

    setIsValidating(false);
  };

  const submitProject = async () => {
    if (!validationResults?.meetsCriteria) {
      alert(
        "Please ensure your project meets all requirements before submitting"
      );
      return;
    }

    setIsSubmitting(true);
    setShowConsole(true);

    // Simulate project submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const isSuccess = true;

    setSubmissionLogs((prev) => [
      ...prev,
      { type: "info", message: "Submitting project..." },
      { type: "success", message: "Project submitted successfully!" },
      { type: "info", message: "Grade: A- (92/100)" },
      { type: "info", message: "Feedback will be available in 24-48 hours" },
    ]);

    if (isSuccess) {
      if (onProjectComplete) {
        onProjectComplete(project.slug);
      }
      if (isModuleContext) {
        setIsProjectCompleted(true);
      }
    }

    setIsSubmitting(false);
  };

  const renderProjectOverview = () => (
    <div className="p-6 space-y-6">
      {/* Project Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">#{project.id}</span>
          <h1 className="text-2xl font-semibold text-gray-900">
            {project.title}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getDifficultyColor(
              project.difficulty
            )}`}
          >
            {project.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{project.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            <span>{project.points} points</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{project.submissions} submissions</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{project.rating}/5.0</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Skills:</span>
          {project.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div className="prose max-w-none">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Description
        </h3>
        <p className="text-gray-700 leading-relaxed">{project.description}</p>
      </div>

      {/* Learning Objectives */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Learning Objectives
        </h3>
        <ul className="space-y-2">
          {project.objectives.map((objective, index) => (
            <li key={index} className="flex items-start gap-3">
              <Asterisk className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{objective}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Project Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Key Features to Implement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.features.map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CircleCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bonus Features */}
      {project.bonusFeatures && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Star className="w-6 h-6 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                Bonus Challenges
              </h3>
              <p className="text-purple-800 mb-4">
                Complete these for extra points!
              </p>
              <ul className="space-y-2">
                {project.bonusFeatures.map((bonus, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-purple-800">{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {project.timeline && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Suggested Timeline
          </h4>
          <div className="space-y-3">
            {project.timeline.map((phase, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h5 className="font-medium text-gray-900">{phase.phase}</h5>
                    <span className="text-sm text-gray-500">
                      ({phase.duration})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {phase.description}
                  </p>
                  <ul className="space-y-1">
                    {phase.tasks.map((task, taskIndex) => (
                      <li
                        key={taskIndex}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRequirements = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Project Requirements
      </h2>

      {/* Technical Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-600" />
          Technical Requirements
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="space-y-3">
            {project.requirements.technical.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Functional Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-600" />
          Functional Requirements
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <ul className="space-y-3">
            {project.requirements.functional.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Submission Guidelines */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Github className="w-5 h-5 text-gray-800" />
          Submission Guidelines
        </h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <ul className="space-y-3">
            {project.requirements.submission.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-blue-800">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grading Criteria */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-600" />
          Grading Criteria
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.gradingCriteria.map((criteria, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">
                  {criteria.category}
                </h4>
                <span className="text-sm font-medium text-gray-600">
                  {criteria.weight}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {criteria.description}
              </p>
              <div className="space-y-1">
                {criteria.points.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-xs text-gray-600">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Resources & References
      </h2>

      {/* Starter Files */}
      {project.resources.starterFiles && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Starter Files
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">
                Download the starter template to begin
              </span>
              <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              {project.resources.starterFiles.name} •{" "}
              {project.resources.starterFiles.size}
            </div>
          </div>
        </div>
      )}

      {/* Documentation Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Documentation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.resources.documentation.map((doc, index) => (
            <a
              key={index}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{doc.title}</h4>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Tutorial Videos */}
      {project.resources.tutorials && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Play className="w-5 h-5 text-red-600" />
            Tutorial Videos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.resources.tutorials.map((tutorial, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Play className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <h4 className="font-medium text-gray-900">
                    {tutorial.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {tutorial.duration}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Watch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Example Projects */}
      {project.resources.examples && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-600" />
            Example Projects
          </h3>
          <div className="space-y-3">
            {project.resources.examples.map((example, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {example.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {example.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:border-gray-400 transition-colors">
                      <Eye className="w-4 h-4" />
                      Demo
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:border-gray-400 transition-colors">
                      <Github className="w-4 h-4" />
                      Code
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSubmissions = () => (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Submit Your Project
        </h2>

        {/* GitHub URL Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            GitHub Repository URL
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Github className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project-name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={validateProject}
              disabled={isValidating || !githubUrl.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                "Validate"
              )}
            </button>
          </div>
        </div>

        {/* Validation Results */}
        {validationResults && (
          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 ${
                validationResults.meetsCriteria
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {validationResults.meetsCriteria ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h4
                    className={`font-medium ${
                      validationResults.meetsCriteria
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    Validation{" "}
                    {validationResults.meetsCriteria ? "Passed" : "Failed"}
                  </h4>
                  <p
                    className={`text-sm ${
                      validationResults.meetsCriteria
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    Score: {validationResults.score}/100
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {validationResults.feedback.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {item.startsWith("✓") ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span
                      className={
                        validationResults.meetsCriteria
                          ? "text-green-800"
                          : "text-red-800"
                      }
                    >
                      {item.substring(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Submission Guidelines */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Submission Guidelines
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Ensure your repository is public or provide access to
              instructors
            </li>
            <li>• Include a comprehensive README.md with setup instructions</li>
            <li>• Add screenshots or demo videos in your repository</li>
            <li>• Comment your code thoroughly for better understanding</li>
            <li>• Test your application before submission</li>
          </ul>
        </div>

        {/* Previous Submissions */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Previous Submissions</h4>
          <div className="text-center py-8 text-gray-500">
            <Github className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>No previous submissions</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDiscussions = () => (
    <div className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Project Discussions
          </h3>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            New Discussion
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "Best practices for React component structure?",
              replies: 15,
              likes: 89,
              author: "reactDev",
              time: "3h ago",
              tags: ["React", "Best Practices"],
            },
            {
              title: "How to implement responsive design efficiently?",
              replies: 23,
              likes: 156,
              author: "frontendGuru",
              time: "1d ago",
              tags: ["CSS", "Responsive"],
            },
            {
              title: "GitHub deployment strategies",
              replies: 8,
              likes: 45,
              author: "devOpsExpert",
              time: "2d ago",
              tags: ["Deployment", "GitHub"],
            },
          ].map((discussion, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex-1">
                  {discussion.title}
                </h4>
                <div className="flex gap-1 ml-4">
                  {discussion.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>By {discussion.author}</span>
                <span>{discussion.time}</span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {discussion.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {discussion.replies} replies
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">Project not found.</p>
      </div>
    );
  }

  // Completion Screen
  if (isProjectCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-2xl w-full border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-50 shadow-lg">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            Project Completed!
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-md mx-auto mb-6">
            Outstanding work on "{project.title}". Your project has been
            successfully submitted and validated.
          </p>

          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {validationResults?.score || 95}
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {project.points}
              </div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">A-</div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Module
            </button>
            <button
              onClick={() => setIsProjectCompleted(false)}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-8xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-light text-black">
                  Learning
                  <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                    Vault
                  </span>
                </h1>
                <span className="text-gray-400">|</span>
                <span className="text-lg text-gray-700">{project.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className={`flex-1 ${
          isFullscreen ? "fixed inset-0 top-16 z-40" : "relative"
        }`}
      >
        {/* Left Panel: Project Information */}
        <div className="bg-white h-full flex flex-col">
          <div className="border-b border-gray-200 flex-shrink-0">
            <nav className="flex">
              {availableTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex-1 overflow-y-auto">
            {activeTab === "overview" && renderProjectOverview()}
            {activeTab === "requirements" && renderRequirements()}
            {activeTab === "resources" && renderResources()}
            {activeTab === "submissions" && renderSubmissions()}
            {activeTab === "discussions" && renderDiscussions()}
          </div>
        </div>
        {/* Right Panel: Project Workspace */}\
      </div>
    </div>
  );
};

export default ProjectSolver;
