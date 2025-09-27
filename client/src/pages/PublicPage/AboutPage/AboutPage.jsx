import { useState, useEffect } from "react";
import NavBar from "../Layouts/NavBar";
import Footer from "../Layouts/Footer";

const NavLink = ({ href, text }) => (
  <a href={href} className="hover:text-gray-900 transition-colors duration-200">
    {text}
  </a>
);

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-20 bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative py-32 bg-gradient-to-b from-gray-50/30 to-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center px-4 py-1.5 bg-black/5 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 mb-8 border border-gray-100">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
            Our Story
          </div>

          <h1 className="text-5xl md:text-7xl font-extralight text-black mb-8 tracking-tighter leading-none">
            Building the future of
            <br />
            <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
              practical education
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 font-light max-w-4xl mx-auto leading-relaxed">
            We believe that true learning happens when you build, create, and
            solve real problems. Our mission is to bridge the gap between
            traditional education and what the industry actually needs.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-32">
        <div className="max-w-5xl mx-auto px-6">
          <div className="">
            <div>
              <h2 className="text-4xl md:text-5xl font-extralight text-black mb-8 tracking-tight">
                Why we exist
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                For a long time, we saw the same story play out. Students poured
                years into classrooms, collected grades, and walked away with
                degrees, yet when it was time to step into the real world, many
                felt unprepared. The gap between knowing and doing was still
                wide.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We asked ourselves:{" "}
                <i>
                  Why does education, which should empower, so often leave
                  people stuck?
                </i>
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                That question sparked years of research, exploration, and
                testing. We studied how people learn best, why knowledge fades
                so quickly, and what it really takes to turn theory into lasting
                skill.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                From that journey, <b>LearningVault</b> was born. Not as another
                course platform, but as a place where learning feels alive,
                where every concept is applied, every project has purpose, and
                every hour spent moves you closer to real confidence.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We exist because education should not just inform you. It should
                transform you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div className="py-32 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight text-black mb-8 tracking-tight">
              How we're different
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              We've reimagined education from the ground up, focusing on
              outcomes that matter to both students and employers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Build First, Theory Later",
                description:
                  "Start with hands-on projects and learn concepts as you need them. This mirrors how real work actually happens.",
                icon: "",
              },
              {
                title: "Industry Partnership",
                description:
                  "Our curriculum is designed with input from hiring managers at top companies to ensure relevance.",
                icon: "",
              },
              {
                title: "Continuous Adaptation",
                description:
                  "We update our content monthly based on industry trends and student feedback to stay current.",
                icon: "",
              },
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 h-full">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-medium text-black mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      {/* <div className="py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight text-black mb-8 tracking-tight">
              Meet the team
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Educators, engineers, and industry veterans united by one goal: making practical education accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                name: "Alex Chen",
                role: "Founder & CEO",
                bio: "Former Google engineer turned educator. Believes coding bootcamps got something right, but universities got something wrong.",
                image: "👨‍💻"
              },
              {
                name: "Sarah Johnson",
                role: "Head of Curriculum",
                bio: "15 years in tech education. Designed learning programs for Microsoft and Amazon before joining us.",
                image: "👩‍🏫"
              },
              {
                name: "Marcus Rodriguez",
                role: "Industry Relations",
                bio: "Former startup founder and VC. Connects our students with real opportunities and mentors.",
                image: "👨‍💼"
              }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl font-medium text-black mb-2">{member.name}</h3>
                <div className="text-blue-600 font-medium mb-4">{member.role}</div>
                <p className="text-gray-600 leading-relaxed text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Values Section */}
      <div className="py-32 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extralight mb-8">
              Our values
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These principles guide everything we do, from curriculum design to
              student support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {[
              {
                title: "Practical over Theoretical",
                description:
                  "Every concept must have immediate application. If you can't use it to build something, we don't teach it.",
              },
              {
                title: "Quality over Quantity",
                description:
                  "We'd rather you master 10 essential skills deeply than know 100 things superficially.",
              },
              {
                title: "Community over Competition",
                description:
                  "Learning happens best when students help each other. We foster collaboration, not competition.",
              },
              {
                title: "Progress over Perfection",
                description:
                  "Ship early, iterate fast, learn from mistakes. This is how real products get built.",
              },
            ].map((value, index) => (
              <div key={index} className="group">
                <h3 className="text-2xl font-light mb-6 group-hover:text-blue-400 transition-colors">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extralight text-black mb-8 tracking-tight">
            Ready to learn
            <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
              {" "}
              by building
            </span>
            ?
          </h2>

          <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Join thousands of students who are turning their ideas into reality
            through hands-on, project-based learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="#paths"
              className="px-6 py-3 border bg-slate-900 text-white font-semibold rounded-2xl shadow-lg hover:bg-slate-900 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
            >
              Start your Journey
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <NavBar />
      <AboutPage />
    </div>
  );
}

export default App;
