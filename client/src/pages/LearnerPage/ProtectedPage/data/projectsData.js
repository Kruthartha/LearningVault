// src/data/projectsData.js

export const projectsData = {
  "react-todo-app": {
    id: 1,
    slug: "react-todo-app",
    title: "React Todo Application",
    description: "Build a full-featured todo application using React with local storage, filtering, and responsive design. This project will help you understand React hooks, state management, and modern JavaScript ES6+ features.",
    difficulty: "Beginner",
    estimatedTime: "15-20 hours",
    points: 100,
    submissions: 1247,
    rating: 4.8,
    dueDate: "Sep 15, 2025",
    technologies: ["React", "JavaScript", "CSS3", "HTML5", "Local Storage"],
    skills: ["Component Design", "State Management", "Event Handling", "Responsive Design"],
    
    objectives: [
      "Master React functional components and hooks",
      "Implement CRUD operations in a frontend application",
      "Learn local storage for data persistence",
      "Create responsive and accessible user interfaces",
      "Practice modern JavaScript (ES6+) features"
    ],
    
    features: [
      {
        title: "Add/Edit/Delete Todos",
        description: "Basic CRUD functionality for managing todo items"
      },
      {
        title: "Filter & Search",
        description: "Filter todos by status and search by text"
      },
      {
        title: "Local Storage",
        description: "Persist todos across browser sessions"
      },
      {
        title: "Responsive Design",
        description: "Works seamlessly on desktop and mobile devices"
      },
      {
        title: "Due Dates",
        description: "Add and manage due dates for todos"
      },
      {
        title: "Categories/Tags",
        description: "Organize todos with categories or tags"
      }
    ],
    
    bonusFeatures: [
      "Dark/Light theme toggle",
      "Drag and drop reordering",
      "Export todos to JSON/CSV",
      "Keyboard shortcuts",
      "Todo statistics dashboard"
    ],
    
    requirements: {
      technical: [
        "Use React 18+ with functional components and hooks",
        "Implement responsive design using CSS Grid/Flexbox or CSS framework",
        "Use localStorage for data persistence",
        "Include proper error handling and validation",
        "Write clean, well-commented code",
        "Use semantic HTML and ensure accessibility"
      ],
      functional: [
        "Users can add new todos with title and optional description",
        "Users can mark todos as complete/incomplete",
        "Users can edit existing todos",
        "Users can delete todos with confirmation",
        "Users can filter todos (All, Active, Completed)",
        "Users can search todos by text",
        "Application persists data across browser sessions"
      ],
      submission: [
        "Create a public GitHub repository",
        "Include a comprehensive README.md with setup instructions",
        "Add screenshots or demo video to repository",
        "Include a live demo link (GitHub Pages, Netlify, or Vercel)",
        "Ensure all code is properly commented",
        "Include a brief reflection on challenges faced and solutions"
      ]
    },
    
    timeline: [
      {
        phase: "Polish & Deploy",
        duration: "Week 5-6",
        description: "Add admin features, testing, and deployment",
        tasks: [
          "Build admin panel for product/order management",
          "Add comprehensive error handling",
          "Test all functionality thoroughly",
          "Deploy frontend and backend applications"
        ]
      }
    ],
    
    gradingCriteria: [
      {
        category: "Backend Development",
        weight: 35,
        description: "API design, database integration, and server functionality",
        points: [
          "RESTful API design and implementation",
          "Proper database schema and relationships",
          "Secure authentication and authorization",
          "Error handling and validation"
        ]
      },
      {
        category: "Frontend Development",
        weight: 30,
        description: "React application quality and user experience",
        points: [
          "Component architecture and reusability",
          "State management and data flow",
          "Responsive and intuitive UI",
          "Integration with backend APIs"
        ]
      },
      {
        category: "Integration & Functionality",
        weight: 25,
        description: "Full-stack integration and feature completeness",
        points: [
          "Payment processing works correctly",
          "All user flows function properly",
          "Admin panel fully functional",
          "Data consistency across app"
        ]
      },
      {
        category: "Documentation & Deployment",
        weight: 10,
        description: "Project documentation and successful deployment",
        points: [
          "Clear setup and installation guides",
          "API documentation",
          "Successful deployment of both frontend and backend",
          "Demo credentials and usage instructions"
        ]
      }
    ],
    
    resources: {
      starterFiles: {
        name: "ecommerce-starter-pack.zip",
        size: "5.7 MB",
        url: "/downloads/ecommerce-starter-pack.zip"
      },
      documentation: [
        {
          title: "Node.js & Express Guide",
          description: "Building RESTful APIs with Node.js and Express",
          url: "https://expressjs.com/en/guide/routing.html"
        },
        {
          title: "MongoDB Documentation",
          description: "Database operations and Mongoose ODM",
          url: "https://mongoosejs.com/docs/"
        },
        {
          title: "Stripe Payment Integration",
          description: "Complete guide to integrating Stripe payments",
          url: "https://stripe.com/docs/payments"
        },
        {
          title: "JWT Authentication",
          description: "Implementing secure authentication with JSON Web Tokens",
          url: "https://jwt.io/introduction"
        }
      ],
      tutorials: [
        {
          title: "Full-Stack React & Node.js",
          description: "Complete tutorial series for building full-stack applications",
          duration: "2 hours",
          url: "/tutorials/fullstack-react-node"
        },
        {
          title: "MongoDB & Mongoose Crash Course",
          description: "Learn database design and operations",
          duration: "90 min",
          url: "/tutorials/mongodb-mongoose"
        },
        {
          title: "Stripe Payment Integration",
          description: "Step-by-step payment processing implementation",
          duration: "75 min",
          url: "/tutorials/stripe-integration"
        }
      ],
      examples: [
        {
          name: "Mini E-commerce Demo",
          description: "Simplified e-commerce app showing core concepts",
          demoUrl: "https://mini-ecommerce-demo.netlify.app",
          githubUrl: "https://github.com/example/mini-ecommerce"
        },
        {
          name: "Full-featured Store",
          description: "Complete e-commerce solution with all advanced features",
          demoUrl: "https://fullstack-store-demo.netlify.app",
          githubUrl: "https://github.com/example/fullstack-store"
        }
      ]
    }
  },

  "portfolio-website": {
    id: 3,
    slug: "portfolio-website",
    title: "Personal Portfolio Website",
    description: "Design and develop a professional portfolio website to showcase your skills, projects, and experience. Focus on modern design principles, performance optimization, and SEO.",
    difficulty: "Intermediate",
    estimatedTime: "20-25 hours",
    points: 150,
    submissions: 892,
    rating: 4.9,
    dueDate: "Sep 30, 2025",
    technologies: ["HTML5", "CSS3", "JavaScript", "SCSS", "Git"],
    skills: ["Web Design", "Performance Optimization", "SEO", "Responsive Design", "Version Control"],
    
    objectives: [
      "Create a professional online presence",
      "Master advanced CSS techniques and animations",
      "Learn performance optimization best practices",
      "Understand SEO fundamentals",
      "Practice modern web development workflow"
    ],
    
    features: [
      {
        title: "Hero Section",
        description: "Compelling introduction with call-to-action"
      },
      {
        title: "About Me",
        description: "Professional summary and personal story"
      },
      {
        title: "Skills Showcase",
        description: "Technical and soft skills with visual indicators"
      },
      {
        title: "Project Gallery",
        description: "Showcase of your best work with details"
      },
      {
        title: "Contact Form",
        description: "Functional contact form with validation"
      },
      {
        title: "Blog Section",
        description: "Optional blog to share insights and experiences"
      }
    ],
    
    bonusFeatures: [
      "Dark mode toggle",
      "Smooth scroll animations",
      "Interactive skill charts",
      "Testimonials carousel",
      "Resume download functionality"
    ],
    
    requirements: {
      technical: [
        "Semantic HTML5 structure",
        "Modern CSS with Grid and Flexbox",
        "Vanilla JavaScript for interactivity",
        "Mobile-first responsive design",
        "Optimized images and assets",
        "SEO meta tags and structured data"
      ],
      functional: [
        "Fast loading times (< 3 seconds)",
        "Works perfectly on all device sizes",
        "Accessible to users with disabilities",
        "Contact form sends emails successfully",
        "Cross-browser compatibility",
        "Search engine optimized"
      ],
      submission: [
        "GitHub repository with clean commit history",
        "Live website deployed and accessible",
        "README with design decisions and features",
        "Performance audit results included",
        "Screenshots of responsive design",
        "Brief explanation of SEO strategies used"
      ]
    },
    
    timeline: [
      {
        phase: "Design & Planning",
        duration: "Day 1-3",
        description: "Plan layout, gather content, and create design mockups",
        tasks: [
          "Research portfolio design inspiration",
          "Create wireframes and mockups",
          "Gather and prepare content (text, images)",
          "Choose color scheme and typography"
        ]
      },
      {
        phase: "HTML Structure",
        duration: "Day 4-6",
        description: "Build semantic HTML foundation",
        tasks: [
          "Create HTML structure for all sections",
          "Add semantic markup and accessibility features",
          "Optimize images and prepare assets",
          "Set up basic CSS framework"
        ]
      },
      {
        phase: "Styling & Responsiveness",
        duration: "Day 7-14",
        description: "Implement CSS styles and responsive design",
        tasks: [
          "Style all components and sections",
          "Implement responsive design patterns",
          "Add CSS animations and transitions",
          "Test across different devices"
        ]
      },
      {
        phase: "JavaScript & Deployment",
        duration: "Day 15-20",
        description: "Add interactivity and deploy the website",
        tasks: [
          "Implement JavaScript functionality",
          "Add form validation and submission",
          "Optimize performance and SEO",
          "Deploy and test live website"
        ]
      }
    ],
    
    gradingCriteria: [
      {
        category: "Design & Aesthetics",
        weight: 30,
        description: "Visual appeal and professional presentation",
        points: [
          "Modern and professional design",
          "Consistent visual hierarchy",
          "Effective use of color and typography",
          "High-quality images and graphics"
        ]
      },
      {
        category: "Technical Implementation",
        weight: 30,
        description: "Code quality and technical execution",
        points: [
          "Clean, semantic HTML structure",
          "Well-organized CSS architecture",
          "Smooth JavaScript interactions",
          "Performance optimization"
        ]
      },
      {
        category: "Responsiveness & Accessibility",
        weight: 25,
        description: "Cross-device compatibility and inclusiveness",
        points: [
          "Perfect mobile responsiveness",
          "Accessibility best practices",
          "Cross-browser compatibility",
          "Fast loading on all devices"
        ]
      },
      {
        category: "Content & SEO",
        weight: 15,
        description: "Content quality and search engine optimization",
        points: [
          "Compelling and professional content",
          "Proper SEO meta tags",
          "Structured data markup",
          "Social media integration"
        ]
      }
    ],
    
    resources: {
      starterFiles: {
        name: "portfolio-template.zip",
        size: "1.8 MB",
        url: "/downloads/portfolio-template.zip"
      },
      documentation: [
        {
          title: "MDN HTML Reference",
          description: "Complete HTML element and attribute reference",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML"
        },
        {
          title: "CSS-Tricks Guides",
          description: "Modern CSS techniques and best practices",
          url: "https://css-tricks.com"
        },
        {
          title: "Google PageSpeed Insights",
          description: "Tool for analyzing and optimizing website performance",
          url: "https://pagespeed.web.dev"
        },
        {
          title: "Web Accessibility Guidelines",
          description: "WCAG guidelines for accessible web development",
          url: "https://www.w3.org/WAI/WCAG21/quickref/"
        }
      ],
      tutorials: [
        {
          title: "Modern CSS Layout Techniques",
          description: "Master CSS Grid, Flexbox, and responsive design",
          duration: "60 min",
          url: "/tutorials/css-layout"
        },
        {
          title: "JavaScript DOM Manipulation",
          description: "Interactive web elements and smooth animations",
          duration: "45 min",
          url: "/tutorials/dom-manipulation"
        },
        {
          title: "SEO for Developers",
          description: "Technical SEO implementation and best practices",
          duration: "35 min",
          url: "/tutorials/developer-seo"
        }
      ],
      examples: [
        {
          name: "Creative Developer Portfolio",
          description: "Portfolio with stunning animations and interactions",
          demoUrl: "https://creative-portfolio-demo.netlify.app",
          githubUrl: "https://github.com/example/creative-portfolio"
        },
        {
          name: "Clean Professional Portfolio",
          description: "Minimalist portfolio focusing on content and readability",
          demoUrl: "https://clean-portfolio-demo.netlify.app",
          githubUrl: "https://github.com/example/clean-portfolio"
        }
      ]
    }
  }
};

// Helper function to get project by slug
export const getProjectBySlug = (slug) => {
  return projectsData[slug] || null;
};

// Helper function to get all projects
export const getAllProjects = () => {
  return Object.values(projectsData);
};

// Helper function to get projects by difficulty
export const getProjectsByDifficulty = (difficulty) => {
  return Object.values(projectsData).filter(project => 
    project.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
}