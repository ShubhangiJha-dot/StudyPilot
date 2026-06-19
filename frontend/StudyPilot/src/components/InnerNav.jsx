export default function InnerNav({ activeTab, setActiveTab }) {
  return(

    <div className="flex gap-6 border-b border-gray-700 mb-4 text-md font-semibold">
    <button
        onClick={() => setActiveTab("content")}
        className={`pb-2 ${
        activeTab === "content"
            ? "border-b-2 border-[var(--primary-hover)] text-[var(--primary)]"
            : "text-gray-400"
        }`}
    >
        Content
    </button>

    <button
        onClick={() => setActiveTab("ai")}
        className={`pb-2 ${
        activeTab === "ai"
            ? "border-b-2 border-[var(--primary-hover)] text-[var(--primary)]"
            : "text-gray-400"
        }`}
    >
        AI Summarizer
    </button>

    <button
        onClick={() => setActiveTab("quiz")}
        className={`pb-2 ${
        activeTab === "quiz"
            ? "border-b-2 border-[var(--primary-hover)] text-[var(--primary)]"
            : "text-gray-400"
        }`}
    >
        Quizzes
    </button>
    </div>
  )
}