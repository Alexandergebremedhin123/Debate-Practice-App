import express from 'express'
import { AddCoach, ApproveCoach, CancelSession, ClearNotifications, CompleteSession, DeleteCoach, FindCoach, GetSessions, GetApprovedCoaches, GetCoachProfile, GetNotifications, GetNumberofCoaches, GetNumberofDebators, GetRequestedCoaches,  LatestSessions, TotalSessions } from '../Controllers/Coach.js';
const router = express.Router();

router.post('/add-coach',AddCoach);
router.get('/get-coach/:id', GetCoachProfile);
router.get('/get-approved-coaches',GetApprovedCoaches);
router.get('/get-requested-coaches',GetRequestedCoaches);
router.put(`/approve-coach/:id`,ApproveCoach);
router.get('/total-coaches',GetNumberofCoaches);
router.get('/total-debators/:coachId',GetNumberofDebators);
router.delete('/delete-coach/:id',DeleteCoach);
router.get('/get-sessions/:id',GetSessions);
router.put('/complete-sessions/:coachId/:sessionId',CompleteSession);
router.put('/cancel-sessions/:coachId/:sessionId',CancelSession);
router.get('/latest-sessions/:coachId',LatestSessions);
router.get('/total-sessions/:coachId',TotalSessions);
router.get("/find-coaches",FindCoach);
router.get("/get-notifications/:coachId",GetNotifications);
router.delete("/clear-notifications/:coachId",ClearNotifications);



export default router