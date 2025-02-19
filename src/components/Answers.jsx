// src/components/QuizSolution.jsx
import { FaCheckCircle } from "react-icons/fa";
import quizData from "../components/question.json"; // Import quiz data from local JSON

const QuizSolution = () => {
  if (!quizData || quizData.length === 0) {
    return <p className="text-center text-red-500">No questions found.</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Solutions
      </h1>

      {quizData.map((question, index) => (
        <div key={index} className="mt-6 border-b pb-4">
          <h3 className="text-gray-800 font-medium text-lg">
            {index + 1}. {question.question}
          </h3>

          <h4 className="mt-4 text-green-600 font-semibold">Correct Answer:</h4>
          <div className="mt-2 p-3 border-l-4 border-green-500 bg-green-100 flex items-center gap-2 rounded">
            <FaCheckCircle className="text-green-600" />
            <p className="text-green-700 font-medium">{question.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizSolution;
