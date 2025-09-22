import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

export const axiosInstance = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api"   
    : "https://debate-practice-app.onrender.com/api", 
  withCredentials: true
});
