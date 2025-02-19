// src/components/Points.jsx
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Points = ({ isOpen, onClose, type }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 500); // Wait for animation before closing
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  const isCorrect = type === "correct";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center  bg-opacity-30 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className={`bg-white p-6 rounded-lg shadow-lg text-center  text-black border-2 w-80 md:w-96 ${
              isCorrect ? "border-green-500" : "border-red-500"
            }`}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } }}
            exit={{ y: "-100vh", opacity: 0, transition: { duration: 0.5 } }}
          >
            {isCorrect ? (
              <FaCheckCircle className="text-green-500 w-12 h-12 mx-auto mb-2" />
            ) : (
              <FaTimesCircle className="text-red-500 w-12 h-12 mx-auto mb-2" />
            )}
            <h2 className={`text-lg font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct Answer!" : "Wrong Answer!"}
            </h2>
            <p className="text-gray-700 mt-2">
              {isCorrect ? "You scored +4 points 🎉" : "You lost -1 point 😢"}
            </p>
            <button
              onClick={() => setVisible(false)}
              className={`mt-4 px-4 py-2 rounded text-white w-full ${
                isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Points;
