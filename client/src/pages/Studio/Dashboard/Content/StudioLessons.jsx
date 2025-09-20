import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Copy,
  Trash2,
  ChevronRight,
  Folder,
  FileText,
  FolderPlus,
  Save,
} from "lucide-react";

// ========================================================================
// --- MOCK DATA & CONFIG ---
// ========================================================================
const initialCategories = {
  JavaScript: ["Core JS", "React", "Vue", "Node.js"],
  CSS: ["Fundamentals", "Layouts", "Animations"],
  Tools: ["Version Control", "Build Tools"],
};

const mockLessons = [
  {
    id: 1,
    category: "JavaScript",
    subcategory: "React",
    title: "Introduction to React Hooks",
    tags: ["hooks", "state"],
    difficulty: 2,
    modified: "2025-09-11",
  },
  {
    id: 4,
    category: "JavaScript",
    subcategory: "Core JS",
    title: "Asynchronous JavaScript",
    tags: ["async", "promises"],
    difficulty: 4,
    modified: "2025-09-08",
  },
  {
    id: 5,
    category: "JavaScript",
    subcategory: "React",
    title: "State Management with Redux",
    tags: ["redux", "state"],
    difficulty: 4,
    modified: "2025-09-10",
  },
  {
    id: 3,
    category: "CSS",
    subcategory: "Layouts",
    title: "CSS Flexbox Layouts",
    tags: ["css", "flexbox"],
    difficulty: 3,
    modified: "2025-09-12",
  },
  {
    id: 6,
    category: "CSS",
    subcategory: "Layouts",
    title: "Mastering CSS Grid",
    tags: ["css", "grid"],
    difficulty: 4,
    modified: "2025-09-11",
  },
  {
    id: 2,
    category: "Tools",
    subcategory: "Version Control",
    title: "Advanced Git and GitHub",
    tags: ["git", "github"],
    difficulty: 4,
    modified: "2025-09-10",
  },
  {
    id: 7,
    category: "JavaScript",
    subcategory: "React",
    title: "Component Styling Strategies",
    tags: ["css-in-js", "styled-components"],
    difficulty: 3,
    modified: "2025-09-05",
  },
];

// ========================================================================
// --- DASHBOARD UI HELPER COMPONENTS ---
// ========================================================================

const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  icon: Icon,
  disabled,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-4 py-2 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-400",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

const CreateModal = ({ title, placeholder, onSave, onCancel }) => {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          placeholder={placeholder}
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button onClick={() => onSave(name)} disabled={!name.trim()}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const DifficultyBadge = ({ level }) => {
  const styles = {
    1: "bg-green-100 text-green-800",
    2: "bg-blue-100 text-blue-800",
    3: "bg-yellow-100 text-yellow-800",
    4: "bg-orange-100 text-orange-800",
    5: "bg-red-100 text-red-800",
  };
  const text = {
    1: "Beginner",
    2: "Easy",
    3: "Medium",
    4: "Hard",
    5: "Expert",
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
        styles[level] || styles[3]
      }`}
    >
      {text[level] || "Medium"}
    </span>
  );
};

// --- DASHBOARD BROWSE VIEW COMPONENTS ---

const CategoryCard = ({ name, subcategoryCount, lessonCount, onClick }) => (
  <Card onClick={onClick} className="cursor-pointer group">
    <div className="p-5">
      <Folder className="w-12 h-12 text-sky-500 group-hover:text-sky-600 transition-colors" />
      <h3 className="text-xl font-bold text-slate-800 mt-4 group-hover:text-sky-600 transition-colors">
        {name}
      </h3>
      <p className="text-sm text-slate-500 mt-1">
        {subcategoryCount} sub-categories
      </p>
    </div>
    <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 flex justify-between items-center">
      <span>{lessonCount} lessons</span>
      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-1" />
    </div>
  </Card>
);

const SubCategoryCard = ({ name, lessonCount, onClick }) => (
  <Card
    onClick={onClick}
    className="cursor-pointer group flex flex-col justify-between"
  >
    <div className="p-5">
      <FileText className="w-8 h-8 text-slate-500 group-hover:text-slate-700" />
      <h3 className="text-lg font-semibold text-slate-700 mt-3 group-hover:text-slate-900">
        {name}
      </h3>
    </div>
    <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 flex justify-between items-center">
      <span>{lessonCount} lessons</span>
      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform group-hover:translate-x-1" />
    </div>
  </Card>
);

const LessonListItem = ({ lesson }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all flex items-center justify-between gap-4">
    <div className="flex-grow">
      <p className="font-semibold text-slate-800">{lesson.title}</p>
      <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
        <DifficultyBadge level={lesson.difficulty} />
        <span className="text-xs">
          Last modified: {new Date(lesson.modified).toLocaleDateString()}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-1">
      <Button variant="ghost" className="px-2">
        <Edit className="w-4 h-4" />
      </Button>
      <Button variant="ghost" className="px-2">
        <Copy className="w-4 h-4" />
      </Button>
      <Button variant="ghost" className="px-2 text-red-500 hover:bg-red-50">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const EmptyState = ({ title, message, onActionClick, actionText }) => (
  <div className="text-center bg-slate-100/70 p-12 rounded-lg border-2 border-dashed border-slate-200">
    <FolderPlus className="mx-auto h-12 w-12 text-slate-400" />
    <h3 className="mt-2 text-lg font-semibold text-slate-800">{title}</h3>
    <p className="mt-1 text-sm text-slate-600">{message}</p>
    <div className="mt-6">
      <Button onClick={onActionClick} icon={Plus}>
        {actionText}
      </Button>
    </div>
  </div>
);

// --- DASHBOARD HEADER & NAVIGATION COMPONENTS ---

const Breadcrumbs = ({ paths, onPathClick }) => (
  <nav className="flex items-center text-sm font-medium text-slate-500">
    {paths.map((path, index) => (
      <React.Fragment key={path.label}>
        {index > 0 && (
          <ChevronRight className="w-4 h-4 mx-1.5 text-slate-400" />
        )}
        <span
          className={
            index === paths.length - 1
              ? "text-slate-800 font-semibold"
              : "cursor-pointer hover:text-sky-600"
          }
          onClick={() => onPathClick(path.view)}
        >
          {path.label}
        </span>
      </React.Fragment>
    ))}
  </nav>
);

const DashboardHeader = ({
  breadcrumbPaths,
  onBreadcrumbClick,
  onCreateClick,
  currentView,
}) => {
  const createButtonText = {
    categories: "New Category",
    subcategories: "New Sub-category",
    lessons: "New Lesson",
  };
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Course Library</h1>
        <Breadcrumbs paths={breadcrumbPaths} onPathClick={onBreadcrumbClick} />
      </div>
      <Button onClick={onCreateClick} icon={Plus}>
        {createButtonText[currentView]}
      </Button>
    </div>
  );
};

// ========================================================================
// --- LESSON CREATOR COMPONENTS ---
// ========================================================================
const bitTemplates = {
  text: { type: "text", data: { text: "" } },
  image: { type: "image", data: { url: "", caption: "" } },
  code: { type: "code", data: { language: "javascript", code: "" } },
  warning: { type: "warning", data: { title: "", message: "" } },
  hint: { type: "hint", data: { text: "" } },
  quiz_multiple_choice: {
    type: "quiz_multiple_choice",
    data: { question: "", options: ["", "", ""], correct_answer: "" },
  },
};
const inputStyles =
  "block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm";

const TextBitEditor = ({ data, onChange }) => (
  <textarea
    value={data.text}
    onChange={(e) => onChange({ text: e.target.value })}
    placeholder="Enter text content..."
    rows="4"
    className={inputStyles}
  />
);
const HintBitEditor = ({ data, onChange }) => (
  <textarea
    value={data.text}
    onChange={(e) => onChange({ text: e.target.value })}
    placeholder="Enter hint text..."
    rows="2"
    className={`${inputStyles} bg-yellow-50 border-yellow-200`}
  />
);
const ImageBitEditor = ({ data, onChange }) => (
  <>
    <input
      type="text"
      value={data.url}
      onChange={(e) => onChange({ ...data, url: e.target.value })}
      placeholder="Image URL"
      className={inputStyles}
    />
    <input
      type="text"
      value={data.caption}
      onChange={(e) => onChange({ ...data, caption: e.target.value })}
      placeholder="Image Caption"
      className={inputStyles}
    />
  </>
);
const WarningBitEditor = ({ data, onChange }) => (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
    <input
      type="text"
      value={data.title}
      onChange={(e) => onChange({ ...data, title: e.target.value })}
      placeholder="Warning Title"
      className={`${inputStyles} mb-2`}
    />
    <textarea
      value={data.message}
      onChange={(e) => onChange({ ...data, message: e.target.value })}
      placeholder="Warning Message"
      rows="3"
      className={inputStyles}
    />
  </div>
);
const CodeBitEditor = ({ data, onChange }) => (
  <>
    <input
      type="text"
      value={data.language}
      onChange={(e) => onChange({ ...data, language: e.target.value })}
      placeholder="Language (e.g., bash, javascript)"
      className={inputStyles}
    />
    <textarea
      value={data.code}
      onChange={(e) => onChange({ ...data, code: e.target.value })}
      placeholder="Enter code here..."
      rows="6"
      className={`${inputStyles} font-mono text-sm bg-slate-900 text-slate-100`}
    />
  </>
);
const QuizBitEditor = ({ data, onChange }) => {
  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...data.options];
    newOptions[optionIndex] = value;
    onChange({ ...data, options: newOptions });
  };
  return (
    <div className="space-y-2">
      <textarea
        value={data.question}
        onChange={(e) => onChange({ ...data, question: e.target.value })}
        placeholder="Quiz Question"
        rows="2"
        className={inputStyles}
      />
      <label className="text-xs font-semibold text-slate-600 block pt-2">
        Options:
      </label>
      {data.options.map((option, index) => (
        <input
          key={index}
          type="text"
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          placeholder={`Option ${index + 1}`}
          className={inputStyles}
        />
      ))}
      <label className="text-xs font-semibold text-slate-600 block pt-2">
        Correct Answer:
      </label>
      <input
        type="text"
        value={data.correct_answer}
        onChange={(e) => onChange({ ...data, correct_answer: e.target.value })}
        placeholder="Enter the exact text of the correct option"
        className={inputStyles}
      />
    </div>
  );
};

const BitRenderer = ({
  bit,
  stepIndex,
  bitIndex,
  onDeleteBit,
  onBitChange,
}) => {
  const handleDataChange = (newData) =>
    onBitChange(stepIndex, bitIndex, newData);

  const renderBitEditor = () => {
    switch (bit.type) {
      case "text":
        return <TextBitEditor data={bit.data} onChange={handleDataChange} />;
      case "image":
        return <ImageBitEditor data={bit.data} onChange={handleDataChange} />;
      case "code":
        return <CodeBitEditor data={bit.data} onChange={handleDataChange} />;
      case "warning":
        return <WarningBitEditor data={bit.data} onChange={handleDataChange} />;
      case "hint":
        return <HintBitEditor data={bit.data} onChange={handleDataChange} />;
      case "quiz_multiple_choice":
        return <QuizBitEditor data={bit.data} onChange={handleDataChange} />;
      default:
        return <p>Unknown bit type</p>;
    }
  };

  return (
    <div className="border border-slate-200 rounded-md p-4 bg-slate-50/50">
      <div className="flex justify-between items-center mb-3">
        <strong className="text-sm font-medium text-slate-600 capitalize">
          {bit.type.replace(/_/g, " ")}
        </strong>
        <button
          onClick={() => onDeleteBit(stepIndex, bitIndex)}
          className="text-slate-400 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>
      </div>
      <div className="space-y-2">{renderBitEditor()}</div>
    </div>
  );
};

const StepEditor = ({
  step,
  stepIndex,
  onStepChange,
  onDeleteStep,
  onAddBit,
  onDeleteBit,
  onBitChange,
}) => {
  const [selectedBitType, setSelectedBitType] = useState("text");

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center gap-4 mb-4">
        <input
          type="text"
          value={step.title}
          onChange={(e) => onStepChange(stepIndex, "title", e.target.value)}
          className={`${inputStyles} text-xl font-semibold`}
        />
        <Button
          onClick={() => onDeleteStep(stepIndex)}
          variant="secondary"
          className="px-2 py-2 text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-4">
        {step.bits.content.map((bit, bitIndex) => (
          <BitRenderer
            key={bitIndex}
            bit={bit}
            stepIndex={stepIndex}
            bitIndex={bitIndex}
            onDeleteBit={onDeleteBit}
            onBitChange={onBitChange}
          />
        ))}
      </div>
      <div className="flex gap-2 mt-6 pt-4 border-t border-slate-200">
        <select
          value={selectedBitType}
          onChange={(e) => setSelectedBitType(e.target.value)}
          className={inputStyles}
        >
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="code">Code</option>
          <option value="warning">Warning</option>
          <option value="hint">Hint</option>
          <option value="quiz_multiple_choice">Quiz (MCQ)</option>
        </select>
        <Button
          onClick={() => onAddBit(stepIndex, selectedBitType)}
          variant="secondary"
          className="flex-shrink-0"
        >
          + Add Bit
        </Button>
      </div>
    </div>
  );
};

const LessonCreator = React.forwardRef(({ initialData }, ref) => {
  const [lesson, setLesson] = useState(
    initialData || {
      title: "",
      description: "",
      steps: [],
    }
  );

  React.useImperativeHandle(ref, () => ({
    getLessonState: () => lesson,
  }));

  const handleLessonMetaChange = (e) => {
    const { name, value } = e.target;
    setLesson((prev) => ({ ...prev, [name]: value }));
  };
  const addStep = () => {
    setLesson((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: `Step ${prev.steps.length + 1}`,
          bits: { version: "1.0", content: [] },
        },
      ],
    }));
  };
  const deleteStep = (stepIndex) => {
    setLesson((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== stepIndex),
    }));
  };
  const handleStepChange = (stepIndex, field, value) => {
    const newSteps = [...lesson.steps];
    newSteps[stepIndex][field] = value;
    setLesson({ ...lesson, steps: newSteps });
  };
  const addBit = (stepIndex, bitType) => {
    const newSteps = [...lesson.steps];
    newSteps[stepIndex].bits.content.push(
      JSON.parse(JSON.stringify(bitTemplates[bitType]))
    );
    setLesson({ ...lesson, steps: newSteps });
  };
  const deleteBit = (stepIndex, bitIndex) => {
    const newSteps = [...lesson.steps];
    newSteps[stepIndex].bits.content.splice(bitIndex, 1);
    setLesson({ ...lesson, steps: newSteps });
  };
  const handleBitChange = (stepIndex, bitIndex, newBitData) => {
    const newSteps = [...lesson.steps];
    newSteps[stepIndex].bits.content[bitIndex].data = newBitData;
    setLesson({ ...lesson, steps: newSteps });
  };

  return (
    <div className="flex h-full bg-slate-50">
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="space-y-4 mb-8">
          <input
            type="text"
            name="title"
            value={lesson.title}
            onChange={handleLessonMetaChange}
            className={`${inputStyles} text-2xl font-bold`}
            placeholder="Lesson Title"
          />
          <textarea
            name="description"
            value={lesson.description}
            onChange={handleLessonMetaChange}
            className={inputStyles}
            placeholder="Lesson Description"
            rows="3"
          />
        </div>
        <div className="space-y-6">
          {lesson.steps.map((step, stepIndex) => (
            <StepEditor
              key={stepIndex}
              step={step}
              stepIndex={stepIndex}
              onStepChange={handleStepChange}
              onDeleteStep={deleteStep}
              onAddBit={addBit}
              onDeleteBit={deleteBit}
              onBitChange={handleBitChange}
            />
          ))}
        </div>
        <Button
          onClick={addStep}
          icon={Plus}
          variant="secondary"
          className="mt-6"
        >
          Add New Step
        </Button>
      </div>
      <div className="flex-1 hidden lg:block p-10 bg-slate-800 text-slate-300 overflow-y-auto">
        <h2 className="text-xl font-semibold text-slate-100 mb-4 pb-4 border-b border-slate-600">
          Live JSON Preview
        </h2>
        <pre className="text-xs whitespace-pre-wrap">
          {JSON.stringify(lesson, null, 2)}
        </pre>
      </div>
    </div>
  );
});

const LessonCreatorModal = ({ onSave, onCancel, category, subcategory }) => {
  const creatorRef = React.useRef();
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
      <header className="bg-white p-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Create New Lesson
          </h2>
          <p className="text-sm text-slate-500">
            In: {category} / {subcategory}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => onSave(creatorRef.current.getLessonState())}
            icon={Save}
          >
            Save Lesson
          </Button>
        </div>
      </header>
      <div className="flex-grow overflow-y-auto">
        <LessonCreator ref={creatorRef} />
      </div>
    </div>
  );
};

// ========================================================================
// --- MAIN LEARNER DASHBOARD COMPONENT ---
// ========================================================================

const LearnerDashboard = () => {
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState(initialCategories);
  const [lessons, setLessons] = useState(mockLessons);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCreatingSubCategory, setIsCreatingSubCategory] = useState(false);
  const [isCreatingLesson, setIsCreatingLesson] = useState(false);

  const handleCreateCategory = (name) => {
    if (name && !categories[name]) {
      setCategories((prev) => ({ ...prev, [name]: [] }));
    }
    setIsCreatingCategory(false);
  };

  const handleCreateSubCategory = (name) => {
    if (name && !categories[selectedCategory].includes(name)) {
      setCategories((prev) => ({
        ...prev,
        [selectedCategory]: [...prev[selectedCategory], name],
      }));
    }
    setIsCreatingSubCategory(false);
  };

  const handleCreateLesson = (lessonData) => {
    if (!lessonData || !lessonData.title.trim()) {
      alert("Lesson must have a title.");
      return;
    }
    const newLesson = {
      ...lessonData,
      id: Date.now(),
      category: selectedCategory,
      subcategory: selectedSubCategory,
      tags: [],
      difficulty: 2,
      modified: new Date().toISOString().split("T")[0],
    };
    setLessons((prev) => [newLesson, ...prev]);
    setIsCreatingLesson(false);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return { categories, lessons };
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredLessons = lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(lowercasedFilter)
    );
    const relevantCategories = new Set(filteredLessons.map((l) => l.category));
    const filteredCategories = Object.keys(categories)
      .filter(
        (cat) =>
          cat.toLowerCase().includes(lowercasedFilter) ||
          relevantCategories.has(cat)
      )
      .reduce((acc, cat) => {
        acc[cat] = categories[cat];
        return acc;
      }, {});
    return { categories: filteredCategories, lessons: filteredLessons };
  }, [searchTerm, categories, lessons]);

  const navigateTo = (targetView, category = null, subcategory = null) => {
    setView(targetView);
    setSelectedCategory(category);
    setSelectedSubCategory(subcategory);
  };

  const handleBreadcrumbClick = (targetView) => {
    if (targetView === "categories") {
      navigateTo("categories");
    } else if (targetView === "subcategories") {
      navigateTo("subcategories", selectedCategory);
    }
  };

  const handleCreateClick = () => {
    if (view === "categories") setIsCreatingCategory(true);
    if (view === "subcategories") setIsCreatingSubCategory(true);
    if (view === "lessons") setIsCreatingLesson(true);
  };

  const renderContent = () => {
    if (view === "subcategories") {
      const subcategories = categories[selectedCategory] || [];
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subcategories.map((sub) => (
            <SubCategoryCard
              key={sub}
              name={sub}
              lessonCount={
                filteredData.lessons.filter(
                  (l) =>
                    l.category === selectedCategory && l.subcategory === sub
                ).length
              }
              onClick={() => navigateTo("lessons", selectedCategory, sub)}
            />
          ))}
        </div>
      );
    }

    if (view === "lessons") {
      const currentLessons = filteredData.lessons.filter(
        (l) =>
          l.category === selectedCategory &&
          l.subcategory === selectedSubCategory
      );
      if (currentLessons.length === 0) {
        return (
          <EmptyState
            title="No Lessons Found"
            message={`There are no lessons in "${selectedSubCategory}". Get started by creating one.`}
            actionText="Create New Lesson"
            onActionClick={handleCreateClick}
          />
        );
      }
      return (
        <div className="space-y-3">
          {currentLessons.map((lesson) => (
            <LessonListItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      );
    }

    const categoryKeys = Object.keys(filteredData.categories);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryKeys.map((cat) => (
          <CategoryCard
            key={cat}
            name={cat}
            subcategoryCount={(categories[cat] || []).length}
            lessonCount={
              filteredData.lessons.filter((l) => l.category === cat).length
            }
            onClick={() => navigateTo("subcategories", cat)}
          />
        ))}
      </div>
    );
  };

  const breadcrumbPaths = useMemo(() => {
    const paths = [{ label: "All Categories", view: "categories" }];
    if (selectedCategory) {
      paths.push({ label: selectedCategory, view: "subcategories" });
    }
    if (selectedSubCategory) {
      paths.push({ label: selectedSubCategory, view: "lessons" });
    }
    return paths;
  }, [view, selectedCategory, selectedSubCategory]);

  return (
    <div className="bg-slate-50 min-h-screen p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          breadcrumbPaths={breadcrumbPaths}
          onBreadcrumbClick={handleBreadcrumbClick}
          onCreateClick={handleCreateClick}
          currentView={view}
        />
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search for lessons, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-lg pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
          </div>
        </div>
        <main>{renderContent()}</main>
        {isCreatingCategory && (
          <CreateModal
            title="Create New Category"
            placeholder="e.g., Python Programming"
            onSave={handleCreateCategory}
            onCancel={() => setIsCreatingCategory(false)}
          />
        )}
        {isCreatingSubCategory && (
          <CreateModal
            title={`Create Sub-category in ${selectedCategory}`}
            placeholder="e.g., Data Structures"
            onSave={handleCreateSubCategory}
            onCancel={() => setIsCreatingSubCategory(false)}
          />
        )}
        {isCreatingLesson && (
          <LessonCreatorModal
            onSave={handleCreateLesson}
            onCancel={() => setIsCreatingLesson(false)}
            category={selectedCategory}
            subcategory={selectedSubCategory}
          />
        )}
      </div>
    </div>
  );
};

export default LearnerDashboard;
