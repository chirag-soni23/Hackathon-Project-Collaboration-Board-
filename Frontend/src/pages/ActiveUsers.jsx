import { useEffect, useState } from "react";
import socket from "../socket";
import { UsersRound, User2, Mail } from "lucide-react";

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.on("active-users", (users) => {
      setActiveUsers(users);
    });

    return () => socket.off("active-users");
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-12 bg-[#0f172a]/70 backdrop-blur-md rounded-3xl border border-slate-800 shadow-[0_0_30px_#0ea5e9]">
      <div className="flex items-center justify-center mb-8">
        <UsersRound className="text-cyan-400 w-9 h-9 mr-3" />
        <h2 className="text-3xl font-extrabold text-cyan-300 tracking-wider">
          Active Users
        </h2>
      </div>

      {activeUsers.length === 0 ? (
        <p className="text-center text-slate-400 text-lg animate-pulse">
          No users online right now.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeUsers.map((user, index) => (
            <li
              key={index}
              className="flex items-center gap-4 p-4 bg-[#1e293b]/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_#3b82f6]"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#1e293b] rounded-full animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#1e293b] rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-100 font-semibold">
                  <User2 size={18} className="text-cyan-400" />
                  <span>{user.name}</span>
                </div>
                {user.email && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                    <Mail size={16} className="text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveUsers;
