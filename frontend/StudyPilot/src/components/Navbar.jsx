import { GraduationCap, User } from "lucide-react";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
    <div className="flex flex-row place-content-between">
      <div className="flex flex-row mx-6 my-4 gap-3 ">
          <div className="gradient-primary-vertical p-2 rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/30">
            <GraduationCap size={25} className="text-gray-200" />
          </div>
          <span className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center">
            Study
            <span className="gradient-primary bg-clip-text text-transparent ml-1">
              Pilot
            </span>
          </span>
      </div>
      <span className="flex flex-row mx-6 my-4 gap-2 ">
        <div className="gradient-primary-vertical p-2 rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/30">
          <User size={22} className="text-gray-200"/>
        </div>
        <div className="flex flex-col">
          <span className="text-md">{user?.name || "User"}</span>
          <span className="text-sm text-[var(--muted)]">
            {user?.email || "user@gmail.com"}
          </span>
        </div>
      </span>
    </div>
    <div className="w-full h-px bg-[var(--border)]"></div>
    </div>
  );
}

export default Navbar;