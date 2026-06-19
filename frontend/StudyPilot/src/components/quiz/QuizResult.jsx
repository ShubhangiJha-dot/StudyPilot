function QuizResult({ quiz, answers }) {

  const correctCount = quiz.filter((q, i) =>
    answers[i] === q.correctAnswer
  ).length;

  return (
    <div>
      <h2>Score: {correctCount} / {quiz.length}</h2>

      {quiz.map((q, i) => (
        <div key={i}>
          <h3>{q.question}</h3>

          {q.options.map((opt, idx) => {
            const isCorrect = opt === q.correctAnswer;
            const isSelected = answers[i] === opt;

            return (
              <div key={idx}>
                {opt}
                {isCorrect && " ✅"}
                {isSelected && !isCorrect && " ❌"}
              </div>
            );
          })}

          <p>{q.explanation}</p>
        </div>
      ))}
    </div>
  );
}

export default QuizResult;