import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URL=process.env.MONGO_URL
const DB_NAME=process.env.DB_NAME

mongoose.connect(MONGO_URL,{
    dbName:DB_NAME
}).then(()=>{
    console.log('Connected to DB')
})
.catch((err)=>{
    console.log('Error connecting to DB',err)
})
export default mongoose;