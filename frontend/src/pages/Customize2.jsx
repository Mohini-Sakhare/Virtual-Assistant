import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import axios from 'axios';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';


function Customize2() {
    
   const clientuser = axios.create({
       baseURL: 'http://localhost:5050/api/user'
     })  

    const {userData, selectImg, backImg,setUserData}=useContext(userDataContext)
    const [assistantName, setAssistantName]=useState(userData?.AssistantName || "")

    const [loading, setLoading]=useState(false)

    const navigate=useNavigate()


    const handleUpdateAssistant=async()=>{
      setLoading(true)
       try{
        let formData=new FormData()
        formData.append("assistantName",assistantName)
        if(backImg){
            formData.append("assistantImage",backImg)
        }else{
            formData.append("imageUrl",selectImg)
        }
        const result = await clientuser.post('/update', 
          // {
          //   assistantName:assistantName,
          //   assistantImage:backImg,
          //   imageUrl:selectImg
          // } ,
          formData,
    
          {withCredentials:true}
          );
          setLoading(false); 
         console.log(result.data);
         setUserData(result.data)
         navigate("/")
    } catch (error) {
       setLoading(false);
      console.log(error);
    }
       
    }
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010185]
                   flex justify-center items-center flex-col p-[20px] relative">
        <MdOutlineKeyboardBackspace className='absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer 
        border-2 border-cyan-800 rounded-xl hover:border-cyan-500 '
        onClick={()=>navigate("/customize")} />
        <h1 className="text-white text-[30px] text-center mb-[20px]">
           Enter Your <span className="text-cyan-300">Assistant Name</span></h1> 
        <input
          type="text"
          placeholder="eg. Mohini"
          className="w-full max-w-[600px] h-[50px] outline-none border-2 border-none bg-blue-950 
          shadow shadow-blue-400 text-white text-[18px] placeholder-gray-300 
          px-[20px] py-[10px]  rounded-full" required name='name' value={assistantName} onChange={(e)=>setAssistantName(e.target.value)} />    
        
        {assistantName && <button className="min-w-[300px] h-[50px] bg-cyan-600 rounded-4xl text-[19px] 
                                font-bold flex justify-center items-center gap-2 mt-[40px] hover:shadow-2xl hover:shadow-blue-800  
                              cursor-pointer hover:border-6 hover:border-cyan-800" disabled={loading}
                                onClick={()=>{navigate("/")
                                    handleUpdateAssistant()
                                    }
                                    } >
                                  {!loading?"Finally Create Your Assistant":"Loading..."}
                          </button>}

    </div>
  )
}

export default Customize2