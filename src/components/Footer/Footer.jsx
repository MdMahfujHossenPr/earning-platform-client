import { FaLinkedin, FaFacebook, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 py-16 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-white">
            Micro<span className="text-blue-500">Tasker</span>
          </h1>
          <p className="text-gray-400">
            Your ultimate platform to complete micro-tasks and earn real money securely and efficiently. Trusted by thousands of users worldwide.
          </p>
          <div className="flex gap-4 mt-4">
            <FaLinkedin size={24} className="text-gray-400 hover:text-blue-400 transition" />
            <FaFacebook size={24} className="text-gray-400 hover:text-blue-500 transition" />
            <FaGithub size={24} className="text-gray-400 hover:text-white transition" />
          </div>
        </div>

        {/* Section 1 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Platform Features</h2>
          <ul className="space-y-2 text-gray-400">
            <li>Earn coins by completing micro-tasks</li>
            <li>Quick withdrawal system</li>
            <li>Top rated workers showcase</li>
            <li>Secure and reliable platform</li>
            <li>24/7 support</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Platform Insights</h2>
          <ul className="space-y-2 text-gray-400">
            <li>Trusted by thousands of users</li>
            <li>Regular updates and improvements</li>
            <li>Transparent earning and payment system</li>
            <li>Responsive and mobile-friendly design</li>
            <li>Automated notifications for tasks</li>
          </ul>
        </div>

        {/* Contact Info & Newsletter */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Contact Us</h2>
          <p className="flex items-center gap-2 text-gray-400"><FaEnvelope /> mdmahfujhossen.pr@gmail.com</p>
          <p className="flex items-center gap-2 text-gray-400"><FaPhone /> +880 1920470204</p>
          <p className="flex items-center gap-2 text-gray-400"><FaMapMarkerAlt /> Pabna, Bangladesh</p>

          <div className="mt-4">
            <h3 className="text-white font-semibold mb-2">Subscribe Newsletter</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none"
              />
              <button className="bg-blue-500 px-4 py-2 rounded-r-md hover:bg-blue-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MicroTasker. All rights reserved. Designed by Md Mahfuj Hossen.
      </div>
    </footer>
  );
};

export default Footer;
