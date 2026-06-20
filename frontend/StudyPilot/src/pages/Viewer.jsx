import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InnerNav from "../components/InnerNav";
import { Sparkles, Lightbulb } from 'lucide-react';


function Viewer() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [summary, setSummary] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loadingExplain, setLoadingExplain] = useState(false);

const [quiz, setQuiz] = useState([]);
const [quizAnswers, setQuizAnswers] = useState({});
const [quizStep, setQuizStep] = useState("start"); // start | quiz | result
const [numQuestions, setNumQuestions] = useState(5);
const [loadingQuiz, setLoadingQuiz] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/pdf", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d.id == id);
        console.log("FOUND DOC:", found); 
        setDoc(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleGenerateAI = async () => {
    try {
      if (!doc?.content) {
        alert("Document text missing");
        return;
      }

      setLoadingAI(true);

      const res = await fetch("http://localhost:5000/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: doc.content }),
      });

      const data = await res.json();

      setSummary(data.summary);

    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleExplain = async () => {
  try {
    if (!topic.trim()) {
      alert("Enter a topic");
      return;
    }

    setLoadingExplain(true);

    const res = await fetch("http://localhost:5000/api/ai/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();

    setExplanation(data.explanation);

  } catch (err) {
    console.error(err);
  } finally {
    setLoadingExplain(false);
  }
};

const handleGenerateQuiz = async () => {
  try {
    if (!doc?.content) {
      alert("Document text not found");
      return;
    }

    setLoadingQuiz(true);

    const res = await fetch("http://localhost:5000/api/ai/quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        text: doc.content,
        numQuestions,
      }),
    });

    const data = await res.json();

    setQuiz(data.quiz);
    setQuizAnswers({});
    setQuizStep("quiz");
if (!data.quiz) {
  alert("Quiz generation failed");
  return;
}
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingQuiz(false);
  }
};

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-2 flex flex-col">
      <h1 className="text-xl mb-4">{doc.title}</h1>
<InnerNav 
  activeTab={activeTab} 
  setActiveTab={setActiveTab} 
/>

{activeTab === "content" && (
  <iframe
    src={`http://localhost:5000/uploads/${doc.filename}`}
    className="w-full h-[80vh] border rounded"
  />
)}

{activeTab === "ai" && (
  <div className="p-4">
    <div className="border-2 border-gray-700 p-6 rounded-lg mb-6">

    <div className="flex place-content-between ">

    <div className="flex gap-3 items-center">
      <div className="gradient-primary-vertical p-2 rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/30"><Sparkles size={24}/></div>
      <h2 className="text-lg font-semibold mb-2">AI Summary</h2> 
    </div>

    <button
      onClick={handleGenerateAI}
      className=" w-48 px-4 py-2 gradient-primary rounded text-lg font-semibold mx-8 cursor-pointer"
    >
      Generate Summary
    </button>

    </div>
    <div className="mt-4">
    {loadingAI && <p>Loading...</p>}
    </div>

    {summary && (
      <div className="bg-[var(--card)] p-4 rounded mt-6">
        <pre className="whitespace-pre-wrap">{summary}</pre>
      </div>
    )}
    </div>


<div className="border-2 border-gray-700 p-6 rounded-lg mb-6">
  <div className="flex justify-between items-center mb-4">
    <div className="flex items-center gap-3">
      <div className="gradient-primary-vertical p-2 rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/30">
        <Lightbulb size={24} />
      </div>
      <h2 className="text-lg font-semibold">Concept Explainer</h2>
    </div>

    <button
      onClick={handleExplain}
      className="w-48 px-4 py-2 gradient-primary rounded text-lg mx-8 font-semibold cursor-pointer"
    >
      Explain
    </button>

  </div>
  <input
    type="text"
    placeholder="Enter a concept (e.g. Photosynthesis)"
    value={topic}
    onChange={(e) => setTopic(e.target.value)}
    className="w-100 p-2 rounded bg-gray-800 outline-2 outline-offset-3 outline-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
  />

<div className="mt-4">
  {loadingExplain && <p>Loading...</p>}
</div>

{explanation && (
  <div className="bg-[var(--card)] p-4 rounded mt-6">
    <pre className="whitespace-pre-wrap">{explanation}</pre>
  </div>
)}
</div>
  </div>
)}

{activeTab === "quiz" && (
  <div className="p-4">

    {/* STEP 1: START */}
    {quizStep === "start" && (
      <div className="border-2 border-gray-700 p-6 rounded-lg">

        <h2 className="text-lg font-semibold mb-4">Generate Quiz</h2>

        <select
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="p-2 bg-gray-800 rounded mb-4"
        >
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
        </select>

        <br />

        <button
          onClick={handleGenerateQuiz}
          className="px-4 py-2 gradient-primary rounded"
        >
          Generate Quiz
        </button>

        {loadingQuiz && <p className="mt-4">Generating...</p>}
      </div>
    )}

    {/* STEP 2: QUIZ */}
    {quizStep === "quiz" && (
      <div className="space-y-6">

        {quiz?.map((q, i) => (
          <div key={i} className="p-4 border border-gray-700 rounded-lg">

            <p className="font-medium mb-2">
              {i + 1}. {q.question}
            </p>

            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setQuizAnswers({ ...quizAnswers, [i]: opt })
                  }
                  className={`block w-full text-left p-2 rounded border
                    ${quizAnswers[i] === opt
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
          onClick={() => setQuizStep("result")}
          className="px-6 py-2 gradient-primary rounded"
        >
          Submit Quiz
        </button>
      </div>
    )}

    {/* STEP 3: RESULT */}
    {quizStep === "result" && (
      <div>

        <h2 className="text-lg font-semibold mb-4">
          Results
        </h2>

        <p className="mb-6">
          Score: {
            quiz.filter((q, i) => quizAnswers[i] === q.correctAnswer).length
          } / {quiz.length}
        </p>

        {quiz.map((q, i) => (
          <div key={i} className="p-4 border border-gray-700 rounded-lg mb-4">

            <p className="font-medium mb-2">
              {q.question}
            </p>

            {q.options.map((opt, idx) => {
              const isCorrect = opt === q.correctAnswer;
              const isSelected = quizAnswers[i] === opt;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded mb-1
                    ${isCorrect ? "bg-green-900" : ""}
                    ${isSelected && !isCorrect ? "bg-red-900" : ""}
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

        <button
          onClick={() => setQuizStep("start")}
          className="px-4 py-2 gradient-primary rounded"
        >
          Retry
        </button>

      </div>
    )}

  </div>
)}


    </div>
  );
}

export default Viewer;