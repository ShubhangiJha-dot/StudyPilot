import { useState } from "react";

function QuizStart({ doc, setQuiz, setStep }) {
  const [num, setNum] = useState(5);

  const handleGenerate = async () => {
    const res = await fetch("http://localhost:5000/api/ai/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: doc.content,
        numQuestions: num,
      }),
    });

    const data = await res.json();
    setQuiz(data.quiz);
    setStep("quiz");
  };

  return (
    <div>
      <h2>Start Quiz</h2>

      <select value={num} onChange={(e) => setNum(e.target.value)}>
        <option value={5}>5 Questions</option>
        <option value={10}>10 Questions</option>
      </select>

      <button onClick={handleGenerate}>Generate Quiz</button>
    </div>
  );
}

export default QuizStart;