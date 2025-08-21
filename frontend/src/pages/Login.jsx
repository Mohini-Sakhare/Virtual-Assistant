import React, { use, useContext, useState } from "react";
import aibg from "/aibg.avif";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { userDataContext } from "../context/UserContext";

export default function Login() {

 const client = axios.create({
     baseURL: 'http://localhost:5050/api/auth'
 })

 const {userData, setUserData}=useContext(userDataContext);

  const [showPassword, setShowPassword] = useState(false);

  const [err, setErr]=useState('');

   const [loading, setLoading]=useState(false);

  //use navigation for move to the login page
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const { email, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { data } = await client.post(
        "/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      setUserData(data)
      setLoading(false);
      navigate("/")
      const { success, message } = data;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.log(error);
       setUserData(null);
       setLoading(false);
      setErr(error.response.data.message);
    }
    setInputValue({
      ...inputValue,
      email: "",
      password: "",
    });
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-end-safe items-center pr-16"
      style={{ backgroundImage: `url(${aibg})` }}
    >
      <form onSubmit={handleSubmit} className="w-[50%] h-[500px] max-w-[450px] bg-[#00000085] shadow-lg shadow-black 
                               flex flex-col items-center justify-center gap-[20px] px-[30px]">
        <h1 className="text-white text-[28px] font-bold mb-[10px]">
          Login to <span className="text-cyan-500"> Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder=" Email"
          className="w-full h-[50px] outline-none border-2 border-none bg-blue-950 shadow shadow-blue-400
                    text-white text-[18px] placeholder-gray-300 px-[20px] py-1.5 rounded-full"
          required name="email" value={email} onChange={handleOnChange} />

        <div className="w-full h-[50px] text-white text-[18px] border-none outline-none border-2 bg-blue-950 
                      shadow shadow-blue-400 rounded-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder=" Password "
            className="w-full h-full outline-none border-2 border-none bg-blue-950 shadow shadow-blue-400
                     text-white text-[18px] placeholder-gray-300 px-[20px] py-1.5 rounded-full"
            required name="password" value={password} onChange={handleOnChange} />{" "}
          {!showPassword && (
            <IoEye
              onClick={() => setShowPassword(true)}
              className="absolute top-[13px] right-[20px] w-[25px] h-[25px] cursor-pointer "
            />
          )}
          {showPassword && (
            <IoEyeOff
              onClick={() => setShowPassword(false)}
              className="absolute top-[13px] right-[20px] w-[25px] h-[25px] cursor-pointer "
            />
          )}
        </div>

        {err.length>0 && <p className="text-red-500 font-semibold text-xl">* {err}</p> }

        <button className="min-w-[150px] h-[60px] bg-cyan-300 rounded-2xl text-[19px] font-bold " disabled={loading} >
         {loading?"Loading...": "Login"}
        </button>

        <p className="text-white text-[18px]">
          Don't have an account?{" "}
          <span
            className="text-cyan-300 font-bold text-[20px] underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </span>
        </p>
      </form>
      <ToastContainer/>
    </div>
  );
}

