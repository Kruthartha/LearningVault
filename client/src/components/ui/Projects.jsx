import { useState, useEffect, useRef } from "react";
import { ArrowRight, Code, GitBranch, Heart, Share2, Eye } from "lucide-react";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce application built with React and Node.js",
      status: "completed",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
      completedDate: "2024-01-15",
      likes: 24,
      views: 156,
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A productivity app with real-time collaboration features",
      status: "in-progress",
      technologies: ["Vue.js", "Firebase", "Tailwind CSS"],
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
      progress: 75,
      dueDate: "2024-02-20",
      likes: 12,
      views: 89,
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "Interactive weather application with data visualization",
      status: "completed",
      technologies: ["JavaScript", "Chart.js", "OpenWeather API"],
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=400&h=200&fit=crop",
      completedDate: "2023-12-10",
      likes: 18,
      views: 134,
      githubUrl: "#",
      liveUrl: "#",
    },
    {
      id: 4,
      title: "Portfolio Website",
      description: "Personal portfolio showcasing projects and skills",
      status: "planning",
      technologies: ["Next.js", "TypeScript", "Framer Motion"],
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=200&fit=crop",
      startDate: "2024-03-01",
      likes: 5,
      views: 23,
    },
  ];

  const filteredProjects = projects.filter(
    (project) => filter === "all" || project.status === filter
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === "completed"
                ? "bg-green-100 text-green-600"
                : project.status === "in-progress"
                ? "bg-blue-100 text-blue-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {project.status.charAt(0).toUpperCase() +
              project.status.slice(1).replace("-", " ")}
          </span>
        </div>

        {project.status === "in-progress" && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{project.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.githubUrl && (
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <GitBranch className="w-4 h-4" />
              </button>
            )}
            {project.liveUrl && (
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-black mb-4">Projects</h2>
        <p className="text-xl text-gray-600 font-light">
          Showcase your skills through hands-on projects
        </p>
      </div>
      

      {/* Filters */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Projects" },
            { key: "completed", label: "Completed" },
            { key: "in-progress", label: "In Progress" },
            { key: "planning", label: "Planning" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-slate-800 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Add New Project */}


    </div>
  );
};

export default Projects;
