import express from "express"
import { DeleteSession, GetAllSessions, GetLatestSessions } from "../Controllers/Admin.js";

const router=express.Router();
router.get("/GetLatestSessions",GetLatestSessions);
router.get("/GetAllSessions",GetAllSessions);
router.delete("/delete-session/:sessionId",DeleteSession);


export default router;