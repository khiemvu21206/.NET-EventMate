"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // Import thư viện animation

export default function ConfirmOtpPage() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<{ otp?: string }>({});
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newError: { otp?: string } = {};

    if (!otp || otp.length !== 6 || !/^[0-9]+$/.test(otp)) {
      newError.otp = "⚠ OTP must be a 6-digit number";
    }

    setError(newError);

    if (Object.keys(newError).length > 0) {
      setShake(true);
      setTimeout(() => setShake(false), 500); // Dừng hiệu ứng sau 0.5s
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/bg-01.jpg')" }}>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl rounded-xl px-8 py-10 w-full max-w-md mx-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Enter OTP Code Sent To Your Email</h2>

        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <label className="block mb-1 font-medium text-gray-700">Enter OTP</label>
            <motion.input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              whileFocus={{ scale: 1.05 }}
              className={`w-full rounded-md border px-4 py-2 outline-none text-lg text-gray-900 bg-white/90 transition-all duration-300 
                ${error.otp ? "border-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-400"}`}
            />
            {error.otp && <p className="text-red-500 text-sm mt-1">{error.otp}</p>}
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition-all duration-300
                      hover:bg-blue-700 hover:shadow-lg hover:scale-105"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 255, 0.3)" }}
          >
            Confirm
          </motion.button>
        </motion.form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Remember password? {" "}
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
