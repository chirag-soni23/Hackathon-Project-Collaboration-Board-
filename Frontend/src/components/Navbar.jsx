import { useState, useRef, useEffect } from "react";
import { UserData } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = UserData();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <div
        className="w-10 h-10 bg-blue-500 rounded-full text-white flex items-center justify-center font-semibold text-lg shadow-md cursor-pointer"
        title={user.name}
        onClick={() => setOpen(!open)}
      >
        <span>{user.name?.charAt(0).toUpperCase()}</span>
      </div>

      {open && (
        <div className="mt-2 w-36 absolute right-0 space-y-2">
          <button
            onClick={() => navigate("/active-users")}
            className="block w-full text-left px-4 py-2 text-sm text-white font-bold bg-green-500 hover:bg-green-400 rounded-xl"
          >
            Active Users
          </button>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-white font-bold bg-red-500 hover:bg-red-400 rounded-xl"
          >
            Logout
          </button>
          <a href="http://localhost:8501/" target="_blank"
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-white font-bold bg-purple-500 hover:bg-purple-400 rounded-xl"
          >
            Flow Chart
          </a>
        </div>
      )}
    </div>
  );
};

export default Navbar;
