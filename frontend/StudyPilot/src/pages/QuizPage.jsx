import { useState } from "react";
import QuizStart from "../components/quiz/QuizStart";
import QuizQuestion from "../components/quiz/QuizQuestion";
import QuizResult from "../components/quiz/QuizResult";

function QuizPage({ doc }) {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState("start");

  return (
    <>
      {step === "start" && (
        <QuizStart
          doc={doc}
          setQuiz={setQuiz}
          setStep={setStep}
        />
      )}

      {step === "quiz" && (
        <QuizQuestion
          quiz={quiz}
          answers={answers}
          setAnswers={setAnswers}
          setStep={setStep}
        />
      )}

      {step === "result" && (
        <QuizResult
          quiz={quiz}
          answers={answers}
        />
      )}
    </>
  );
}

export default QuizPage;