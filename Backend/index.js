import express from 'express'
const app=express()
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv'
import bcrypt from "bcryptjs";
import CoachRoutes from './Routes/Coach.js'
import AuthRoutes from './Routes/Auth.js'
import UserRoutes from './Routes/User.js'
import AdminRoute from './Routes/Admin.js'
import Debator from './Models/User.js';
dotenv.config()
import db from './db.js'
dotenv.config()

const port=process.env.PORT


// app.use(cors({
//   origin: "https://doctor-appointment-app-sigma.vercel.app", 
//   methods: "GET,POST,PUT,DELETE",   
//   credentials: true              
// }));
const allowedOrigins = [process.env.FRONTEND_URL];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); 

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const existingAdmin = await Debator.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    await Debator.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      age: 0,            // placeholder
      gender: "Other",   // placeholder
      address: "System", // placeholder
    });

    console.log(" Admin user seeded");
  }
};




app.use('/api/coach', CoachRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use("/api/admin",AdminRoute)




app.listen(port,()=>{
  console.log(`listening on port ${port}`)
  // seedAdmin();
})

