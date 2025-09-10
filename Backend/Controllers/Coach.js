import cloudinary from '../Config/Cloudinary.js'
import Coach from '../Models/CoachModel.js';
import bcrypt from 'bcryptjs';
import Debator from '../Models/User.js';
import mongoose from 'mongoose';

export const AddCoach = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      image,
      address,
      about,
    } = req.body;
    const findEmailUser=await Debator.findOne({email})
    const findEmail=await Coach.findOne({email})
    if(findEmail || findEmailUser){
      return res.status(400).json({ message: "Email already exists" });
    }
    const encryptedPassword = await bcrypt.hash(password,10)


    if (!name || !email || !password || !address || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageResult;

    if (image) {
      const result = await cloudinary.uploader.upload(image, { folder: "Debate_Practice_App/Coaches" });
      imageResult = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
const defaultImage='https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-doctor-avatar-icon-illustration-png-image_8537702.png'
    const coach = new Coach({
      name,
      email,
      password: encryptedPassword,
      address,
      about,
      image: imageResult?.url || defaultImage, 
    });

    await coach.save();

    return res.status(200).json({
      message: "Coach added successfully",
      data: {
        name,
        email,
        password,
        address,
        about,
        image: imageResult, 
      },
    });

  } catch (error) {
    console.error("Error in Adding Coach:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
export const GetCoachProfile=async(req,res)=>{
  try{
    const {id}=req.params
    const coach=await Coach.findById(id);
    if(!coach){
      return res.status(404).json({ message: "No coach found" });
    }
    return res.status(200).json(coach)

  }
  catch(error){
    console.error("Error in Getting Coaches Profile:", error);
    return res.status(500).json({ message: "Something went wrong", error });

  }
}
export const DeleteCoach=async(req,res)=>{
  try{
    const {id}=req.params
    const coach=await Coach.findByIdAndDelete(id);
    if(!coach){
      return res.status(404).json({ message: "No coach found" });
    }
    return res.status(200).json({message:"Coach deleted successfully"})

  }
  catch(error){
    console.error("Error in Deleting Coach:", error);
    return res.status(500).json({ message: "Something went wrong", error });

  }
}
export const GetApprovedCoaches=async(req,res)=>{
  try{
    const coaches=await Coach.find({status:"approved"});
    return res.status(200).json(coaches)
  }
  catch(error){
    console.error("Error in Getting Approved Coaches:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetRequestedCoaches=async(req,res)=>{
  try{
    const coaches=await Coach.find({status:"pending"});
    return res.status(200).json(coaches)
  }
  catch(error){
    console.error("Error in Getting Requested Coaches:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const ApproveCoach=async(req,res)=>{
  try{
    const {id}=req.params
    const coach=await Coach.findById(id);
    if(!coach){
      return res.status(404).json({ message: "No coach found" });
    }
    coach.status="approved"
    await coach.save()
    return res.status(200).json({message:"Coach approved successfully",coach})

  }
  catch(error){
    console.error("Error in Approving Coach:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetNumberofCoaches=async(req,res)=>{
  try{
    const totalNoOfCoaches=await Coach.countDocuments({status:"approved"});
    return res.status(200).json({message:"Total number of coaches",totalNoOfCoaches})
  }
  catch(err){
      console.err('Error in Fetching Number of Coaches: ',err)
      return res.status(500).json({message:"Something went wrong",error});
  }
}

export const GetSessions = async (req, res) => {
  try {
    const coachId = req.params.id;
    const coach = await Coach.findById(coachId).populate("sessions.debatorId", "name age image");
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }
    const sessions = coach.sessions.map((session) => {
      const debator = session.debatorId; 
      return {
        debatorName: debator?.name,
        debatorImage: debator?.image,
        debatorAge: debator?.age,
        sessionDate: session.sessionDate,
        time: session.time,
        status: session.status,
      };
    });

    res.json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const CompleteSession=async(req,res)=>{
  try {
    const { coachId, sessionId } = req.params;
    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const session = coach.sessions.find(
      (session) => session._id === sessionId
    );
    console.log("All session IDs:", coach.sessions.map(s => s._id));
    console.log(session)
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "Pending") {
      return res.status(400).json({ message: "Cannot complete a non-pending session" });
    }

    session.status = "Completed";
    coach.earnings = (coach.earnings || 0) + coach.fees;
    await coach.save();

    const debatorUpdateResult = await Debator.updateOne(
      { "sessions._id": sessionId },
      { $set: { "sessions.$.status": "Completed" } }
    );

    if (debatorUpdateResult.matchedCount === 0) {
      console.warn("No matching debator session found for ID:", sessionId);
    }
    const debator = await Debator.findOne({ "sessions._id": sessionId });
    if (debator) {
      debator.notifications.push({
        message: `Your session with ${coach.name} on ${new Date(session.sessionDate).toLocaleDateString()} at ${session.time} has been completed.`,
        timestamp: new Date(),
        isRead: false,
      });
      await debator.save();
    } else {
      console.warn("No debator found with session ID:", sessionId);
    }

    res.json({ message: "Session completed successfully" });
  } catch (error) {
    console.error("Error completing session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const CancelSession=async(req,res)=>{
  try {
    const { coachId, sessionId } = req.params;
   
    const coach = await Coach.findById(coachId);
    if (!coach) return res.status(404).json({ message: "Coach not found" });

    const session = coach.sessions.id(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status !== "Pending") {
      return res.status(400).json({ message: "Cannot cancel a non-pending session" });
    }

    session.status = "Cancelled";
    await coach.save();

    const user =await Debator.updateOne(
      { "sessions._id": sessionId },
      { $set: { "sessions.$.status": "Cancelled" } }
    );
    res.json({ message: "Session cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling session:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const GetNumberofDebators=async(req,res)=>{
  try{
    const {coachId}=req.params;
    const coach=await Coach.findById(coachId).lean();
    if(!coach){
      return res.status(404).json({message: "Coach not found"});
    }
    const uniqueDebators=new Set(coach.sessions.map((session)=>session.debatorId.toString()));
    const debatorCount=uniqueDebators.size;
    res.json({debators:debatorCount});
  }
  catch(err){
    console.error("Error fetching total debators: ",err);
    res.status(500).json({message:"Server error"})
  }
}

export const LatestSessions=async(req,res)=>{
    try {
      const { coachId } = req.params;
    
      const coach = await Coach.findById(coachId).lean();
      if (!coach) {
        return res.status(404).json({ message: "Coach not found" });
      }
      const latestSessions = coach.sessions
        .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
        .slice(0, 5)
        .map((session) => ({
          debator: session.debatorName || "Unknown",
          time: `${new Date(session.sessionDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })} ${session.time}`,
          status: session.status,
        }));
  
      res.json({ latestSessions });
    } catch (error) {
      console.error("Error fetching latest sessions:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const TotalSessions=async(req,res)=>{
  try {
    const { coachId } = req.params;

    const coach = await Coach.findById(coachId).lean();
    if (!coach) {
      return res.status(404).json({ message: "Coach not found" });
    }

    const sessionCount = coach.sessions.length;

    res.json({ sessions: sessionCount });
  } catch (error) {
    console.error("Error fetching session count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const FindCoach=async(req,res)=>{
  try {
    const { name } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' }; 
    const coaches = await Coach.find(query);
    res.json({ coaches });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
export const GetNotifications=async(req,res)=>{
  try {
    const { coachId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

      const coach = await Coach.findById(coachId, "notifications");

    if (!coach) {
      return res.status(404).json({ error: `${coachType} not found` });
    }

    const notifications = coach.notifications.sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
export const ClearNotifications=async(req,res)=>{
  try {
    const { coachId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(coachId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const coach = await Coach.findById(coachId);
    if (!coach) {
      return res.status(404).json({ error: "coach not found" });
    }

    coach.notifications = [];
    await coach.save();

    res.status(200).json({ message: "Notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
}
