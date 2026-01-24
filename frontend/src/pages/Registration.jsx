import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.png";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase.js";
import { userDataContext } from "../context/UserContext";
import api from "../utils/api.js";
import Loading from "../component/Loading";

function Registration() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { getCurrentUser } = useContext(userDataContext);
  const navigate = useNavigate();

  // ✅ NORMAL SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/api/auth/registration",
        { name, email, password },
        { withCredentials: true }
      );

      await getCurrentUser();
      toast.success("User Registration Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("User Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGNUP
  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      await api.post(
        "/api/auth/googlelogin",
        {
          name: user.displayName,
          email: user.email,
        },
        { withCredentials: true }
      );

      await getCurrentUser();
      toast.success("User Registration Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Google Registration Failed");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center">
      <div
        className="w-full h-[80px] flex items-center px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[40px]" src={Logo} alt="" />
        <h1 className="text-[22px] font-sans">OneCart</h1>
      </div>

      <div className="w-full h-[100px] flex flex-col items-center justify-center gap-[10px]">
        <span className="text-[25px] font-semibold">Registration Page</span>
        <span className="text-[16px]">Welcome to OneCart</span>
      </div>

      <div className="max-w-[600px] w-[90%] bg-[#00000025] border border-[#96969635] rounded-lg shadow-lg flex justify-center">
        <form
          onSubmit={handleSignup}
          className="w-[90%] py-[30px] flex flex-col gap-[15px]"
        >
          <div
            className="w-full h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-[10px] cursor-pointer"
            onClick={googleSignup}
          >
            <img src={google} alt="" className="w-[20px]" />
            Register with Google
          </div>

          <input
            type="text"
            placeholder="User Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <div className="relative w-full">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            {!show ? (
              <IoEyeOutline
                className="eye"
                onClick={() => setShow(true)}
              />
            ) : (
              <IoEye className="eye" onClick={() => setShow(false)} />
            )}
          </div>

          <button className="w-full h-[50px] bg-[#6060f5] rounded-lg font-semibold">
            {loading ? <Loading /> : "Create Account"}
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
