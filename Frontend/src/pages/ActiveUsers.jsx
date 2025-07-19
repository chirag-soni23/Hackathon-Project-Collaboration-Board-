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
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
      <div className="flex items-center justify-center mb-6">
        <UsersRound className="text-blue-600 w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold text-blue-700 tracking-wide">
          Active Users
        </h2>
      </div>

      {activeUsers.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No users online right now.
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {activeUsers.map((user, index) => (
            <li
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl shadow hover:shadow-md transition-all duration-300"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full animate-ping"></span>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <div className="flex items-center gap-1 text-gray-800 font-semibold">
                  <User2 size={16} />
                  <span>{user.name}</span>
                </div>
                {user.email && (
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Mail size={14} />
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
