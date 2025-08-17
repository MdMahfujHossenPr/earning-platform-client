import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          Micro<span className="text-blue-500">Tasker</span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm flex-wrap justify-center">
          <a href="#about" className="hover:text-white transition-colors duration-200">About</a>
          <a href="#contact" className="hover:text-white transition-colors duration-200">Contact</a>
          <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
          <a href="#terms" className="hover:text-white transition-colors duration-200">Terms</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://www.facebook.com/md.mahfuj.hossen.39158"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://github.com/MdMahfujHossenPr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} MicroTasker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
