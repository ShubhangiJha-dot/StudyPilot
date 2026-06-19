function QuizQuestion({ quiz, answers, setAnswers, setStep }) {

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  return (
    <div>
      {quiz.map((q, i) => (
        <div key={i}>
          <h3>{q.question}</h3>

          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(i, opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}

      <button onClick={() => setStep("result")}>
        Submit Quiz
      </button>
    </div>
  );
}

export default QuizQuestion;