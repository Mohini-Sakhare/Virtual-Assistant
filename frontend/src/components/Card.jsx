import React,{useContext} from "react";
import  { userDataContext } from "../context/UserContext";

function Card({image}) {
  const {frontImg, setFrontImg, backImg, setBackImg,selectImg, setSelectImg}=useContext(userDataContext)
  return (
    <div className={`w-[65px] h-[115px] lg:w-[140px] lg:h-[200px] bg-[#010133] border-2 border-[#050585] 
            rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-800 hover:border-2 hover:border-blue-100 cursor-pointer 
            ${selectImg==image?"border-4 border-white shadow-2xl shadow-blue-800":null}`} 
            onClick={()=>{
              setSelectImg(image)
              setBackImg(null)
              setFrontImg(null)
              }} >
      <img src={image} className="h-full w-full object-cover" />
    </div>
  );
}

export default Card;
