// function QuizResult({ quiz, answers }) {

//   const correctCount = quiz.filter((q, i) =>
//     answers[i] === q.correctAnswer
//   ).length;

//   return (
//     <div>
//       <h2>Score: {correctCount} / {quiz.length}</h2>

//       {quiz.map((q, i) => (
//         <div key={i}>
//           <h3>{q.question}</h3>

//           {q.options.map((opt, idx) => {
//             const isCorrect = opt === q.correctAnswer;
//             const isSelected = answers[i] === opt;

//             return (
//               <div key={idx}>
//                 {opt}
//                 {isCorrect && " ✅"}
//                 {isSelected && !isCorrect && " ❌"}
//               </div>
//             );
//           })}

//           <p>{q.explanation}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default QuizResult;


function QuizResult({ quiz, answers }) {

const correctCount = quiz.filter((q, i) => {
  const correctOption =
    q.options[q.correctAnswer.charCodeAt(0) - 65];

  return answers[i] === correctOption;
}).length;

  return (
    <div className="p-4">

      <h2 className="text-lg font-semibold mb-4">
        Results
      </h2>

      <p className="mb-6">
        Score: {correctCount} / {quiz.length}
      </p>

      {quiz.map((q, i) => (
        <div key={i} className="p-4 border border-gray-700 rounded-lg mb-4">

          <p className="font-medium mb-2">
            {q.question}
          </p>

          {q.options.map((opt, idx) => {
            const correctOption =
              q.options[q.correctAnswer.charCodeAt(0) - 65];

            const isCorrect = opt === correctOption;
            const isSelected = answers[i] === opt;

            return (
              <div
                key={idx}
                className={`p-2 rounded mb-1
                  ${isCorrect ? "bg-emerald-600" : ""}
                  ${isSelected && !isCorrect ? "bg-red-500" : ""}
                `}
              >
                {opt}
              </div>
            );
          })}

          <p className="text-sm mt-2 text-gray-400">
            {q.explanation}
          </p>

        </div>
      ))}

    </div>
  );
}

export default QuizResult;