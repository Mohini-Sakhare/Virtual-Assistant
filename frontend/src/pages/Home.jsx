import React, { useContext, useEffect, useState, useRef, use } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross1 } from "react-icons/rx";
import user from "../assets/user.gif";
import ai from "../assets/ai.gif";
import { MdDelete } from "react-icons/md";

function Home() {
  const { userData, setUserData, getGeminiResponse, handleDeleteHistory } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [userText, setUserText] = useState();
  const [aiText, setAiText] = useState();

  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const [menu, setMenu] = useState(false);

  const client = axios.create({
    baseURL: "http://localhost:5050/api/auth",
  });

  const handleLogOut = async () => {
    try {
      const { data } = await client.get("/logout", { withCredentials: true });
      console.log(data);
      setUserData(null);
    } catch (error) {
      console.log(error);
      setUserData(null);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("start error:", error);
        }
      }
    }
  };

  function speak(text) {
    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;

      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterence);
  }

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "calculator_open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }

    if (type === "instagram_open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }

    if (type === "facebook_open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }

    if (type === "weather_show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    (recognition.continuous = true), (recognition.lang = "en-US");

    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") {
            console.log(e);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("recognition restarted");
            } catch (e) {
              if (e.name !== "InvalidStateError") {
                console.log(e);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Userspeak:" + transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);

        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        console.log(data);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");

        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello, ${userData.name} what can i help you with?`
    );
    greeting.lang = "hi-IN";
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div
      className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#000063]
                   flex justify-center items-center flex-col gap-[15px] fixed"
    >
      <RiMenu3Fill
        className="text-white absolute top-[20px] right-[20px] h-[25px] w-[25px] cursor-pointer"
        onClick={() => setMenu(true)}
      />

      <div
        className={`absolute top-0 w-full h-full bg-[#0000005b] backdrop-blur-xs 
                    flex flex-col gap-[20px] items-start ${
                      menu ? "translate-x-0" : "translate-x-full"
                    } transition-transform `}
      >
        <RxCross1
          className="text-white absolute top-[20px] right-[20px] h-[25px] w-[25px] cursor-pointer "
          onClick={() => setMenu(false)}
        />

        <button
          className="min-w-[100px] h-[40px] mt-[30px] ml-[8px] text-white text-[19px] font-semibold
       border-2 border-cyan-800 rounded-4xl hover:shadow hover:shadow-blue-400 hover:border-cyan-500 cursor-pointer
      "
          onClick={handleLogOut}
        >
          Log Out
        </button>

        <button
          className="min-w-[110px] h-[45px] text-white text-[19px] font-semibold
        border-2 border-cyan-800 rounded-4xl hover:shadow hover:shadow-blue-400 hover:border-cyan-500 cursor-pointer
        ml-[8px] pl-[10px] pr-[10px]"
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        <div className="w-full h-[5px] bg-gray-400"></div>

        <div className="w-[97%]  p-[10px] ">
          <div className="flex justify-between items-center bg-[#001f3f] px-4 py-2 rounded-md">
            <h1 className="text-white text-[18px] font-semibold">History</h1>
            <MdDelete
              className="text-red-500 cursor-pointer hover:text-red-700"
              onClick={() => handleDeleteHistory(null)}
              title="Delete this entry"
            />
          </div>
          
        </div>
        <div className="min-w-[85%] overflow-y-auto flex flex-col mx-7 my-2 gap-[8px] text-cyan-500 text-[18px]">
          {userData.history.map((data, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#001f3f] px-4 py-2 rounded-md"
            >
              <li className="list-none">{data}</li>
              <MdDelete
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => handleDeleteHistory(index)}
                title="Delete this entry"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden mt-[100px] ">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover rounded-4xl"
        />
      </div>
      <h1 className="text-white text-[20px] font-semibold">
        I'm {userData?.assistantName}
      </h1>

      {!aiText && <img src={user} alt="" className="w-[350px] h-[130px]" />}
      {aiText && <img src={ai} alt="" className="w-[350px] h-[130px]" />}

      <h1 className="text-white text-[16px] font-bold text-wrap p-[20px]">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;