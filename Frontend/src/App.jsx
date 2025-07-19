import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import { UserData } from "./context/UserContext";
import Loading from "./components/Loading";
import ActiveUsers from "./pages/ActiveUsers";
import socket from "./socket.js";

const App = () => {
  const { isAuth, loading, user } = UserData();

  useEffect(() => {
    if (isAuth && user) {
      socket.emit("new-user", user);
    }
  }, [isAuth, user]);

  if (loading) return <Loading />;

  return (
    <div>
      <Routes>
        <Route path="/active-users" element={<ActiveUsers />} />
        <Route path="/signup" element={isAuth ? <Home /> : <Signup />} />
        <Route path="/signin" element={isAuth ? <Home /> : <Signin />} />
        <Route path="/" element={isAuth ? <Home /> : <Signin />} />
      </Routes>
    </div>
  );
};

export default App;
