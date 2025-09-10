// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.MODE === "development"
//         ? "http://localhost:5000/api"
//         : import.meta.env.VITE_API_URL,  // Use full Render backend URL
//     withCredentials: true
// });
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === "development"
        ? "http://localhost:5000/api"
        : process.env.REACT_APP_API_URL, 
    withCredentials: true
});