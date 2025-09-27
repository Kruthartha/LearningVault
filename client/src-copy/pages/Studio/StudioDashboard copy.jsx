import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  BookOpen,
  Users,
  Award,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Code,
  HelpCircle,
  Play,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  Search,
  Copy,
  Terminal,
  UploadCloud,
  ChevronUp, // Added Icon
} from "lucide-react";

const StudioDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalType, setCreateModalType] = useState("path");
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Mock data
  const [learningPaths, setLearningPaths] = useState([
    {
      id: 1,
      title: "Full Stack Development",
      description: "Complete web development journey from frontend to backend",
      courses: 5,
      students: 1250,
      difficulty: "Intermediate",
      status: "published",
      createdAt: "2024-01-15",
      updatedAt: "2024-03-01",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description: "Learn the basics of data science and machine learning",
      courses: 3,
      students: 890,
      difficulty: "Beginner",
      status: "draft",
      createdAt: "2024-02-10",
      updatedAt: "2024-03-05",
    },
  ]);
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "React Fundamentals",
      description: "Learn React from scratch with hands-on projects",
      pathId: 1,
      pathTitle: "Full Stack Development",
      lessons: 12,
      duration: "6 hours",
      difficulty: "Beginner",
      status: "published",
      createdAt: "2024-01-20",
    },
    {
      id: 2,
      title: "Node.js Backend",
      description: "Build robust APIs with Node.js and Express",
      pathId: 1,
      pathTitle: "Full Stack Development",
      lessons: 15,
      duration: "8 hours",
      difficulty: "Intermediate",
      status: "published",
      createdAt: "2024-02-01",
    },
    {
      id: 3,
      title: "Python Basics",
      description: "Introduction to Python programming",
      pathId: 2,
      pathTitle: "Data Science Fundamentals",
      lessons: 10,
      duration: "5 hours",
      difficulty: "Beginner",
      status: "draft",
      createdAt: "2024-02-15",
    },
  ]);
  const [lessons, setLessons] = useState([
    {
      id: 1,
      title: "Introduction to JSX",
      courseId: 1,
      courseTitle: "React Fundamentals",
      type: "text",
      duration: "15 mins",
      order: 1,
      status: "published",
      steps: 3,
    },
    {
      id: 2,
      title: "Components and Props",
      courseId: 1,
      courseTitle: "React Fundamentals",
      type: "exercise",
      duration: "25 mins",
      order: 2,
      status: "published",
      steps: 5,
    },
    {
      id: 3,
      title: "State Management",
      courseId: 1,
      courseTitle: "React Fundamentals",
      type: "quiz",
      duration: "20 mins",
      order: 3,
      status: "draft",
      steps: 4,
    },
  ]);
  const [problemSets, setProblemSets] = useState([
    {
      id: 1,
      title: "React Hooks Challenges",
      courseId: 1,
      courseTitle: "React Fundamentals",
      difficulty: "Intermediate",
      status: "published",
      problems: 5,
    },
    {
      id: 2,
      title: "API Creation with Express",
      courseId: 2,
      courseTitle: "Node.js Backend",
      difficulty: "Advanced",
      status: "draft",
      problems: 8,
    },
  ]);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Beginner",
    status: "draft",
  });
  const [problemSetFormData, setProblemSetFormData] = useState({
    title: "",
    courseId: "",
    difficulty: "Beginner",
    problems: [],
  });
  const [currentProblem, setCurrentProblem] = useState({
    title: "",
    prompt: "",
    starterCode: "",
  });

  // --- Start: New State for Advanced Lesson Builder ---
  const [newLessonData, setNewLessonData] = useState({
    title: "",
    description: "",
    courseId: "", // Still need this to associate the lesson
    steps: [],
  });

  // Holds the step currently being built (title + its content bits)
  const [currentStepData, setCurrentStepData] = useState({
    title: "",
    content: [], // This will hold the array of content bits
  });

  // Holds the content bit currently being configured (e.g., a text block, a code block)
  const [currentBitData, setCurrentBitData] = useState({
    type: "text",
    data: { text: "" },
  });
  // --- End: New State for Advanced Lesson Builder ---


  const stats = {
    totalPaths: learningPaths.length,
    totalCourses: courses.length,
    totalLessons: lessons.length,
    totalProblemSets: problemSets.length,
    totalStudents: learningPaths.reduce((sum, path) => sum + path.students, 0),
    publishedContent: [
      ...learningPaths.filter((p) => p.status === "published"),
      ...courses.filter((c) => c.status === "published"),
      ...lessons.filter((l) => l.status === "published"),
      ...problemSets.filter((ps) => ps.status === "published"),
    ].length,
  };
  const toggleExpanded = (type, id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [`${type}-${id}`]: !prev[`${type}-${id}`],
    }));
  };
  const handleCreateNew = (type) => {
    setCreateModalType(type);
    setShowCreateModal(true);
    setFormData({
      title: "",
      description: "",
      difficulty: "Beginner",
      status: "draft",
    });
    setNewLessonData({
      title: "",
      description: "",
      courseId: "",
      steps: [],
    });
    setProblemSetFormData({
      title: "",
      courseId: "",
      difficulty: "Beginner",
      problems: [],
    });
    setCurrentProblem({ title: "", prompt: "", starterCode: "" });
  };

  const handleSaveContent = () => {
    const newId = Date.now();
    if (createModalType === "path") {
      setLearningPaths((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          courses: 0,
          students: 0,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        },
      ]);
    } else if (createModalType === "course") {
      setCourses((prev) => [
        ...prev,
        {
          id: newId,
          ...formData,
          pathId: 1,
          pathTitle: learningPaths[0]?.title || "Unknown Path",
          lessons: 0,
          duration: "0 hours",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    } else if (createModalType === "lesson") {
        const course = courses.find(
          (c) => c.id === parseInt(newLessonData.courseId)
        );
        setLessons((prev) => [
          ...prev,
          {
            id: newId,
            title: newLessonData.title,
            description: newLessonData.description, // Added
            courseId: parseInt(newLessonData.courseId),
            courseTitle: course?.title || "Unknown Course",
            status: "draft",
            // The new, complex steps array is now part of the lesson
            steps: newLessonData.steps.map(({ id, ...rest }) => rest),
          },
        ]);
    } else if (createModalType === "problemSet") {
      const course = courses.find(
        (c) => c.id === parseInt(problemSetFormData.courseId)
      );
      setProblemSets((prev) => [
        ...prev,
        {
          id: newId,
          title: problemSetFormData.title,
          courseId: parseInt(problemSetFormData.courseId),
          courseTitle: course?.title || "Unknown Course",
          difficulty: problemSetFormData.difficulty,
          status: "draft",
          problems: problemSetFormData.problems.length,
        },
      ]);
    }
    setShowCreateModal(false);
  };
  const handleDeleteItem = (type, id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "path") {
        setLearningPaths((prev) => prev.filter((p) => p.id !== id));
      } else if (type === "course") {
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "lesson") {
        setLessons((prev) => prev.filter((l) => l.id !== id));
      } else if (type === "problemSet") {
        setProblemSets((prev) => prev.filter((ps) => ps.id !== id));
      }
    }
  };

  // --- Start: New Handlers for Advanced Lesson Builder ---

  // Adds the configured "bit" (e.g., a text block) to the step being built
  const addContentBit = () => {
    setCurrentStepData(prev => ({
      ...prev,
      content: [...prev.content, { ...currentBitData, id: Date.now() }]
    }));
    // Reset the bit builder to default
    setCurrentBitData({ type: "text", data: { text: "" } });
  };

  // Adds the fully built step (with its title and content bits) to the lesson
  const addStep = () => {
    if (!currentStepData.title || currentStepData.content.length === 0) return;

    const newStep = {
      title: currentStepData.title,
      bits: {
        version: "1.0",
        content: currentStepData.content.map(({ id, ...rest }) => rest), // Remove temporary ID
      }
    };

    setNewLessonData(prev => ({
      ...prev,
      steps: [...prev.steps, { ...newStep, id: Date.now() }],
    }));

    // Reset the step builder
    setCurrentStepData({ title: "", content: [] });
  };

  // Helper to manage changing the bit type and resetting its data structure
  const handleBitTypeChange = (newType) => {
    let data = {};
    switch (newType) {
      case "image":
        data = { url: "", caption: "" };
        break;
      case "code":
        data = { language: "bash", code: "" };
        break;
      case "warning":
        data = { title: "", message: "" };
        break;
      case "hint":
        data = { text: "" };
        break;
      case "quiz_multiple_choice":
        data = { question: "", options: ["", "", "", ""], correct_answer: "" };
        break;
      case "text":
      default:
        data = { text: "" };
        break;
    }
    setCurrentBitData({ type: newType, data });
  };
  // --- End: New Handlers for Advanced Lesson Builder ---
  
  // --- Start: New Handlers for Deleting and Reordering ---

  const handleDeleteStep = (stepId) => {
    setNewLessonData(prev => ({
        ...prev,
        steps: prev.steps.filter(step => step.id !== stepId)
    }));
  };

  const handleDeleteBit = (bitId) => {
    setCurrentStepData(prev => ({
        ...prev,
        content: prev.content.filter(bit => bit.id !== bitId)
    }));
  };

  const handleReorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleReorderStep = (stepId, direction) => {
    const steps = newLessonData.steps;
    const index = steps.findIndex(s => s.id === stepId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= steps.length) return;

    const reorderedSteps = handleReorder(steps, index, newIndex);
    setNewLessonData(prev => ({ ...prev, steps: reorderedSteps }));
  };

  const handleReorderBit = (bitId, direction) => {
    const bits = currentStepData.content;
    const index = bits.findIndex(b => b.id === bitId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= bits.length) return;

    const reorderedBits = handleReorder(bits, index, newIndex);
    setCurrentStepData(prev => ({ ...prev, content: reorderedBits }));
  };

  // --- End: New Handlers for Deleting and Reordering ---

  const addProblem = () => {
    setProblemSetFormData((prev) => ({
      ...prev,
      problems: [...prev.problems, { ...currentProblem, id: Date.now() }],
    }));
    setCurrentProblem({ title: "", prompt: "", starterCode: "" });
  };
  const getStatusColor = (status) =>
    status === "published"
      ? "text-green-600 bg-green-50"
      : "text-yellow-600 bg-yellow-50";
  const getDifficultyColor = (difficulty) => {
    const colors = {
      Beginner: "text-green-600 bg-green-50",
      Intermediate: "text-yellow-600 bg-yellow-50",
      Advanced: "text-red-600 bg-red-50",
    };
    return colors[difficulty] || "text-gray-600 bg-gray-50";
  };

  const renderOverview = () => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.totalPaths}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Learning Paths</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.totalCourses}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Courses</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.totalLessons}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Lessons</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <Code className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.totalProblemSets}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Problem Sets</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.totalStudents.toLocaleString()}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Students</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-2xl font-light text-gray-900">
                        {stats.publishedContent}
                    </span>
                </div>
                <p className="text-sm text-gray-600 font-light">Published Items</p>
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-light text-gray-900 mb-6">
                Quick Actions
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
                <button
                    onClick={() => handleCreateNew("path")}
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">
                            Create Learning Path
                        </h4>
                        <p className="text-sm text-gray-600">
                            Start a new learning journey
                        </p>
                    </div>
                </button>
                <button
                    onClick={() => handleCreateNew("course")}
                    className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">Create Course</h4>
                        <p className="text-sm text-gray-600">
                            Add a new course to a path
                        </p>
                    </div>
                </button>
                <button
                    onClick={() => handleCreateNew("lesson")}
                    className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">Create Lesson</h4>
                        <p className="text-sm text-gray-600">Build interactive content</p>
                    </div>
                </button>
                <button
                    onClick={() => handleCreateNew("problemSet")}
                    className="flex items-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-colors text-left"
                >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900">Create Problem Set</h4>
                        <p className="text-sm text-gray-600">Design coding challenges</p>
                    </div>
                </button>
            </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-light text-gray-900 mb-6">
                Recent Activity
            </h3>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                        <p className="text-sm text-gray-900">
                            New course "React Fundamentals" published
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                        <p className="text-sm text-gray-900">
                            Learning path "Full Stack Development" updated
                        </p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <div>
                        <p className="text-sm text-gray-900">
                            New problem set "React Hooks" created
                        </p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                        <p className="text-sm text-gray-900">
                            New lesson "State Management" created
                        </p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
  const renderLearningPaths = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search paths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

        </div>
        <button
          onClick={() => handleCreateNew("path")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Learning Path
        </button>
      </div>
      <div className="grid gap-6">
        {learningPaths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-medium text-gray-900">
                      {path.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        path.status
                      )}`}
                    >
                      {path.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        path.difficulty
                      )}`}
                    >
                      {path.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 font-light mb-4">
                    {path.description}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {path.courses} courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {path.students} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Updated {path.updatedAt}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem("path", path.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => toggleExpanded("path", path.id)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {expandedItems[`path-${path.id}`] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                View Courses (
                {courses.filter((c) => c.pathId === path.id).length})
              </button>
              {expandedItems[`path-${path.id}`] && (
                <div className="mt-4 pl-6 border-l-2 border-gray-100 space-y-3">
                  {courses
                    .filter((c) => c.pathId === path.id)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {course.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {course.lessons} lessons • {course.duration}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            course.status
                          )}`}
                        >
                          {course.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleCreateNew("course")}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>
      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {course.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      course.status
                    )}`}
                  >
                    {course.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      course.difficulty
                    )}`}
                  >
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 font-light mb-3">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>Path: {course.pathTitle}</span>
                  <span>{course.lessons} lessons</span>
                  <span>{course.duration}</span>
                  <span>Created {course.createdAt}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem("course", course.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderLessons = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lessons..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleCreateNew("lesson")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Lesson
        </button>
      </div>
      <div className="grid gap-4">
        {lessons.map((lesson) => {
          const getTypeIcon = (type) => {
            const icons = {
              text: <FileText className="w-4 h-4" />,
              code: <Code className="w-4 h-4" />,
              quiz: <HelpCircle className="w-4 h-4" />,
              exercise: <Play className="w-4 h-4" />,
            };
            return icons[type] || <FileText className="w-4 h-4" />;
          };
          const getTypeColor = (type) => {
            const colors = {
              text: "text-blue-600 bg-blue-50",
              code: "text-purple-600 bg-purple-50",
              quiz: "text-orange-600 bg-orange-50",
              exercise: "text-green-600 bg-green-50",
            };
            return colors[type] || "text-gray-600 bg-gray-50";
          };
          return (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTypeColor(
                      lesson.type
                    )}`}
                  >
                    {getTypeIcon(lesson.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {lesson.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          lesson.status
                        )}`}
                      >
                        {lesson.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                          lesson.type
                        )}`}
                      >
                        {lesson.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>Course: {lesson.courseTitle}</span>
                      <span>{lesson.steps?.length || lesson.steps} steps</span>
                      <span>{lesson.duration}</span>
                      <span>Order: {lesson.order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem("lesson", lesson.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
  const renderProblemSets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search problem sets..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        <button
          onClick={() => handleCreateNew("problemSet")}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Problem Set
        </button>
      </div>
      <div className="grid gap-4">
        {problemSets.map((ps) => (
          <div
            key={ps.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-red-600 bg-red-50">
                  <Code className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {ps.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ps.status
                      )}`}
                    >
                      {ps.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        ps.difficulty
                      )}`}
                    >
                      {ps.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>Course: {ps.courseTitle}</span>
                    <span>{ps.problems} problems</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem("problemSet", ps.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateModal = () => {
    const modalTitles = {
      path: "Create Learning Path",
      course: "Create Course",
      lesson: "Create Lesson",
      problemSet: "Create Problem Set",
    };
    const renderProblemBuilder = () => (
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-900">Add Problems</h4>
        {problemSetFormData.problems.length > 0 && (
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">
              Current Problems ({problemSetFormData.problems.length})
            </h5>
            {problemSetFormData.problems.map((prob, index) => (
              <div
                key={prob.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">
                    {prob.title || `Problem ${index + 1}`}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setProblemSetFormData((prev) => ({
                      ...prev,
                      problems: prev.problems.filter((p) => p.id !== prob.id),
                    }));
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Title
            </label>
            <input
              type="text"
              value={currentProblem.title}
              onChange={(e) =>
                setCurrentProblem((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Two Sum"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Problem Prompt
            </label>
            <textarea
              value={currentProblem.prompt}
              onChange={(e) =>
                setCurrentProblem((prev) => ({
                  ...prev,
                  prompt: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Describe the problem..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starter Code
            </label>
            <textarea
              value={currentProblem.starterCode}
              onChange={(e) =>
                setCurrentProblem((prev) => ({
                  ...prev,
                  starterCode: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
              placeholder="function myFunction(args) { ... }"
            />
          </div>
          <button
            onClick={addProblem}
            disabled={!currentProblem.title || !currentProblem.prompt}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Problem
          </button>
        </div>
      </div>
    );

    const renderStepBuilder = () => {
        const renderBitBuilderInputs = () => {
          const { type, data } = currentBitData;
          switch (type) {
            case "text":
              return <textarea value={data.text} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { text: e.target.value } }))} placeholder="Enter text content..." className="w-full h-24 p-2 border rounded" />;
            case "image":
              return <div className="space-y-2">
                  <input type="text" value={data.url} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, url: e.target.value } }))} placeholder="Image URL" className="w-full p-2 border rounded" />
                  <input type="text" value={data.caption} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, caption: e.target.value } }))} placeholder="Image Caption" className="w-full p-2 border rounded" />
              </div>;
            case "code":
              return <div className="space-y-2">
                  <input type="text" value={data.language} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, language: e.target.value } }))} placeholder="Language (e.g., javascript)" className="w-full p-2 border rounded" />
                  <textarea value={data.code} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, code: e.target.value } }))} placeholder="Enter code..." className="w-full h-32 p-2 border rounded font-mono text-sm" />
              </div>;
            case "warning":
              return <div className="space-y-2">
                  <input type="text" value={data.title} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, title: e.target.value } }))} placeholder="Warning Title" className="w-full p-2 border rounded" />
                  <textarea value={data.message} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, message: e.target.value } }))} placeholder="Warning Message" className="w-full p-2 border rounded" />
              </div>;
            case "hint":
                return <textarea value={data.text} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { text: e.target.value } }))} placeholder="Enter hint..." className="w-full p-2 border rounded" />;
            case "quiz_multiple_choice":
                return <div className="space-y-2">
                  <textarea value={data.question} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, question: e.target.value } }))} placeholder="Quiz Question" className="w-full p-2 border rounded" />
                  {data.options.map((opt, i) => <input key={i} type="text" value={opt} onChange={e => { const newOpts = [...data.options]; newOpts[i] = e.target.value; setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, options: newOpts } })); }} placeholder={`Option ${i+1}`} className="w-full p-2 border rounded" />)}
                  <input type="text" value={data.correct_answer} onChange={e => setCurrentBitData(prev => ({ ...prev, data: { ...prev.data, correct_answer: e.target.value } }))} placeholder="Correct Answer (must match an option exactly)" className="w-full p-2 border rounded" />
                </div>;
            default:
              return null;
          }
        };
      
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Lesson Steps</h4>
            {/* Part 1: Display steps already added to the lesson */}
            <div className="space-y-2">
              {newLessonData.steps.map((step, index) => (
                <div key={step.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group">
                  <p><span className="font-bold">{index + 1}.</span> {step.title} ({step.bits.content.length} content blocks)</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleReorderStep(step.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><ChevronUp className="w-4 h-4" /></button>
                    <button onClick={() => handleReorderStep(step.id, 'down')} disabled={index === newLessonData.steps.length - 1} className="p-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><ChevronDown className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteStep(step.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
      
            {/* Part 2: Form to build a new step */}
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              <h5 className="font-medium text-gray-800">Create New Step</h5>
              <input type="text" value={currentStepData.title} onChange={(e) => setCurrentStepData(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter Step Title (e.g., '1. Understanding Branching')" className="w-full px-3 py-2 border rounded-lg" />
      
              {/* Display bits added to the *current* step being built */}
              <div className="space-y-2">
                {currentStepData.content.map((bit, index) => (
                   <div key={bit.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-md text-sm group">
                      <p><span className="font-bold capitalize">{bit.type}</span> block</p>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleReorderBit(bit.id, 'up')} disabled={index === 0} className="p-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><ChevronUp className="w-4 h-4" /></button>
                        <button onClick={() => handleReorderBit(bit.id, 'down')} disabled={index === currentStepData.content.length - 1} className="p-1 text-gray-500 hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"><ChevronDown className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteBit(bit.id)} className="p-1 text-gray-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                ))}
              </div>
      
              {/* Part 3: The Content Bit Builder */}
              <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <h6 className="font-medium text-gray-700">Add Content Block</h6>
                  <select value={currentBitData.type} onChange={(e) => handleBitTypeChange(e.target.value)} className="w-full p-2 border rounded-lg bg-white">
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                      <option value="code">Code</option>
                      <option value="warning">Warning</option>
                      <option value="hint">Hint</option>
                      <option value="quiz_multiple_choice">Multiple Choice Quiz</option>
                  </select>
                  {renderBitBuilderInputs()}
                  <button onClick={addContentBit} className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">Add Content Block</button>
              </div>
              <button onClick={addStep} disabled={!currentStepData.title || currentStepData.content.length === 0} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300">Add Step to Lesson</button>
            </div>
          </div>
        );
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-light text-gray-900">
              {modalTitles[createModalType]}
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {createModalType === "problemSet" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Problem Set Title
                    </label>
                    <input
                      type="text"
                      value={problemSetFormData.title}
                      onChange={(e) =>
                        setProblemSetFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter set title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      value={problemSetFormData.courseId}
                      onChange={(e) =>
                        setProblemSetFormData((prev) => ({
                          ...prev,
                          courseId: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      value={problemSetFormData.difficulty}
                      onChange={(e) =>
                        setProblemSetFormData((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                {renderProblemBuilder()}
              </div>
            ) : createModalType === "lesson" ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lesson Title
                        </label>
                        <input
                        type="text"
                        value={newLessonData.title}
                        onChange={(e) =>
                            setNewLessonData((prev) => ({
                            ...prev,
                            title: e.target.value,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter lesson title"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course
                        </label>
                        <select
                        value={newLessonData.courseId}
                        onChange={(e) =>
                            setNewLessonData((prev) => ({
                            ...prev,
                            courseId: e.target.value,
                            }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="">Select a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                            {course.title}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                    </label>
                    <textarea
                    value={newLessonData.description}
                    onChange={(e) =>
                        setNewLessonData((prev) => ({
                        ...prev,
                        description: e.target.value,
                        }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder={`Enter lesson description`}
                    />
                </div>
                {renderStepBuilder()}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${createModalType} title`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder={`Enter ${createModalType} description`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveContent}
              disabled={
                (createModalType === "problemSet" &&
                  (!problemSetFormData.title ||
                    !problemSetFormData.courseId)) ||
                (createModalType === "lesson" &&
                  (!newLessonData.title || !newLessonData.courseId)) ||
                (createModalType !== "lesson" &&
                  createModalType !== "problemSet" &&
                  (!formData.title || !formData.description))
              }
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save {modalTitles[createModalType].replace("Create ", "")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-light text-black">
                Learning
                <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                  Vault
                </span>
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-2xl text-gray-700 font-light">Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "paths", label: "Learning Paths", icon: BookOpen },
              { id: "courses", label: "Courses", icon: Award },
              { id: "lessons", label: "Lessons", icon: Play },
              { id: "problemSets", label: "Problem Sets", icon: Code },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === id
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "paths" && renderLearningPaths()}
        {activeTab === "courses" && renderCourses()}
        {activeTab === "lessons" && renderLessons()}
        {activeTab === "problemSets" && renderProblemSets()}
      </main>
      {showCreateModal && renderCreateModal()}
    </div>
  );
};

export default StudioDashboard;