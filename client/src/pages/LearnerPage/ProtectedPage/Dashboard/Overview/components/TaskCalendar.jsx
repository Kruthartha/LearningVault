import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle,
  Check,
  ArrowLeft,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Loader2, // Added for loading state
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- API Base URL ---
const API_URL = import.meta.env.VITE_API_URL;
const TASK_URL = `${API_URL}/tasks`

// --- Utility Functions ---
const isSameDay = (d1, d2) => {
  if (!d1 || !d2) return false;
  // Ensure d1 and d2 are Date objects
  const date1 = d1 instanceof Date ? d1 : new Date(d1);
  const date2 = d2 instanceof Date ? d2 : new Date(d2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const PRIORITY_COLORS = {
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-gray-400",
};

// --- Framer Motion Animation Variants ---
const modalTransition = { type: "spring", stiffness: 400, damping: 40 };
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
};
const viewTransition = { type: "tween", duration: 0.2, ease: "easeInOut" };

// --- Sub-Components ---

const TaskItem = React.memo(({ task, onToggleStatus, onEdit, onDelete }) => {
  const { id, title, course, priority, time, status } = task;
  const isDone = status === "done" || status === "completed"; // Handle both
  const priorityColor = PRIORITY_COLORS[priority] || PRIORITY_COLORS.low;

  return (
    <motion.div
      layout
      className="flex items-center gap-4 py-3 px-2 border-b border-slate-200/70 dark:border-zinc-800 group"
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${priorityColor} flex-shrink-0 ml-1`}
      ></div>
      <div className="flex-1">
        <p
          className={`text-slate-800 dark:text-zinc-200 transition-opacity ${
            isDone ? "line-through opacity-40" : ""
          }`}
        >
          {title}
        </p>
        <p
          className={`text-sm text-slate-500 dark:text-zinc-400 transition-opacity ${
            isDone ? "opacity-40" : ""
          }`}
        >
          {course}
        </p>
      </div>
      {time && (
        <span
          className={`text-sm font-mono text-slate-400 dark:text-zinc-500 transition-opacity ${
            isDone ? "opacity-40" : ""
          }`}
        >
          {time}
        </span>
      )}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1 rounded-full hover:bg-zinc-500/20"
        >
          <Edit2 size={16} className="text-zinc-400" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-full hover:bg-red-500/10"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
      <motion.button
        aria-label={`Mark ${title} as ${isDone ? "pending" : "done"}`}
        onClick={() => onToggleStatus(id)}
        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          isDone
            ? "border-blue-500 bg-blue-500"
            : "border-slate-300 dark:border-zinc-600 group-hover:border-blue-400"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check size={16} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
});

const TaskModal = ({ taskToEdit, date, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [priority, setPriority] = useState("medium");
  const [time, setTime] = useState("10:00");
  const [currentDate, setCurrentDate] = useState(date);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!taskToEdit;

  useEffect(() => {
    if (isEditing) {
      setTitle(taskToEdit.title);
      setCourse(taskToEdit.course || "");
      setPriority(taskToEdit.priority);
      setTime(taskToEdit.time || "10:00");
      setCurrentDate(new Date(taskToEdit.date));
    } else {
      setTitle("");
      setCourse("");
      setPriority("medium");
      setTime("10:00");
      setCurrentDate(date);
    }
  }, [taskToEdit, isEditing, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSaving) return;
    setIsSaving(true);

    const taskData = {
      title,
      course,
      date: currentDate.toISOString(), // Send as ISO string
      priority,
      time,
      status: isEditing ? taskToEdit.status : "pending",
    };

    // [MODIFIED] Only add ID if we are editing
    if (isEditing) {
      taskData.id = taskToEdit.id;
    }

    const success = await onSave(taskData);
    setIsSaving(false);
    if (success) {
      onCancel(); // Close modal on success
    } else {
      // Handle error display (e.g., a toast notification)
      alert("Failed to save task.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-lg p-4"
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={modalTransition}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900/80 backdrop-blur-2xl p-6 shadow-2xl border border-white/20 dark:border-white/10"
      >
        <h3 className="text-lg font-semibold mb-1 text-slate-900 dark:text-zinc-100">
          {isEditing ? "Edit Task" : "New Task"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mb-6">
          on{" "}
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title (e.g., Design Review)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-black/5 dark:bg-white/10 p-3 text-sm text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent placeholder:text-zinc-500"
            required
            autoFocus
          />
          <input
            type="text"
            placeholder="Course or Category"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="w-full rounded-lg bg-black/5 dark:bg-white/10 p-3 text-sm text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent placeholder:text-zinc-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg bg-black/5 dark:bg-white/10 p-3 text-sm text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-lg bg-black/5 dark:bg-white/10 p-3 text-sm text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent appearance-none"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSaving}
              className="w-full rounded-lg bg-slate-500/20 dark:bg-zinc-700 px-4 py-2.5 text-sm font-semibold text-slate-800 dark:text-zinc-200 hover:bg-slate-500/30 dark:hover:bg-zinc-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>{isEditing ? "Save Changes" : "Add Task"}</>
              )}
            </button>
          </div>
        </form>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 rounded-full text-zinc-500 hover:bg-zinc-500/20"
        >
          <X size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

const MiniCalendar = ({ currentDate, onDateChange, tasksByDate }) => {
  const { monthDays, firstDayOfMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
    return { monthDays: days, firstDayOfMonth: firstDay.getDay() };
  }, [currentDate]);

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    onDateChange(newDate);
  };

  const today = new Date();

  return (
    <div className="p-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-medium text-slate-400 dark:text-zinc-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 mt-2">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {monthDays.map((day) => {
          // Component's `tasksByDate` uses `toDateString()` as key
          const hasTasks = tasksByDate.has(day.toDateString());
          return (
            <div
              key={day.toISOString()}
              className="flex justify-center items-center py-1"
            >
              <button
                onClick={() => onDateChange(day)}
                className={`relative h-7 w-7 rounded-full text-sm transition-colors flex items-center justify-center
                                ${
                                  isSameDay(day, currentDate)
                                    ? "bg-blue-500 text-white font-semibold"
                                    : ""
                                }
                                ${
                                  !isSameDay(day, currentDate) &&
                                  isSameDay(day, today)
                                    ? "text-blue-500 font-semibold"
                                    : ""
                                }
                                ${
                                  !isSameDay(day, currentDate) &&
                                  !isSameDay(day, today)
                                    ? "text-slate-700 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10"
                                    : ""
                                }`}
              >
                {day.getDate()}
                {hasTasks && (
                  <span
                    className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                      isSameDay(day, currentDate) ? "bg-white" : "bg-blue-500"
                    }`}
                  ></span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Calendar Component ---
// [MODIFIED] Receives tasks and handlers as props
const TaskCalendar = ({
  tasks,
  setTasks,
  onSaveTask,
  onDeleteTask,
  onToggleStatus,
}) => {
  const [view, setView] = useState("agenda");
  // Use today's date as default
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // [MODIFIED] This useMemo now correctly uses the `tasks` prop
  const tasksByDate = useMemo(() => {
    const map = new Map();
    tasks.forEach((task) => {
      // API sends ISO string, new Date() handles it correctly
      const dateKey = new Date(task.date).toDateString();
      if (!map.has(dateKey)) map.set(dateKey, []);
      map.get(dateKey).push(task);
    });
    return map;
  }, [tasks]);

  const { monthDays, firstDayOfMonth } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1)
    );
    return { monthDays: days, firstDayOfMonth: firstDay.getDay() };
  }, [currentDate]);

  const handleOpenModalForCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // [MODIFIED] This function now calls the API handler passed via props
  const handleSaveTask = async (taskData) => {
    const success = await onSaveTask(taskData);
    if (success) {
      setIsModalOpen(false);
      setTaskToEdit(null);
    }
    return success; // Return success status to modal
  };

  // [MODIFIED] This function now calls the API handler passed via props
  const handleDeleteTask = (taskId) => {
    // Confirmation is now handled in the parent
    onDeleteTask(taskId);
  };

  // [MODIFIED] This function now calls the API handler passed via props
  const handleToggleStatus = (taskId) => {
    onToggleStatus(taskId);
  };

  const changeMonth = (offset) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset, 1);
      return newDate;
    });
  };

  const today = new Date();

  // --- Views ---
  const MonthView = () => (
    <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-slate-200/40 dark:bg-zinc-800/20">
      {/* Add weekday headers */}
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="p-2 text-xs font-semibold text-center text-slate-500 dark:text-zinc-400 border-b border-r border-slate-200/70 dark:border-zinc-800"
        >
          {day}
        </div>
      ))}
      {/* Add padding for first day */}
      {Array.from({ length: firstDayOfMonth }).map((_, i) => (
        <div
          key={`pad-${i}`}
          className="border-r border-b border-slate-200/70 dark:border-zinc-800"
        />
      ))}
      {monthDays.map((day) => {
        const dayTasks = tasksByDate.get(day.toDateString()) || [];
        return (
          <div
            key={day.toISOString()}
            className="relative flex flex-col p-2 bg-white/60 dark:bg-black/50 border-r border-b border-slate-200/70 dark:border-zinc-800 group cursor-pointer min-h-[12vh]"
            onClick={() => {
              setCurrentDate(day);
              handleOpenModalForCreate();
            }}
          >
            <span
              className={`text-sm font-medium self-start ${
                isSameDay(day, today)
                  ? "flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white font-semibold"
                  : "text-slate-600 dark:text-zinc-300"
              }`}
            >
              {day.getDate()}
            </span>
            <div className="mt-1.5 space-y-1 flex-1 overflow-hidden">
              {dayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModalForEdit(task);
                  }}
                  className={`flex items-center gap-1.5 text-xs truncate p-1 rounded-md bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20 ${
                    task.status === "done" ? "opacity-40" : ""
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      PRIORITY_COLORS[task.priority]
                    }`}
                  />
                  <p className="text-slate-700 dark:text-zinc-300 truncate">
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  const AgendaView = () => {
    const groupedTasks = Array.from(tasksByDate.entries()).sort(
      (a, b) => new Date(a[0]) - new Date(b[0])
    );
    return (
      <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
        {groupedTasks.length > 0 ? (
          groupedTasks.map(([dateKey, tasksOnDay]) => {
            const date = new Date(dateKey);
            return (
              <div key={dateKey} className="relative pl-8">
                <div className="absolute left-0 top-1.5 flex flex-col items-center">
                  <span className="text-xs uppercase font-medium text-slate-400 dark:text-zinc-500">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span
                    className={`text-xl font-semibold mt-0.5 ${
                      isSameDay(date, today)
                        ? "text-blue-500"
                        : "text-slate-700 dark:text-zinc-300"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="h-full w-px bg-slate-200/70 dark:bg-zinc-800 mt-2"></div>
                </div>
                <Reorder.Group
                  axis="y"
                  values={tasksOnDay}
                  onReorder={(newOrder) => {
                    // This reorder is visual only and doesn't persist.
                    // To persist, you'd need a separate API call.
                    // For now, we update local state via `setTasks`.
                    const otherTasks = tasks.filter(
                      (t) => new Date(t.date).toDateString() !== dateKey
                    );
                    setTasks([...otherTasks, ...newOrder]);
                  }}
                >
                  {tasksOnDay.map((task) => (
                    <Reorder.Item
                      key={task.id}
                      value={task}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TaskItem
                        task={task}
                        onToggleStatus={handleToggleStatus}
                        onEdit={handleOpenModalForEdit}
                        onDelete={handleDeleteTask}
                      />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <CheckCircle
              size={48}
              className="text-slate-300 dark:text-zinc-700 mb-4"
            />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-zinc-300">
              All Done
            </h3>
            <p className="text-slate-500 dark:text-zinc-500">
              Your schedule is clear.
            </p>
          </div>
        )}
      </div>
    );
  };

  const views = { month: <MonthView />, agenda: <AgendaView /> };

  return (
    <>
      <div className="flex h-[88vh] rounded-2xl bg-white/50 dark:bg-zinc-950/70 shadow-2xl backdrop-blur-3xl border border-white/30 dark:border-white/10 overflow-hidden">
        {/* --- Sidebar --- */}
        <aside className="w-64 flex-shrink-0 p-4 flex flex-col bg-slate-100/50 dark:bg-zinc-900/50 border-r border-slate-200/70 dark:border-zinc-800">
          <MiniCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            tasksByDate={tasksByDate}
          />
          <div className="mt-4 border-t border-slate-200/70 dark:border-zinc-800 flex-1 pt-4 overflow-y-auto">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mb-2 px-2">
              Agenda for{" "}
              {currentDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </h3>
            {Array.from(tasksByDate.get(currentDate.toDateString()) || []).map(
              (task) => (
                <div
                  key={task.id}
                  className={`text-sm p-2 rounded-lg flex items-start gap-2 cursor-pointer hover:bg-slate-200/70 dark:hover:bg-zinc-800 ${
                    task.status === "done" ? "opacity-50" : ""
                  }`}
                  onClick={() => handleOpenModalForEdit(task)}
                >
                  <div
                    className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      PRIORITY_COLORS[task.priority]
                    }`}
                  />
                  <div>
                    <p className="font-medium text-slate-800 dark:text-zinc-200">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-zinc-400">
                      {task.time}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
          <button
            onClick={handleOpenModalForCreate}
            className="w-full mt-4 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus size={16} /> New Task
          </button>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-3 border-b border-slate-200/70 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 rounded-lg hover:bg-slate-500/10 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-semibold w-40 text-center text-slate-800 dark:text-zinc-100">
                {currentDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 rounded-lg hover:bg-slate-500/10 dark:hover:bg-zinc-800 text-zinc-500"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={() => setCurrentDate(today)}
                className="px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-zinc-300 rounded-lg hover:bg-slate-500/10 dark:hover:bg-zinc-800 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-1 bg-slate-200/70 dark:bg-zinc-800/50 p-1 rounded-lg">
              {[
                { id: "month", icon: LayoutGrid },
                { id: "agenda", icon: List },
              ].map((v) => (
                <button
                  key={v.id}
                  onClick={() => setView(v.id)}
                  className="relative px-3 py-1 text-sm font-medium text-slate-600 dark:text-zinc-300 z-10 transition-colors rounded-md"
                >
                  {view === v.id && (
                    <motion.div
                      layoutId="view-switcher"
                      className="absolute inset-0 bg-white dark:bg-zinc-700 shadow-sm rounded-md"
                      transition={modalTransition}
                    />
                  )}
                  <v.icon size={16} className="relative" />
                </button>
              ))}
            </div>
          </header>
          <div className="flex-1 flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={viewTransition}
                className="flex flex-col flex-1"
              >
                {views[view]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal
            taskToEdit={taskToEdit}
            date={currentDate}
            onSave={handleSaveTask}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// --- [MODIFIED] Page Wrapper Component ---
const CalendarPage = () => {
  const navigate = useNavigate();
  // [NEW] All state is managed here
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // [NEW] Fetch data on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("accessToken"); // Get token from storage
      if (!token) {
        setError("You are not authorized. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(TASK_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch tasks");
        }
        const data = await response.json();
        // Sort tasks by date once on load
        const sortedTasks = data.tasks.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setTasks(sortedTasks);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []); // Empty array ensures this runs only once on mount

  // [NEW] API handler for Create/Update
  const handleSaveTask = async (taskData) => {
    const token = localStorage.getItem("accessToken");
    // Check if taskData has an 'id' property to determine if it's an edit
    const isEditing = taskData.hasOwnProperty("id");

    let url = TASK_URL;
    let method = "POST";

    if (isEditing) {
      url = `${TASK_URL}/${taskData.id}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to save task");
      }

      const savedTask = await response.json();

      // Update local state
      if (isEditing) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
        );
      } else {
        // Add new task and re-sort
        setTasks((prevTasks) =>
          [...prevTasks, savedTask].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
      }
      return true; // Signal success
    } catch (err) {
      setError(err.message);
      return false; // Signal failure
    }
  };

  // [NEW] API handler for Delete
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${TASK_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete task");
      }

      // Update local state
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  // [NEW] API handler for Toggling Status
  const handleToggleStatus = async (taskId) => {
    const token = localStorage.getItem("accessToken");
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus =
      task.status === "done" || task.status === "completed"
        ? "pending"
        : "done";
    // Create the payload for the PUT request
    const updatedTaskPayload = { ...task, status: newStatus };

    try {
      const response = await fetch(`${TASK_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTaskPayload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update task status");
      }

      const savedTask = await response.json();

      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === savedTask.id ? savedTask : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen font-sans p-4 ">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-2xl text-slate-500 hover:bg-slate-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-semibold text-slate-800 dark:text-zinc-200 ml-4">
          Calendar
        </h1>
      </div>

      {/* [NEW] Loading and Error handling */}
      {isLoading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 size={32} className="animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[80vh] p-8 text-center bg-red-100/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-2xl">
          <p>
            <strong>Error:</strong> {error}
          </p>
        </div>
      ) : (
        <TaskCalendar
          tasks={tasks}
          setTasks={setTasks} // Pass setter for local reordering
          onSaveTask={handleSaveTask}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default CalendarPage;
