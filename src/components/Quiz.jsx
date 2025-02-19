// src/components/Quiz.jsx
import React, { useState, useEffect } from "react";
import { FaLightbulb, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Points from "./Points";
import Results from "./Result";
import quizDataJSON from "../components/question.json";
import { openDB } from "idb"; // For IndexedDB

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);

  // Initialize quiz data
  useEffect(() => {
    setQuizData(quizDataJSON);
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!isSubmitted && quizData.length) {
      setTimeLeft(30); // Reset timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Clear timer on question change or unmount
    }
  }, [currentIndex, isSubmitted, quizData]);

  const currentQuestion = quizData[currentIndex];

  const handleOptionClick = (option) => {
    if (!isSubmitted) setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      toast.error("Time's up or no option selected. Moving to the next question.");
    }

    const isCorrect = selectedOption === currentQuestion.answer;
    setUserAnswers((prev) => [
      ...prev,
      { question: currentQuestion.question, isCorrect },
    ]);
    setModalType(isCorrect ? "correct" : "wrong");
    setIsModalOpen(true);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsModalOpen(false);
      setModalType("");
    }
  };

  // Save quiz history to IndexedDB
  const saveQuizHistory = async () => {
    const db = await openDB("QuizHistoryDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("history")) {
          db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
        }
      },
    });

    const correctAnswers = userAnswers.filter((ans) => ans.isCorrect).length;
    const historyEntry = {
      date: new Date().toLocaleString(),
      score: correctAnswers,
      totalQuestions: quizData.length,
    };

    await db.add("history", historyEntry);
    // toast.success("Quiz history saved! 🎉");
  };

  // Show results and save history when quiz ends
  if (userAnswers.length === quizData.length) {
    saveQuizHistory();
    return <Results answers={userAnswers} totalQuestions={quizData.length} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative">

      {/* 🚀 Timer at top-left */}
      <div className="fixed top-4 left-4 bg-gray-800 text-white rounded-full px-4 py-2 shadow-lg font-bold text-lg">
        ⏳ {timeLeft}s
      </div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center mb-6"
      >
        <FaLightbulb className="w-8 h-8 text-yellow-300 mr-2" />
        <h1 className="text-3xl font-extrabold text-center">Quiz Challenge</h1>
      </motion.div>

      {/* Quiz Box */}
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">
            {currentIndex + 1}. {currentQuestion.question}
          </h3>
        </div>

        {/* Question Options */}
        {currentQuestion.type === "multiple-choice" ? (
          <ul className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <motion.li
                key={index}
                onClick={() => handleOptionClick(option)}
                whileTap={{ scale: 0.95 }}
                className={`border p-3 rounded cursor-pointer font-medium transition-all ${
                  selectedOption === option
                    ? isSubmitted
                      ? option === currentQuestion.answer
                        ? "bg-green-500 text-white border-green-700"
                        : "bg-red-500 text-white border-red-700"
                      : "bg-gray-800 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {index + 1}. {option}
              </motion.li>
            ))}
          </ul>
        ) : (
          <input
            type="number"
            className="w-full p-3 border rounded mt-4"
            placeholder="Enter your answer"
            value={selectedOption || ""}
            onChange={(e) => handleOptionClick(e.target.value)}
            disabled={isSubmitted}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
          >
            <FaArrowLeft /> Previous
          </button>

          {!isSubmitted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit Answer
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleNext}
              disabled={currentIndex === quizData.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Next <FaArrowRight />
            </motion.button>
          )}
        </div>
      </div>

      {/* Result Modal */}
      <Points isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} />
    </div>
  );
};

export default Quiz;
