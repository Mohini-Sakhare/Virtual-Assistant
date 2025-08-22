import genToken from "../config/token.js";
import User from "../model/UserModel.js"
import bcrypt, {hash} from 'bcryptjs';
import crypto from 'crypto';


//user signup

export const SignUp=async(req, res)=>{
    
    try{
        const {name, email, password}=req.body;
        const existEmail=await User.findOne({email})

        if(existEmail){
            return res.status(400).json({message:"user already exists!"});
        }

        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 character"});
        }
        
        const hashedPassword=await bcrypt.hash(password, 10)

        const user=await User.create({
            name,
            email,
            password:hashedPassword
        });
        
        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })
       
        return res.status(201).json({message:"User signed in successfully", user})

    }catch(error){
       res.status(500).json({message:'sign up error', error})
    }
}

//user login

export const Login=async(req, res)=>{
     
    try{
       const {email, password}=req.body;

        if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
     }
       const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"Incorrect email!"});
        }
    
       const isMatch=await bcrypt.compare(password,user.password)

       if(!isMatch){
        return res.status(400).json({message:"Incorrect password"})
       }
         
        const token=await genToken(user._id)

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:7*24*60*60*1000,
            sameSite:"strict",
            secure:false
        })

        return res.status(200).json({message:"User Logged in successfully", success:true, user})

    }catch(error){
       return res.status(500).json({message:'login error', error})
    }
}

//user logout function

export const logOut=async(req, res)=>{
    try{
        res.clearCookie("token")
        return res.status(200).json({message:"log out successfully"})
    }catch(error){
       return res.status(500).json({message:`logout error ${error}`})
    }
}