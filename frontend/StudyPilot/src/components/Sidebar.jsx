
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileInput } from "lucide-react";

function Sidebar() {
  return (
    <div className="w-[300px] h-screen bg-[var(--background)] p-5 relative">

      <ul className="text-md font-semibold flex flex-col gap-4">

        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive
                  ? "gradient-primary text-white"
                  : "hover:ring-2 hover:ring-[var(--primary)] ring-offset-0"
              }`
            }
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/document"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg transition ${
                isActive
                  ? "gradient-primary text-white"
                  : "hover:ring-2 hover:ring-[var(--primary)] ring-offset-0"
              }`
            }
          >
            <FileInput size={18} />
            <span>Document</span>
          </NavLink>
        </li>

      </ul>

      {/* Vertical divider */}
      <div className="absolute top-0 right-0 h-full w-px bg-[var(--border)]" />

    </div>
  );
}

export default Sidebar;