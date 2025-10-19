const WelcomeHeader = ({ user }) => (
  <div>
    <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-slate-100">
      Hello,{" "}
      <span className="bg-gradient-to-bl from-blue-400 via-blue-600 to-blue-300 bg-clip-text text-transparent">
        {user.first_name}
      </span>
      .
    </h1>
    <p className="mt-2 text-lg font-light text-slate-500 dark:text-slate-400">
      Let's continue your learning journey and build something great today.
    </p>
  </div>
);

export default WelcomeHeader;