function QuizCard({ question, options }) {
  return (
    <div className="p-4 border border-gray-700 rounded-lg">
      <p className="font-medium">{question}</p>

      <ul className="mt-2 text-sm text-gray-300">
        {options.map((opt, i) => (
          <li key={i}>{opt}</li>
        ))}
      </ul>
    </div>
  );
}

export default QuizCard;