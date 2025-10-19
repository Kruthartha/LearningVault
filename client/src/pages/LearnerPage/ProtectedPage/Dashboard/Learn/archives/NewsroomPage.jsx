import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Timer } from "iconoir-react";

// --- Mock Data ---
const ARTICLES = [
  {
    id: 1,
    category: "Science & Tech",
    title: "Researchers Discover Pathway to Regenerate Neural Tissue",
    summary:
      "A breakthrough at the Stem Cell Institute could pave the way for new treatments.",
    imageUrl:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=3540&auto.format&fit=crop",
    author: "By John Doe",
    date: "Oct 16, 2025",
    readTime: 6,
  },
  {
    id: 2,
    category: "Arts & Humanities",
    title: "The Lost Language of Ancient Civilizations Deciphered",
    summary:
      "Linguistics professor Althea Rossi and her team have successfully translated a script that has puzzled historians for over a century.",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=3540&auto.format&fit=crop",
    author: "By Jane Smith",
    date: "Oct 15, 2025",
    readTime: 8,
    editorsPick: true,
  },
  {
    id: 3,
    category: "Health & Medicine",
    title: "New Study Links Gut Microbiome to Mental Well-being",
    summary:
      "An interdisciplinary study reveals a significant correlation between gut health and mood regulation.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=3540&auto.format&fit=crop",
    author: "By Emily Chen",
    date: "Oct 15, 2025",
    readTime: 5,
  },
  {
    id: 4,
    category: "Campus & Community",
    title: "University Announces Plan for Carbon Neutrality by 2040",
    summary:
      "The comprehensive plan includes investments in renewable energy and a campus-wide sustainability initiative.",
    imageUrl:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=3540&auto.format&fit=crop",
    author: "By David Lee",
    date: "Oct 14, 2025",
    readTime: 7,
  },
  {
    id: 5,
    category: "National Affairs",
    title: "Professor analyzes the future of democratic institutions",
    summary:
      "In her new book, political scientist Elena Vance explores the challenges and resilience of democracies in the 21st century.",
    imageUrl:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790774?q=80&w=3540&auto.format&fit=crop",
    author: "By Michael Brown",
    date: "Oct 13, 2025",
    readTime: 9,
    editorsPick: true,
  },
  {
    id: 6,
    category: "Science & Tech",
    title: "Quantum Computing Achieves New Milestone",
    summary:
      "A new quantum processor has solved a complex problem in minutes that would take a supercomputer years.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3540&auto.format&fit=crop",
    author: "By Alex Ray",
    date: "Oct 12, 2025",
    readTime: 5,
    editorsPick: true,
  },
];
const CATEGORIES = [
  "All",
  "Science & Tech",
  "Arts & Humanities",
  "Health & Medicine",
  "Campus & Community",
  "National Affairs",
];

// --- Custom Hooks ---
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Framer Motion Variants ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// --- Sub-Components ---

const ArticleCard = ({ article, horizontal = false }) => (
  <motion.div
    layout
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    exit="exit"
    viewport={{ once: true, amount: 0.3 }}
    className={`group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-shadow duration-300 hover:shadow-lg dark:hover:shadow-black/30 ${
      horizontal ? "w-80 flex-shrink-0" : ""
    }`}
  >
    <div className="relative">
      <img
        src={article.imageUrl}
        alt={article.title}
        className={`w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
          horizontal ? "h-40" : "h-52"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-0 right-0 p-3">
        <div className="flex items-center gap-1.5 text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
          <Timer className="w-3 h-3" />
          <span>{article.readTime} min read</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-white mb-1">
          {article.category}
        </p>
        <h3 className="font-serif text-lg font-bold text-white leading-tight line-clamp-2">
          {article.title}
        </h3>
      </div>
    </div>
    <div className="p-4 bg-white dark:bg-zinc-900">
      <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 line-clamp-3">
        {article.summary}
      </p>
      <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
        Read Article
        <ArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  </motion.div>
);

const HorizontalCarousel = ({ articles, title }) => (
  <motion.section
    variants={itemVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-6 border-b-2 border-blue-600 pb-2">
      {title}
    </h2>
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} horizontal />
      ))}
    </div>
  </motion.section>
);

// --- Main Page Component ---

const NewsroomPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const articlesToDisplay = useMemo(() => {
    return ARTICLES.filter((article) => {
      const categoryMatch =
        activeCategory === "All" || article.category === activeCategory;
      const searchMatch =
        debouncedSearchTerm === "" ||
        article.title
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        article.summary
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, debouncedSearchTerm]);

  const editorPicks = ARTICLES.filter((a) => a.editorsPick);
  const latestArticles = articlesToDisplay.filter((a) => !a.editorsPick);

  return (
    <div className="font-sans w-full bg-gray-50 dark:bg-[#0d1117] p-4 sm:p-6 rounded-lg">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-zinc-100">
            The Gazette
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-zinc-400">
            The latest announcements, research, and stories from our community.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={itemVariants}
          className="sticky top-[70px] z-20 bg-gray-50/80 dark:bg-[#0d1117]/80 backdrop-blur-lg py-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex justify-center flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    activeCategory === category
                      ? "text-white"
                      : "text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {activeCategory === category && (
                    <motion.div
                      layoutId="active-filter-pill-news"
                      className="absolute inset-0 bg-blue-600 rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="space-y-16">
          {/* Editor's Picks Carousel */}
          {editorPicks.length > 0 &&
            activeCategory === "All" &&
            debouncedSearchTerm === "" && (
              <HorizontalCarousel
                articles={editorPicks}
                title="Editor's Picks"
              />
            )}

          {/* Latest Articles Grid */}
          <motion.section
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <h2 className="font-serif text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-6 border-b-2 border-blue-600 pb-2">
              {activeCategory === "All" ? "Latest Stories" : activeCategory}
            </h2>
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {latestArticles.length > 0 ? (
                  latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))
                ) : (
                  <motion.div
                    className="col-span-full text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500 dark:text-zinc-500">
                      No articles found. Try adjusting your search or filter.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export default NewsroomPage;
