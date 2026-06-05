import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { createLogger } from "../lib/logger.js";

const logger = createLogger("AUTH", true);

export const signup = async (req, res) => {
  const { firebaseUid, email, fullName } = req.body;

  try {
    if (!firebaseUid || !email || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const newUser = new User({
      firebaseUid,
      fullName,
      email,
    });

    const savedUser = await newUser.save();
    
    res.status(201).json({
      _id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    logger.error("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  const { firebaseUid, email, fullName, profilePic } = req.body;

  try {
    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "Firebase UID and Email are required" });
    }

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.firebaseUid = firebaseUid;
        if (!user.profilePic && profilePic) user.profilePic = profilePic;
        await user.save();
      } else {
        const newUser = new User({
          firebaseUid,
          email,
          fullName: fullName || email.split("@")[0],
          profilePic: profilePic || "",
        });
        user = await newUser.save();
      }
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    logger.error("Error in googleAuth controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    try {
      const uploadResponse = await cloudinary.uploader.upload(profilePic, {
        resource_type: "auto",
        folder: "chugli_profiles",
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );

      const { io } = await import("../lib/socket.js");
      io.emit("userProfileUpdated", {
        userId: updatedUser._id,
        profilePic: uploadResponse.secure_url,
        fullName: updatedUser.fullName,
      });

      res.status(200).json(updatedUser);
    } catch (cloudinaryError) {
      logger.error("Cloudinary upload error:", cloudinaryError);
      return res.status(500).json({ 
        message: "Failed to upload image to Cloudinary",
        error: cloudinaryError.message 
      });
    }
  } catch (error) {
    logger.error("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// We don't need login, logout, forgotPassword, verifyResetCode anymore 
// because Firebase Auth handles them directly on the frontend.
