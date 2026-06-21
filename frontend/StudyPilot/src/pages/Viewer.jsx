
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InnerNav from "../components/InnerNav";
import { Sparkles, Lightbulb } from 'lucide-react';
import API from "../api/axios";
import QuizPage from "../pages/QuizPage";

const BASE_URL = import.meta.env.VITE_API_URL;

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
  const [quizStep, setQuizStep] = useState("start");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  // ✅ FETCH DOCUMENT (FIXED)
useEffect(() => {
  const fetchDoc = async () => {
    try {
      // // const res = await API.get("/api/pdf");
      // // const found = res.data.find(d => d.id == id);
      // // setDoc(found);
      // const res = await API.get(`/api/pdf/${id}`);
      // setDoc(res.data);
const res = await API.get(`/api/pdf/${id}`);
console.log("API RESPONSE:", res.data);

// 🔥 TRY THIS FIRST
setDoc(res.data.document || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDoc();
}, [id]);

  // ✅ SUMMARY (FIXED)
  // const handleGenerateAI = async () => {
  //   try {
  //     if (!doc?.content) return alert("Document text missing");

  //     setLoadingAI(true);

  //     const res = await API.post("/api/ai/summary", {
  //       text: doc.content,
  //     });

  //     setSummary(res.data.summary || "");
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoadingAI(false);
  //   }
  // };


const handleGenerateAI = async () => {
  try {
    if (!doc?.id) {
      alert("Document not loaded yet");
      return;
    }

    setLoadingAI(true);

    const res = await API.post("/api/ai/summary", {
      documentId: doc.id,
    });

    setSummary(res.data.summary || "");
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingAI(false);
  }
};

  // ✅ EXPLAIN (FIXED)
  const handleExplain = async () => {
    try {
      if (!topic.trim()) return alert("Enter a topic");

      setLoadingExplain(true);

      const res = await API.post("/api/ai/explain", {
        topic,
      });

      setExplanation(res.data.explanation || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingExplain(false);
    }
  };

  // ✅ QUIZ (FIXED PROPERLY)
  const handleGenerateQuiz = async () => {
    try {
      if (!doc?.content) return alert("Document text not found");

      setLoadingQuiz(true);

      const res = await API.post("/api/ai/quiz", {
        text: doc.content,
        numQuestions: Number(numQuestions), // 🔥 important fix
      });

      const data = res.data;

      if (!data?.quiz) {
        alert("Quiz generation failed");
        return;
      }

      setQuiz(data.quiz);
      setQuizAnswers({});
      setQuizStep("quiz");

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

{activeTab === "content" && doc?.url &&(
  // <iframe
  //   src={`${BASE_URL}/uploads/${doc.filename}`
  <iframe src={doc.url}
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
  <QuizPage doc={doc} />
)}


    </div>
  );
}

export default Viewer;