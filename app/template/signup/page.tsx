"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Import thư viện animation

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<{  email?: string; password?: string; confirmPassword?: string; agree?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newError: {  email?: string; password?: string; confirmPassword?: string; agree?: string } = {};

    if (!email) {
      newError.email = "⚠ Email is required";
    }
    if (password.length < 6) {
      newError.password = "⚠ Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newError.confirmPassword = "⚠ Passwords do not match";
    }
    if (!agree) {
      newError.agree = "⚠ You must read and agree to the terms";
    }

    setError(newError);

    if (Object.keys(newError).length === 0) {
      console.log("Signed Up:", { username, email, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}>

      {/* Container chính với hiệu ứng scale */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-md mx-4"
      >
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        {/* Form đăng ký */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          animate={Object.keys(error).length > 0 ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.2 }}
        >         

          {/* Input Email */}
          <motion.div className="relative" whileFocus={{ scale: 1.05 }}>
            <label className="block mb-1 font-medium text-gray-700">Email</label>
            <motion.input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.05 }}
              className={`w-full rounded-md border border-gray-400 px-4 py-2 outline-none text-lg font-semibold bg-white/90 transition-all duration-300 text-gray-900
                ${error.email ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"} 
                focus:ring-2 focus:shadow-lg placeholder:text-gray-500 placeholder:text-sm`}
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </motion.div>

          {/* Input Password */}
          <motion.div className="relative mt-4" whileFocus={{ scale: 1.05 }}>
            <label className="block mb-1 font-medium text-gray-700">Password</label>
            <motion.input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              whileFocus={{ scale: 1.05 }}
              className={`w-full rounded-md border border-gray-400 px-4 py-2 outline-none text-lg font-semibold bg-white/90 transition-all duration-300 text-gray-900
                ${error.password ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"} 
                focus:ring-2 focus:shadow-lg placeholder:text-gray-500 placeholder:text-sm`}
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </motion.div>

          {/* Input Confirm Password */}
          <motion.div className="relative mt-4" whileFocus={{ scale: 1.05 }}>
            <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
            <motion.input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              whileFocus={{ scale: 1.05 }}
              className={`w-full rounded-md border border-gray-400 px-4 py-2 outline-none text-lg font-semibold bg-white/90 transition-all duration-300 text-gray-900
                ${error.confirmPassword ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"} 
                focus:ring-2 focus:shadow-lg placeholder:text-gray-500 placeholder:text-sm`}
            />
            {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
          </motion.div>

          <motion.div className="relative mt-4" whileFocus={{ scale: 1.05 }}>
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-gray-700 text-sm cursor-pointer">
              I agree to
              <a
                href="#"
                className="relative text-blue-600 font-medium transition-all duration-300 ml-1
        before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
        before:bg-blue-600 before:transition-all before:duration-300 
        hover:text-blue-700 hover:before:w-full hover:before:left-0 
        hover:scale-105"
              >
                Event Mate's terms
              </a>
            </label>
            {error.agree && <p className="text-red-500 text-sm mt-1">{error.agree}</p>}
          </motion.div>

          {/* Nút Sign Up */}
          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition-all duration-300
                      hover:bg-blue-700 hover:shadow-lg hover:scale-105"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.3)" }}
          >
            Sign Up
          </motion.button>
        </motion.form>

        {/* Điều hướng đến Login */}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?
            <a
              href="#"
              className="relative text-blue-600 font-medium transition-all duration-300 ml-1
                before:absolute before:-bottom-1 before:left-1/2 before:w-0 before:h-[2px] 
                before:bg-blue-600 before:transition-all before:duration-300 
                hover:text-blue-700 hover:before:w-full hover:before:left-0 
                hover:scale-105"
            >
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
