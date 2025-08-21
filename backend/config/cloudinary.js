import { v2 as cloudinary } from 'cloudinary';
import fs, { unlinkSync } from "fs"
import dotenv from 'dotenv'
dotenv.config();

const uploadOnCloudinary = async(filePath)=>{
  
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    try{
        // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath)
        return uploadResult.secure_url 
      // console.log(uploadResult);     
    }catch(error){
      fs.unlinkSync(filePath)
      return res.status(500).json({message:"cloudinary error"})
    }
}
export default uploadOnCloudinary;