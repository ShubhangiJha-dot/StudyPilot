import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-[var(--background)]">
        <Navbar />
      </div>

      {/* BODY */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <div className="sticky top-16 h-[calc(100vh-4rem)] ">
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default Layout;