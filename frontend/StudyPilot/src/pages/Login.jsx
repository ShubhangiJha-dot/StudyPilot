import { useState } from "react";
import { loginUser } from "../api/auth";
import { GraduationCap, Mail, Lock, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

function InputField({ label, type = "text", placeholder, Icon, onChange }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      
      <label className="text-xs font-semibold uppercase tracking-wide text-white">
        {label}
      </label>

      <div className="flex items-center border border-[var(--border)] rounded-lg px-3 py-2
        focus-within:border-[var(--primary)] 
        focus-within:ring-2 focus-within:ring-[var(--primary)]/30
        transition">

        <Icon size={18} className="text-[var(--muted)] mr-2" />

        <input
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          className="w-full bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
        />
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--background)]">
      
      <div className="w-full max-w-md p-10 rounded-xl border border-[var(--border)] shadow-lg">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          
          <div className="gradient-primary-vertical p-2 rounded-lg flex items-center justify-center shadow-md shadow-[var(--primary)]/30">
            <GraduationCap size={26} className="text-gray-200" />
          </div>

          <span className="text-3xl font-bold text-[var(--foreground)]">
            Study
            <span className="gradient-primary bg-clip-text text-transparent ml-1">
              Pilot
            </span>
          </span>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 m-4">
        <span className="text-lg">Welcome Back</span>
        <p className="text-md  text-[var(--muted)]">Login to continue your journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            Icon={Mail}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            Icon={Lock}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg font-semibold text-white 
            gradient-primary flex items-center justify-center gap-2
            hover:opacity-90 transition active:scale-[0.98] mt-4"
          >
            Login
            <MoveRight size={18} />
          </button>
        </form>
        <div className="w-full h-px bg-[var(--border)] my-8"></div>
        <p className="text-center mt-8 text-md text-slate-500">
            No Account Yet?{' '}
            <Link to="/register" className="text-[var(--primary)] font-semibold hover:text-[var(--primary-hover)] transition">
                Get Yours Now
            </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;