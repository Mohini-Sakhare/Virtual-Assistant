import { response } from "express";
import geminiResponse from "../gemini.js";
import User from "../model/UserModel.js";
import moment from "moment/moment.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser=async(req, res)=>{
    try{
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        return res.status(200).json(user)
    }catch(error){
       return res.status(400).json({message:"get current user error"})
    }
}

export const updateAssistant=async (req, res)=>{
    try{
       const {assistantName, imageUrl}=req.body
       let assistantImage; 

       if(req.file){
         assistantImage = await uploadOnCloudinary(req.file.path);
        //  const uploadResult 
      // assistantImage = uploadResult?.secure_url || imageUrl;
       }else{
        assistantImage=imageUrl
       }

      // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage
      },
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(updatedUser);

    }catch(error){
       console.error('Update Assistant Error:', error);
    return res.status(500).json({ message: 'Update Assistant Error' });

    }
}

export const askToAssistant=async(req, res)=>{
  try{
    const {command}=req.body
    const user=await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName=user.name
    const assistantName=user.assistantName
    const result=await geminiResponse(command,assistantName,userName)

    const jsonMatch=result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      return res.status(400).json({response:"sorry, i can't understand"})
    }
    const gemResult=JSON.parse(jsonMatch[0])
    const type=gemResult.type

    switch(type){
      case 'get_date':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current date is ${moment().format("MMMM Do YYYY")}`
        });
    
      case 'get_time':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current time is ${moment().format("h:m a")}`
        });
      
      case 'get_day':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`today is ${moment().format("dddd")}`
        });  

      case 'get_month':
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current month is ${moment().format("MMMM")}`
        }); 
        
      case "general":
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "spotify_open":   
      case "spotify_search":
      case "spotify_play":
      case "vscode_open":
      case "mongodb_open":
      case "weather_show":
             return res.json({
              type,
              userInput:gemResult.userInput,
              response:gemResult.response,
             })
      default:
        return res.status(400).json({message:"I didn't understand this command"})                  
    }
  
  }catch(error){
    return res.status(500).json({message:"Ask assistant error"})
  }
}

export const deletehistory = async (req, res) => {
  const { history } = req.body;
  const userId = req.userId;
  
  if (!userId) return res.status(400).json({ success: false, message: "User not authenticated" });

  try {
    await User.findByIdAndUpdate(userId, { history });
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating history:", err);
    res.status(500).json({ success: false, message: "Failed to update history" });
  }
};
