"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-md mx-4"
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Terms and Conditions
        </h2>

        <div className="text-gray-700 text-sm space-y-4 max-h-60 overflow-y-auto p-4 border border-gray-300 rounded-md bg-white">
          <p>By using this service, you agree to the following terms...</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla at nisl nec...</p>
          <p>We reserve the right to modify these terms at any time...</p>
          <p>More terms and conditions details here...</p>
        </div>
      </motion.div>
    </div>
  );
}
