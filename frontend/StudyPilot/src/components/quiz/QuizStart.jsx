import { useState } from "react";

function QuizStart({ doc, setQuiz, setStep }) {
  const [num, setNum] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/ai/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: doc.content,
        numQuestions: Number(num),
      }),
    });

    const data = await res.json();

    setQuiz(data.quiz);
    setStep("quiz");
    setLoading(false);
  };

  return (
    <div className="border-2 border-gray-700 p-6 rounded-lg">

      <h2 className="text-lg font-semibold mb-4">
        Generate Quiz
      </h2>

      <select
        value={num}
        onChange={(e) => setNum(e.target.value)}
        className="p-2 bg-gray-800 rounded mb-4"
      >
        <option value={5}>5 Questions</option>
        <option value={10}>10 Questions</option>
      </select>

      <br />

      <button
        onClick={handleGenerate}
        className="px-4 py-2 gradient-primary rounded"
      >
        Generate Quiz
      </button>

      {loading && <p className="mt-4">Generating...</p>}
    </div>
  );
}

export default QuizStart;