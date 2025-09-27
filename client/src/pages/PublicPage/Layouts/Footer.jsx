import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-light text-white mb-4">
              Learning
              <span className="bg-gradient-to-bl from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent font-medium">
                Vault
              </span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Learn by building. Succeed by doing. Career-focused education for
              the modern world.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Student Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-medium mb-4">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get learning tips, career insights, and updates straight to your
              inbox.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-md bg-gray-800 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} LearningVault. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
