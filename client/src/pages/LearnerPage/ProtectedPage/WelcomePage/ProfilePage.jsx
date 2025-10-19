import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Award,
  Book,
  Briefcase,
  GraduationCap,
  Code,
  Github,
  Link,
  MapPin,
  Target,
  Plus,
  Trash2,
  ExternalLink,
  Linkedin,
  Phone,
  BarChart3,
  Clock,
} from "lucide-react";

// --- MOCK DATA (Same as V3) ---
const mockData = {
  profile: {
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 123 456 7890",
    headline: "Senior Software Engineer @ TechCorp",
    location: "San Francisco, CA",
    socials: {
      github: "https://github.com/alexjohnson",
      linkedin: "https://linkedin.com/in/alexjohnson",
      website: "https://alexjohnson.dev",
    },
  },
  about: {
    bio: "Passionate Senior Software Engineer with 8+ years of experience in building scalable web applications using React, Node.js, and cloud-native technologies. Proven track record of leading teams and delivering high-quality products from concept to deployment. Always eager to learn and tackle new challenges.",
  },
  experiences: [
    {
      id: "exp1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      date: "Jan 2022 - Present",
      description:
        "Led the development of a new microservices-based platform, improving system scalability by 40%. Mentored junior developers and conducted code reviews.",
    },
    {
      id: "exp2",
      title: "Mid-Level Developer",
      company: "Innovate Inc.",
      date: "Jun 2018 - Dec 2021",
      description:
        "Developed and maintained key features for a high-traffic e-commerce site using React and Redux. Collaborated with cross-functional teams.",
    },
  ],
  educations: [
    {
      id: "edu1",
      degree: "M.S. in Computer Science",
      school: "Stanford University",
      date: "2016 - 2018",
      description: "Focused on machine learning and distributed systems.",
    },
  ],
  projects: [
    {
      id: "proj1",
      title: "Real-Time Chat App",
      description:
        "A full-stack chat application built with WebSocket and Node.js.",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
      projectUrl: "#",
      repoUrl: "#",
      tags: ["React", "Node.js", "WebSocket"],
    },
    {
      id: "proj2",
      title: "AI-Powered Budget Tracker",
      description: "A mobile-first app using Plaid API and a custom ML model.",
      imageUrl:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=200&fit=crop",
      projectUrl: "#",
      repoUrl: "#",
      tags: ["React Native", "Python", "Plaid API"],
    },
  ],
  skills: [
    "JavaScript (ES6+)",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "Python",
    "Django",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "CI/CD",
    "Agile Methodologies",
  ],
};

// --- V4: Profile Header ---
const ProfileHeader = ({ profile, onEdit }) => {
  const getInitials = (first, last) =>
    first ? (first[0] + (last ? last[0] : "")).toUpperCase() : "?";

  return (
    // Replaced border with shadow
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-[#161b22]">
      <div className="p-6 md:flex md:items-center md:gap-6">
        <div className="relative h-24 w-24 flex-shrink-0 md:h-32 md:w-32">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-4xl font-bold text-white md:text-5xl">
            {getInitials(profile.firstName, profile.lastName)}
          </div>
          <button className="absolute bottom-0 right-0 rounded-full border-2 border-white bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 dark:border-[#161b22]">
            <Camera className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex-1 md:mt-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="mt-1 text-lg text-gray-700 dark:text-gray-300">
            {profile.headline}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Actively looking for new opportunities
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4" /> {profile.location}
            </span>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a
              href={profile.socials.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <Link className="h-4 w-4" /> Website
            </a>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-[#21262d] dark:text-gray-300 dark:hover:bg-[#30363d] md:w-auto"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

// --- V4: Segmented Sticky Nav ---
const SegmentedStickyNav = () => {
  const [activeSection, setActiveSection] = useState("about");
  // In a real app, you'd use IntersectionObserver to setActiveSection

  const navItems = [
    { name: "About", href: "#about", id: "about", icon: User },
    {
      name: "Experience",
      href: "#experience",
      id: "experience",
      icon: Briefcase,
    },
    { name: "Projects", href: "#projects", id: "projects", icon: Code },
    {
      name: "Education",
      href: "#education",
      id: "education",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="sticky top-4 z-30">
      <nav className="mx-auto flex w-full max-w-lg items-center justify-center rounded-full bg-slate-200/70 p-1.5 backdrop-blur-lg dark:bg-[#161b22]">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setActiveSection(item.id)}
            className={`group flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all
              ${
                activeSection === item.id
                  ? "bg-white text-gray-900 shadow-sm dark:bg-blue-500 dark:text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
};

// --- V4: Content Section Wrapper ---
const ContentSection = ({ id, children, onEditClick, title }) => (
  <section id={id} className="scroll-mt-24">
    {/* Replaced border with shadow */}
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-[#161b22]">
      <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800 sm:p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <Edit2 className="h-4 w-4" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}
      </div>
      <div className="space-y-6 p-4 sm:p-5">{children}</div>
    </div>
  </section>
);

// --- V4: Sidebar Widget ---
const SidebarWidget = ({
  title,
  icon,
  onEditClick,
  children,
  className = "",
}) => {
  const Icon = icon;
  return (
    // Replaced border with shadow
    <div
      className={`overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg dark:bg-[#161b22] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

// --- V4: Stats Widget ---
const StatsWidget = () => (
  <div className="grid grid-cols-2 gap-4">
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-neutral-800/50">
      <p className="text-sm text-gray-500 dark:text-gray-400">Years of Exp</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">8+</p>
    </div>
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-neutral-800/50">
      <p className="text-sm text-gray-500 dark:text-gray-400">Projects</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
    </div>
  </div>
);

// --- V4: Refined Timeline Card ---
const TimelineCard = ({
  title,
  subtitle,
  date,
  description,
  icon,
  isLast,
  onEditClick,
}) => {
  const Icon = icon;
  return (
    <div className="relative flex gap-4 group">
      {/* The Timeline Line */}
      {!isLast && (
        <div className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-neutral-700" />
      )}
      {/* The Icon Dot (Simplified) */}
      <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
        <Icon className="h-4 w-4" />
      </div>
      {/* The Content */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {subtitle}
            </p>
          </div>
          <button
            onClick={onEditClick}
            className="hidden rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-gray-100 hover:text-blue-600 group-hover:opacity-100 dark:hover:bg-neutral-800 dark:hover:text-blue-400 md:block"
          >
            <Edit2 className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{date}</p>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
};

// --- V4: Project Card (Shadows) ---
const ProjectCard = ({
  title,
  description,
  imageUrl,
  projectUrl,
  repoUrl,
  tags,
}) => (
  <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all hover:shadow-lg dark:bg-[#161b22]">
    <a href={projectUrl || "#"} target="_blank" rel="noopener noreferrer">
      <img
        src={imageUrl || "https://via.placeholder.com/400x200"}
        alt={title}
        className="h-40 w-full object-cover transition-transform group-hover:scale-105"
      />
    </a>
    <div className="p-4">
      <h3 className="text-md font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
        {description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-neutral-800/50 dark:text-gray-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        {projectUrl && (
          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            <ExternalLink className="h-4 w-4" /> Live Demo
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:underline dark:text-gray-300"
          >
            <Github className="h-4 w-4" /> Source
          </a>
        )}
      </div>
    </div>
  </div>
);

// --- V4: Refined Edit Modal ---
const EditModal = ({
  isOpen,
  onClose,
  onSave,
  resumeData,
  defaultTab = "profile",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [formData, setFormData] = useState(resumeData);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setFormData(resumeData);
    }
  }, [isOpen, defaultTab, resumeData]);

  if (!isOpen) return null;

  const tabs = [
    { name: "Profile", id: "profile" },
    { name: "About", id: "about" },
    { name: "Contact", id: "contact" },
    { name: "Skills", id: "skills" },
    { name: "Experience", id: "experience" },
    { name: "Projects", id: "projects" },
    { name: "Education", id: "education" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Your Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex">
          {/* Modal Tab Navigation */}
          <div className="w-1/3 border-r border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
            <nav className="flex flex-col space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-md px-3 py-2 text-left text-sm font-medium transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100/50 dark:text-gray-300 dark:hover:bg-neutral-800/50"
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Modal Tab Content */}
          <div className="w-2/3 p-6 h-96 overflow-y-auto">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Headline
                </label>
                <input
                  type="text"
                  defaultValue={formData.profile.headline}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  defaultValue={formData.profile.location}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            )}
            {activeTab === "about" && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Biography
                </label>
                <textarea
                  rows={5}
                  defaultValue={formData.about.bio}
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            )}
            {/* ... other tab panels ... */}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 p-4 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Save className="h-4 w-4" /> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component (V4) ---
const DigitalResumePageV4 = () => {
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultTab, setModalDefaultTab] = useState("profile");

  useEffect(() => {
    setTimeout(() => {
      setResumeData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const openModal = (tab) => {
    setModalDefaultTab(tab);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    console.log("Saving data...");
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }
  if (!resumeData) {
    return (
      <div className="flex h-96 items-center justify-center bg-gray-100 dark:bg-neutral-950">
        <p className="text-gray-500 dark:text-gray-400">
          Failed to load resume
        </p>
      </div>
    );
  }

  const { profile, about, experiences, educations, projects, skills } =
    resumeData;

  return (
    // New page background color
    <div className="min-h-screen   dark:bg-[#0d1117]">
      <div className="mx-auto max-w-7xl space-y-6 p-4 py-6 sm:p-6 lg:p-8">
        <ProfileHeader profile={profile} onEdit={() => openModal("profile")} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
          {/* --- Main Column (Left) --- */}
          <div className="flex flex-col space-y-6">
            <SegmentedStickyNav />

            <ContentSection
              id="about"
              title="About"
              onEditClick={() => openModal("about")}
            >
              <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                {about.bio}
              </p>
            </ContentSection>

            <ContentSection
              id="experience"
              title="Experience"
              onEditClick={() => openModal("experience")}
            >
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <TimelineCard
                    key={exp.id}
                    title={exp.title}
                    subtitle={exp.company}
                    date={exp.date}
                    description={exp.description}
                    icon={Briefcase}
                    isLast={i === experiences.length - 1}
                    onEditClick={() => openModal("experience")}
                  />
                ))}
              </div>
            </ContentSection>

            <ContentSection
              id="projects"
              title="Projects"
              onEditClick={() => openModal("projects")}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {projects.map((proj) => (
                  <ProjectCard key={proj.id} {...proj} />
                ))}
              </div>
            </ContentSection>

            <ContentSection
              id="education"
              title="Education"
              onEditClick={() => openModal("education")}
            >
              <div className="space-y-6">
                {educations.map((edu, i) => (
                  <TimelineCard
                    key={edu.id}
                    title={edu.degree}
                    subtitle={edu.school}
                    date={edu.date}
                    description={edu.description}
                    icon={GraduationCap}
                    isLast={i === educations.length - 1}
                    onEditClick={() => openModal("education")}
                  />
                ))}
              </div>
            </ContentSection>
          </div>

          {/* --- Sidebar (Right) --- */}
          <div className="space-y-6 lg:sticky lg:top-4 lg:self-start">
            <SidebarWidget title="Quick Stats" icon={BarChart3}>
              <StatsWidget />
            </SidebarWidget>

            <SidebarWidget
              title="Skills"
              icon={Award}
              onEditClick={() => openModal("skills")}
            >
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </SidebarWidget>

            <SidebarWidget
              title="Contact"
              icon={Mail}
              onEditClick={() => openModal("contact")}
            >
              <div className="space-y-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3"
                >
                  <Mail className="h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                    {profile.email}
                  </span>
                </a>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {profile.phone}
                  </span>
                </div>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <Linkedin className="h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                    LinkedIn
                  </span>
                </a>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3"
                >
                  <Github className="h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                    GitHub
                  </span>
                </a>
                <a
                  href={profile.socials.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-Cente-center gap-3"
                >
                  <ExternalLink className="h-4 w-4 text-gray-500 group-hover:text-blue-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400">
                    Personal Website
                  </span>
                </a>
              </div>
            </SidebarWidget>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        resumeData={resumeData}
        defaultTab={modalDefaultTab}
      />
    </div>
  );
};

export default DigitalResumePageV4;
