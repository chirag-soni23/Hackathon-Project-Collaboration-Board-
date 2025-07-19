import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { BriefcaseIcon, Eye, EyeOff } from "lucide-react";
import { UserData } from "../context/UserContext.jsx";
import { gsap } from "gsap";

const Signup = () => {
  const formPanelRef = useRef(null);
  const illustrationRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { registerUser, btnLoading } = UserData();

  const submitHandler = (e) => {
    e.preventDefault();
    registerUser(name, email, password, navigate);
  };

  const handleLoginClick = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      navigate("/signin");
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "expo.out" },
      onComplete: () => navigate("/signin"),
    });

    tl.to(illustrationRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      pointerEvents: "none",
    }).to(
      formPanelRef.current,
      {
        width: "100%",
        borderRadius: "0px",
        scale: 1.02,
        duration: 1,
      },
      "<"
    );
  };

  return (
    <section className="min-h-screen relative flex bg-white overflow-hidden">
      {/* Left Panel */}
      <div className="w-1/2 bg-gradient-to-br from-indigo-500 to-blue-400 text-white p-10 relative z-10 flex flex-col justify-center">
        <img
          src={assets.photo}
          alt="blob background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute top-10 z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-snug flex items-center justify-center gap-4">
            <BriefcaseIcon className="w-10 h-10" /> JobPilot
          </h2>
        </div>
      </div>

      {/* Right Panel */}
      <div
        ref={formPanelRef}
        className="w-full md:w-[60%] absolute right-0 top-0 h-full bg-white lg:rounded-bl-[100px] lg:rounded-tl-[100px] shadow-2xl md:rounded-bl-[100px] md:rounded-tl-[100px] z-20 flex items-center justify-center p-6 sm:p-10"
      >
        <form
          className="md:w-96 w-80 flex flex-col items-center justify-center"
          onSubmit={submitHandler}
        >
          <h2 className="text-4xl text-gray-900 font-medium">Sign Up</h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Join us today! Please fill the details to create an account.
          </p>

          <button
            type="button"
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">
              or sign up with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Full Name */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mb-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5Zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5Z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {/* Email */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 pr-4">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input className="h-5" type="checkbox" id="checkbox" />
              <label className="text-sm" htmlFor="checkbox">
                Remember me
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
          >
            {btnLoading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <button
              onClick={handleLoginClick}
              type="button"
              className="text-indigo-400 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;
