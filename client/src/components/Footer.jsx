import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-yellow-900 text-yellow-100 py-2 text-center shadow-inner">
      &copy; {new Date().getFullYear()} Al Sageer Carpentry. All rights
      reserved.
    </footer>
  );
};

export default Footer;
