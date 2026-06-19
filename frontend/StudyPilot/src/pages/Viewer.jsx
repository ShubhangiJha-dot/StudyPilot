import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import InnerNav from "../components/InnerNav";

function Viewer() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("content");

  useEffect(() => {
    fetch("http://localhost:5000/api/pdf", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const found = data.find(d => d.id == id);
        setDoc(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!doc) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-2">
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
    <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
    <p className="text-gray-300">
      (We will plug backend summary here)
    </p>

    <h2 className="text-lg font-semibold mt-4 mb-2">
      Concept Explainer
    </h2>
    <p className="text-gray-300">
      (Concept breakdown will come here)
    </p>
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