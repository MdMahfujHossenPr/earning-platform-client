import { FaLinkedin, FaFacebook, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer bg-gray-900">
      <div className="footer-logo">MicroTasker</div>
      <div className="footer-social">
        <a
          href="https://linkedin.com/in/your-profile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin size={24} />
        </a>
        <a
          href="https://facebook.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://github.com/your-profile"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithub size={24} />
        </a>
      </div>
      <div className="footer-copy">
        &copy; {new Date().getFullYear()} MicroTasker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
