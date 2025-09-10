import Coach from '../Models/CoachModel.js';
import Debator from '../Models/User.js'
import bcrypt from 'bcryptjs';
import cloudinary from '../Config/Cloudinary.js';
import { mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const GetProfile=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await Debator.findById(id);
        if(!user){
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}

export const ApplyAsCoach = async (req, res) => {
  try {
    const {name,email,password,image,address,about} = req.body;

    const findEmailUser = await Debator.findOne({ email });
    const findEmailCoach = await Coach.findOne({ email });

    if (findEmailUser || findEmailCoach) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!name || !email || !password || !address || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    let imageResult;
    const defaultImage = "https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-doctor-avatar-icon-illustration-png-image_8537702.png";

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "Debate_Practice_App/Coaches",
        });
        imageResult = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    const coach = new Coach({
      name,
      email,
      password: encryptedPassword,
      address,
      about,
      status: "pending",
      image: imageResult?.url || defaultImage, 
    });

    
    await coach.save();


    const admin = await Debator.findOne({ role: "admin" });
    if (admin) {
      admin.notifications.push({
        message: `New coach session submitted by ${name}`,
        timestamp: new Date(),
        isRead: false,
      });
      await admin.save();
    } else {
      console.warn("No admin user found for notification");
    }

  
    return res.status(201).json({ message: "Coach session submitted successfully" });
  } catch (error) {
    console.error("Error in Applying for a Coach position:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const GetNumberOfDebators=async(req,res)=>{
  try{
    const totalNoOfDebators=await Debator.countDocuments();
    return res.status(200).json({message:"Total number of debators",totalNoOfDebators})
  }
  catch(error){
    console.error("Error in Fetching number of Debators: ", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const SetSession = async (req, res) => {
  try {
    const { coachId, date, time } = req.body;
    const debatorId = req.user.id;

    if (!coachId || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const sessionDate = new Date(date);
    if (isNaN(sessionDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const coach = await Coach.findById(coachId);
    if (!coach || coach.status !== "approved") {
      return res.status(404).json({ message: "Coach not found or not approved" });
    }

    const isCoachSlotTaken = coach.sessions.some(
      (s) =>
        s.sessionDate.toISOString() === sessionDate.toISOString() &&
        s.time === time &&
        s.status !== "Cancelled" &&
        s.status !== "Cancellation Requested"
    );
    if (isCoachSlotTaken) {
      return res.status(409).json({ message: "This time slot is already booked with the coach." });
    }

    const debator = await Debator.findById(debatorId);
    if (!debator) {
      return res.status(404).json({ message: "Debator not found." });
    }

    const isDebatorSlotTaken = debator.sessions.some(
      (s) =>
        s.sessionDate.toISOString() === sessionDate.toISOString() &&
        s.time === time &&
        s.status !== "Cancelled" &&
        s.status !== "Cancellation Requested"
    );
    if (isDebatorSlotTaken) {
      return res.status(409).json({ message: "You already have a session scheduled at this time." });
    }

    const sessionId = new Date().getTime().toString(); // generate unique ID
const sessionForCoach = {
  debatorId: new mongoose.Types.ObjectId(debatorId),
  debatorName: debator.name || "Unknown",
  sessionDate,
  time,
  status: "Pending",
  feePaid: false,
};


const sessionForDebator = {
 
  coachId: new mongoose.Types.ObjectId(coachId),
  sessionDate,
  time,
  status: "Pending",
};

    const updatedCoach = await Coach.findByIdAndUpdate(
      coachId,
      { $push: { sessions: sessionForCoach } },
      { new: true }
    );

    await Debator.findByIdAndUpdate(
      debatorId,
      { $push: { sessions: sessionForDebator } },
      { new: true }
    );

    const formattedDate = sessionDate.toLocaleDateString();

    await Coach.findByIdAndUpdate(coachId, {
      $push: {
        notifications: {
          message: `A new session with ${debator.name || "Unknown"} has been booked for ${formattedDate} at ${time}`,
          timestamp: new Date(),
          isRead: false,
        },
      },
    });

    res.status(201).json({ message: "Session booked successfully", sessionId });
  } catch (error) {
    console.error("Error booking session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetUserSessions=async(req,res)=>{
  try {

    const debatorId = req.user.id;
    if (!debatorId) {
      return res.status(403).json({ message: "Unauthorized: You can only view your own sessions" });
    }

    const debator = await Debator.findById(debatorId).populate("sessions.coachId", "name image fees");
    if (!debator) {
      return res.status(404).json({ message: "Debator is not found" });
    }

    const sessions = debator.sessions.map((session) => ({
      _id: session._id,
      coachName: session.coachId?.name || "Unknown Coach",
      coachImage: session.coachId?.image,
      sessionDate: session.sessionDate,
      time: session.time,
      fees: session.coachId?.fees || "N/A",
      status: session.status,
    }));

    res.json({ sessions });
  } catch (error) {
    console.error("Error fetching debators session:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const CancelSession=async(req,res)=>{
  try {
    const { debatorId, sessionId } = req.params;

    const debator = await Debator.findById(debatorId);
    if (!debator) {
      return res.status(404).json({ message: "Debator is not found" });
    }

    const debatorSession = debator.sessions.id(sessionId);
    
    if (!debatorSession) {
      return res.status(404).json({ message: "Session is not found" });
    }

    if (debatorSession.status !== "Pending") {
      return res.status(400).json({ message: "Only pending sessions can be cancelled" });
    }

    debatorSession.status = "Cancelled";
    await debator.save();

    const coach = await Coach.findOne({ "sessions._id": sessionId });
    if (!coach) {
      console.warn("Coach is not found for session ID:", sessionId);
      return res.status(200).json({ message: "Session is cancelled successfully" });
    }

    const coachSession = coach.sessions.id(sessionId);
    if (coachSession) {
      coachSession.status = "Cancelled";

      let debatorName = debator.name 
      const sessionDate = coachSession.sessionDate || debatorSession.date; 
      const formattedDate = sessionDate
        ? new Date(sessionDate).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "an unspecified date";
      const notificationMessage = `Your session with ${debatorName} on ${formattedDate} was cancelled by the debator.`;

      coach.notifications.push({
        message: notificationMessage,
        timestamp: new Date(),
        isRead: false,
      });

      await coach.save();
    } else {
      console.warn("Session ID is not found in coach's sessions:", sessionId);
    }

    res.status(200).json({ message: "Session is cancelled successfully" });
  } catch (error) {
    console.error("Error in cancelling session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const GetSession = async (req, res) => {
  try {
  const { sessionId } = req.params;
  const debatorId = req.user.id;
  
  const debator = await Debator.findById(debatorId);
  if (!debator) {
  return res.status(404).json({ message: "Debator is not found" });
  }
  
  const session = debator.sessions.find(
  (session) => session._id.toString() === sessionId
  );
  if (!session) {
  return res.status(404).json({ message: "Session is not found" });
  }

  const coach = await Coach.findById(session.coachId);
  if (!coach) {
  return res.status(404).json({ message: "Coach is not found" });
  }
  
  const sessionDetails = {
  _id: session._id,
  coachName: coach.name,
  sessionDate: session.sessionDate,
  time: session.time,
  fees: coach.fees,
  status: session.status,
  coachImage: coach.image,
  };
  
  res.status(200).json({ session: sessionDetails });
  } catch (error) {
  console.error("Error in fetching session:", error);
  res.status(500).json({ message: "Server error", error: error.message });
  }
  };
export const DeleteSession=async(req,res)=>{
  try {
    const { sessionId } = req.params;
    const result = await Debator.updateOne(
      { "sessions._id": sessionId },
      { $pull: { sessions: { _id: sessionId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Session is not found" });
    }

    res.status(200).json({ message: "Session is deleted successfully" });
  } catch (error) {
    console.error("Error in deleting session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const GetNotifications=async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await Debator.findById(userId, "notifications");
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }

    const notifications = user.notifications.sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error in fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
export const ClearNotifications=async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await Debator.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User is not found" });
    }

    user.notifications = [];
    await user.save();

    res.status(200).json({ message: "Notifications are cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
}