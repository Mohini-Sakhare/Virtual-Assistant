import React, { useState,useRef, use, useContext } from "react";
import Card from "../components/Card";
import ai1 from "../assets/ai1.WEBP";
import ai2 from "../assets/ai2.jpg";
import ai3 from "../assets/ai3.jpg";
import ai4 from "../assets/ai4.jpg";
import ai5 from "../assets/ai5.jpg";
import ai6 from "../assets/ai6.jpg";
import ai7 from "../assets/ai7.AVIF";
import ai8 from "../assets/ai8.jpg";
import ai9 from "../assets/ai9.jpg";
import { RiImageAddFill } from "react-icons/ri";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

function Customize() {
  const {frontImg, setFrontImg, backImg, setBackImg,selectImg, setSelectImg}=useContext(userDataContext)
  const inputImage = useRef();

  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackImg(file)
    setFrontImg(URL.createObjectURL(file))
  }

  const navigate=useNavigate()

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010185]
                   flex justify-center items-center flex-col p-[20px]">
      <MdOutlineKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer 
              border-2 border-cyan-800 rounded-xl hover:border-cyan-500 '
              onClick={()=>navigate("/")} />              
      <h1 className="text-white text-[30px] text-center mb-[20px]">
        Select your <span className="text-cyan-300">Assistant Image</span>
      </h1>
      <div className="w-full max-w-[1000px] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={ai1} />
        <Card image={ai2} />
        <Card image={ai3} />
        <Card image={ai4} />
        <Card image={ai5} />
        <Card image={ai6} />
        <Card image={ai7} />
        <Card image={ai8} />
        <Card image={ai9} />
        {/* <Card image={ai11}/> */}
        <div className={`w-[65px] h-[115px] lg:w-[140px] lg:h-[200px] bg-[#010133] border-2
                      border-[#050585] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800  
                      cursor-pointer hover:border-2 hover:border-blue-100 flex items-center justify-center 
                      ${selectImg=="input"?"border-4 border-white shadow-2xl shadow-blue-800":null}`}

                      onClick={()=>{
                        inputImage.current.click()
                        setSelectImg('input')
                        }} 
        >
          
        {!frontImg && <RiImageAddFill className="text-white w-[25px] h-[25px] flex justify-center items-center" />}
        {frontImg &&  <img src={frontImg} className="h-full object-cover"/> }

        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden 
        onChange={handleImage} />
      </div>

      {selectImg && <button className="min-w-[120px] h-[50px] bg-cyan-600 rounded-4xl text-[19px] 
                        font-bold flex justify-center items-center gap-2 mt-[15px] hover:shadow-2xl hover:shadow-blue-800  
                      cursor-pointer hover:border-6 hover:border-cyan-800" 
                        onClick={()=>navigate("/customize2")} >
                        Next<TbPlayerTrackNextFilled /></button>}
      
    </div>
  );
}

export default Customize;
