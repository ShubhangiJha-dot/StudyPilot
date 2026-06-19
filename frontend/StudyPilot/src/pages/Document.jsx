import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X } from "lucide-react";

function Document() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpload = async () => {
    if (!file || !title) {
      alert("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      await fetch("http://localhost:5000/api/pdf/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      alert("Uploaded!");
      setShowModal(false);

      // refresh docs
      fetch("http://localhost:5000/api/pdf", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(res => res.json())
        .then(data => setDocs(data));
      setFile(null);
      setTitle("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };
useEffect(() => {
  fetch("http://localhost:5000/api/pdf", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then(res => res.json())
    .then(data => setDocs(data))
    .catch(err => console.error(err));
}, []);
  return (
    <>
      {/* Top bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl">My Documents</h1>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 text-white gradient-primary px-4 py-2 rounded-lg cursor-pointer"
        >
          <Upload size={19} />
          Upload Docs
        </button>
      </div>

      {/* <div className="mt-6 flex flex-col gap-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-3 border border-[var(--border)] rounded-lg"
          >
            {doc.filename}
          </div>
        ))}
      </div> */}

<div className="grid grid-cols-3 gap-4 mt-6">
  {docs.map((doc) => (
    <div
      key={doc.id}
      onClick={() => navigate(`/document/${doc.id}`)} 
      className="p-4 rounded-xl border border-gray-700 cursor-pointer hover:shadow-lg transition"
    >
      <div className="text-3xl mb-2">📄</div>

      <h3 className="font-semibold truncate">
        {doc.title || doc.filename}
      </h3>

      <p className="text-xs text-gray-400 mt-1">
        PDF Document
      </p>
    </div>
  ))}
</div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          
          <div className="bg-[var(--card)] p-6 rounded-xl w-[400px] relative">

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Upload New Document
            </h2>

            {/* TITLE INPUT */}
            <input
              type="text"
              placeholder="Document title"
              className="
                w-full mb-4 px-3 py-2 rounded-md border border-[var(--border)] bg-transparent
                focus:border-[var(--primary)]
                focus:ring-2 focus:ring-[var(--primary)]/30
                outline-none transition
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="mb-4">
              <label
                className={`
                  flex flex-col items-center justify-center
                  border-2 rounded-xl p-6 cursor-pointer text-center transition
                  ${
                    file
                      ? "border-[var(--primary)] bg-[var(--primary)]/5"
                      : "border-dashed border-[var(--primary)]/60 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
                  }
                `}
              >
                {/* Icon */}
                <div className="bg-[var(--primary)]/10 p-3 rounded-lg mb-3">
                  <Upload
                    className="text-[var(--primary)]"
                    size={22}
                  />
                </div>

                {/* Text */}
                {file ? (
                  <>
                    <p className="text-[var(--primary)] font-medium">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF up to 10MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[var(--primary)] font-medium">
                      Click to upload PDF
                    </p>
                    <p className="text-xs text-gray-400">
                      PDF up to 10MB
                    </p>
                  </>
                )}

                {/* Hidden input */}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex place-content-around gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md border border-[var(--muted)] cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="px-4 py-2 rounded-md text-white gradient-primary cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Document;