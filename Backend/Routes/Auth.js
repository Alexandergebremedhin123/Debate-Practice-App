import express from 'express'
import {  Login, Signup } from '../Controllers/Auth.js';
const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login);

export default router