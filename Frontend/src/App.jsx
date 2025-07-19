import { Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import { UserData } from "./context/UserContext";
import Loading from "./components/Loading";

const App = () => {
  const { isAuth, loading } = UserData();
  if (loading) return <Loading />;
  return (
    <div>
      <Routes>
        <Route path="/signup" element={isAuth ? <Home /> : <Signup />} />
        <Route path="/signin" element={isAuth ? <Home /> : <Signin />} />
        <Route path="/" element={isAuth ? <Home /> : <Signin />} />
      </Routes>
    </div>
  );
};

export default App;
