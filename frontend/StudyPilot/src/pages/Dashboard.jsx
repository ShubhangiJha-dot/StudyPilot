import { useNavigate } from "react-router-dom";
import { FileInput } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="text-md text-[var(--muted)] mt-2">
        Welcome to StudyPilot. To get started, head over to the Documents section from the sidebar:
        <br></br>
        <span className="flex w-40 items-center gap-2 text-white bg-[var(--primary)] px-2 py-1 rounded mt-3"><FileInput size={19}/>Document</span>
      </p>
          
      <p className="text-md text-[var(--muted)] mt-3"> 
        Upload your PDF files to begin analyzing and interacting with your study material. Once uploaded, you’ll be able to explore content, extract insights, and work more efficiently with your documents. Your recent activity and saved work will appear here as you continue using the platform.
      </p>
    </div>
  );
}