
function QuizQuestion({ quiz, answers, setAnswers, setStep }) {

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  return (
    <div className="space-y-6 p-4">

      {quiz.map((q, i) => (
        <div key={i} className="p-4 border border-gray-700 rounded-lg">

          <p className="font-medium mb-2">
            {i + 1}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(i, opt)}
                className={`block w-full text-left p-2 rounded border
                  ${answers[i] === opt
                    ? "border-[var(--primary)] bg-gray-800"
                    : "border-gray-700"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

        </div>
      ))}

      <button
        onClick={() => setStep("result")}
        className="px-6 py-2 gradient-primary rounded"
      >
        Submit Quiz
      </button>

    </div>
  );
}

export default QuizQuestion;