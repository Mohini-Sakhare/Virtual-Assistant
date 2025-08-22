import React, { createContext} from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';

export const userDataContext = createContext();


export const UserContext=({children}) =>{

  const clientuser = axios.create({
       baseURL: 'http://localhost:5050/api/user'
     })

  const [userData, setUserData]=useState(null);

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [selectImg, setSelectImg]=useState(null);


    const handleCurrentUser=async()=>{
      try{
        const result= await clientuser.get('/current',{
          withCredentials:true
        })
        setUserData(result.data);
       console.log(result.data);
      }catch(error){
       console.log(error);
      }
    }
    
    useEffect(()=>{
      handleCurrentUser()
    },[])

  const getGeminiResponse=async(command)=>{
     try{
      const result= await clientuser.post('/asktoassistant',
        {command},
        {withCredentials:true}
      )
        return result.data;
     }catch(error){
        console.log(error);
     }
  }

    const handleDeleteHistory = async (indexToDelete = null) => {
      try {
        const updatedHistory = indexToDelete === null ? [] : userData.history.filter((_, index) => index !== indexToDelete);
    
        const { data } = await clientuser.post('/delete-history', {
          history: updatedHistory
        }, { withCredentials: true });
    
        if (data.success) {
          setUserData(prev => ({ ...prev, history: updatedHistory }));
          console.log("History item deleted successfully");
        } else {
          console.log("Failed to delete history item");
        }
      } catch (error) {
        console.error("Delete history error:", error);
        console.log("Error deleting history item");
      }
    };

  const data = {
    userData, setUserData, clientuser, frontImg, setFrontImg,
    backImg, setBackImg,selectImg, setSelectImg, getGeminiResponse, handleDeleteHistory }
  return (
    <div>
        <userDataContext.Provider value={data}>
             {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
