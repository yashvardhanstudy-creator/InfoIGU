const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 sticky top-[100vh]">
      <div className="container mx-auto text-center">
        <p className="text-sm sm:text-base">&copy; {new Date().getFullYear()} Indira Gandhi University. All rights reserved.</p>
        <div className="mt-2 text-sm text-gray-400">
          <a href="/" className="hover:text-white mx-2 transition-colors">Home</a>
          <a href="#" className="hover:text-white mx-2 transition-colors">Privacy Policy</a>
          <a href="/contact" className="hover:text-white mx-2 transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;