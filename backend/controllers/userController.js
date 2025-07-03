const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const { sendWelcomeEmail,sendOTP} = require("../utils/email");
const {generateVerificationCode} = require('../utils/generateTokens')


function extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
  
    // Replace dots and underscores with spaces, capitalize each word
    return localPart
      .replace(/[\._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

const createUser = async(req, res) => {
    try {
        const {email} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const name = extractNameFromEmail(email);

        const userData = await User.create({
            name,
            email,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
          
        });

        await sendWelcomeEmail(name,email);
         
        res.status(201).json({ message: 'User created successfully', user: userData });
    } catch (err) {
        console.log("Error in creating user:", err);
        res.status(500).json({ message: 'Error in creating user', error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const verificationCode = generateVerificationCode();

        await sendOTP(email, verificationCode);
        console.log("Verification code sent to email:", email);

        // Generate a token
        // const token = jwt.sign(
        //     { userId: existingUser._id, email: existingUser.email },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '1h' } 
        // );
        
        // try{
        //     res.cookie("token", token, {
        //         httpOnly: true,
        //         //secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
        //         sameSite: "Strict", // Adjust based on your CSRF protection needs
        //         maxAge: 3600000 // 1 hour in milliseconds
        //     });

        //     console.log("cookie is storeed !! lessgooooooooo")

        // }catch(err){
        //     console.log("cookie is  not storeed !! less not gooooooooo", err)
        // }

      

       

        return res.status(200).json({
            message: "OTP Sent to email",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: 'Error during login', error: err.message });
    }
};

const logout = async (req,res) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};



//Verification Emails
const verifyEmail = async(req,res)=>{
    const {verificationToken} = req.body;
    try{
        console.log(req.body)
         console.log(verificationToken)
        const user = await User.findOne({verificationToken:verificationToken,verificationTokenExpiresAt:{$gt : Date.now()}})

        if(!user){
            console.log("NO user found")
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification token"
            });
        }
        console.log("user found:", user)
          
        user.isVerified = true;

          // Generate a token
        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        
        try{
            res.cookie("token", token, {
                httpOnly: true,
                //secure: process.env.NODE_ENV === 'production', // Only set on HTTPS in production
                sameSite: "Strict", // Adjust based on your CSRF protection needs
                maxAge: 3600000 // 1 hour in milliseconds
            });

            console.log("cookie is storeed !! lessgooooooooo")

        }catch(err){
            console.log("cookie is  not storeed !! less not gooooooooo", err)
        }

        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined ;
        await user.save()

        res.status(200).json({success:true,message:"Email Verified Successfully"})
    }catch(err){
        console.log('Err in email verification', err)
        res.status(500).json({message:'Error in verifyEmail Controller'})
    }
}


// Get user profile
const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password -verificationToken');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: 'Failed to get user profile', error: err.message });
    }
  };
  
  // Update user profile
  const updateUserProfile = async (req, res) => {
    try {
      const { name, bio, status } = req.body;
  
      // If a file is uploaded, get the Cloudinary URL from multer middleware
      const profilePic = req.file ? req.file.path : undefined;
  
      // Build update object dynamically
      const updateData = {};
      if (name) updateData.name = name;
      if (bio) updateData.bio = bio;
      if (status) updateData.status = status;
      if (profilePic) updateData.profilePic = profilePic;
  
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      ).select('-password -verificationToken');
  
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Profile update failed', error: err.message });
    }
  };
  
  // Get all users (e.g. for admin/chat list)
 const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password -verificationToken');
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
  };
  
  // Update socketId and online status
 const updateSocketStatus = async (req, res) => {
    try {
      const { socketId, isOnline } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { socketId, isOnline },
        { new: true }
      );
  
      res.status(200).json({ message: 'Socket status updated', user });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update socket status', error: err.message });
    }
  };


module.exports = {
    createUser,
    login,
    logout,
    verifyEmail,
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    updateSocketStatus
};