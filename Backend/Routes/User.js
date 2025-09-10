import express from 'express'
import { ApplyAsCoach, CancelSession, ClearNotifications, DeleteSession, GetSession, GetNotifications, GetNumberOfDebators, GetProfile, GetUserSessions, SetSession }  from '../Controllers/User.js';
import verifyToken from '../Middleware/Verify-Token.js';

const router=express.Router();
router.get('/profile/:id',verifyToken, GetProfile);
router.post("/apply",ApplyAsCoach);
router.get('/total-debators',GetNumberOfDebators);
router.post('/set-session',verifyToken,SetSession);
router.get('/get-sessions',verifyToken,GetUserSessions)
router.put("/cancel-session/:debatorId/:sessionId",CancelSession);
router.get("/session/:sessionId",verifyToken,GetSession)
router.delete('/delete-session/:sessionId',DeleteSession);
router.get("/get-notifications/:userId",GetNotifications);
router.delete("/clear-notifications/:userId",ClearNotifications)

export default router