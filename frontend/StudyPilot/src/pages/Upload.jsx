import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Upload Page</h1>

      <button onClick={() => navigate("/document/123")}>
        Fake Upload → Go to Document
      </button>
    </div>
  );
}