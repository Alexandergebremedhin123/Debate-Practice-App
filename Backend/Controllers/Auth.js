import express from 'express';
import Debator from '../Models/User.js';
import Coach from '../Models/CoachModel.js';
import cloudinary from '../Config/Cloudinary.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../Config/CreateToken.js';
import dotenv from 'dotenv';

dotenv.config();
export const Signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, address, image } = req.body;
  
 
       if (email === process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: "Error signing up" });
    }
    const emailExists = await Debator.findOne({ email });
    const coachEmailExists = await Coach.findOne({ email });
    if (emailExists || coachEmailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    let imageResult;
    if (image) {
      const base64SizeInMB = (image.length * 3) / 4 / (1024 * 1024);
      if (base64SizeInMB > 1) {
        return res.status(400).json({ message: "Image size exceeds 1MB limit" });
      }

      const result = await cloudinary.uploader.upload(image, {
        folder: "Debate_Practice_App/Coaches",
      });
      imageResult = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const defaultImageUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 
    const hashpassword = await bcrypt.hash(password,10)

    const debator = new Debator({
      name,
      email,
      password: hashpassword,
      age,
      gender,
      address,
      role:"user",
      image: imageResult?.url || defaultImageUrl
    });

    const token = await createToken(debator);

    await debator.save();
    return res.status(200).json({ message: "Debator created successfully",debator:{id:debator._id,name:debator.name,
        role:debator.role,
        email:debator.email,
        image:debator.image
    },token:token });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
export const Login = async (req, res) => {
  try{
    const {email,password}=req.body;
     const debator=await Debator.findOne({email});
    if(!debator){
      const coach=await Coach.findOne({email})
      if(!coach){
        return res.status(404).json({ message: "User not found" });
      }
      else{
        const status=coach.status;
        if(status!=="approved"){
          return res.status(401).json({ message: "Your account is not approved yet" });
        }
        const isPasswordValid = await bcrypt.compare(password,coach.password);
        if(!isPasswordValid){
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = await createToken(coach);
        return res.status(200).json({message:"Login successful",debator:{id:coach._id,name:coach.name,role:coach.role,email:coach.email},token:token})
      }
    }
    const isPasswordValid = await bcrypt.compare(password,debator.password);
    if(!isPasswordValid){
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await createToken(debator);
    return res.status(200).json({message:"Login successful",debator:{id:debator._id,name:debator.name,role:debator.role,email:debator.email,image:debator.image},token:token})

  }
  catch(error){
    console.error("Error in Login:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });

  }
}
