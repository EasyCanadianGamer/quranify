
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black py-6 mt-8">
      <div className="container mx-auto px-4">
        {/* Flex container for the main footer content */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          {/* Left Section: Copyright and Links */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Quranify. All rights reserved.
            </p>
            <div className="mt-2 space-x-4">
              <a href="/about" className="text-sm hover:text-blue-700">
                About
              </a>
              <a href="/contact" className="text-sm hover:text-blue-700">
                Contact
              </a>
              <a href="/privacy" className="text-sm hover:text-blue-700">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* Middle Section: Attribution */}
          <div className="text-center">
            <p className="text-sm">
              Data provided by{' '}
              <a
                href="https://quranapi.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                QuranAPI
              </a>
              . Font by{' '}
              <a
                href="https://github.com/alif-type/amiri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                Amiri Quran
              </a>
              .
            </p>
          </div>

          {/* Right Section: Social Media Links */}
          <div className="flex space-x-4">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-700"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* App Version */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-400">
            Version 1.0.0 | Built with ❤️ using React, Vite, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;