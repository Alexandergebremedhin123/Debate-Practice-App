import Coach from "../Models/CoachModel.js";

export const GetLatestSessions=async(req,res)=>{
    try {
    
        const coaches = await Coach.find({ "sessions.0": { $exists: true } })
          .populate("sessions.debatorId", "name")
          .lean();
    
        let sessions = [];
        coaches.forEach((coach) => {
          coach.sessions.forEach((session) => {
            sessions.push({
              id: session._id,
              debator: session.debatorId?.name || session.debatorName || "Unknown",
              coach: coach.name || "Unknown",
              date: new Date(session.sessionDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              time: session.time,
              status: session.status,
            });
          });
        });
    
        
        sessions = sessions
          .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate))
          .slice(0, 5);
    
        res.status(200).json(sessions);
      } catch (error) {
        console.error("Error fetching latest sessions:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
}
export const GetAllSessions=async(req,res)=>{
    try {
       
        const coaches = await Coach.find({ "sessions.0": { $exists: true } })
          .populate("sessions.debatorId", "name")
          .lean();
    
        let sessions = [];
        coaches.forEach((coach) => {
          coach.sessions.forEach((session) => {
            sessions.push({
              id: session._id,
              debator: session.debatorId?.name || "Unknown",
              coach: coach.name || "Unknown",
              date: new Date(session.sessionDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              time: session.time,
              status: session.status,
            });
          });
        });
    
       
        sessions = sessions
          .sort((a, b) => new Date(b.sessionDate) - new Date(a.sessionDate));
    
        res.status(200).json(sessions);
      } catch (error) {
        console.error("Error fetching latest sessions:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }

}

export const DeleteSession=async(req,res)=>{
  try {
    const { sessionId } = req.params;
    const result = await Coach.updateOne(
      { "sessions._id": sessionId },
      { $pull: { sessions: { _id: sessionId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
