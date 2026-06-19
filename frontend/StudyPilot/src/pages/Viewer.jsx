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
    <h2 className="text-lg font-semibold mb-4">
      Generated Quiz
    </h2>

    <div className="space-y-4">
      <div className="p-4 border border-gray-700 rounded-lg">
        <p className="font-medium">
          What is Value Education?
        </p>
        <ul className="mt-2 text-sm text-gray-300">
          <li>A. Random concept</li>
          <li>B. Process of human value development</li>
          <li>C. Programming method</li>
          <li>D. None</li>
        </ul>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default Viewer;