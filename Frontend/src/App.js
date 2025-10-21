import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollTop";
import UserRoutes from "./Routes/UserRoute";
import Signup from "../src/Pages/Auth/Signup";
import AdminRoutes from "./Routes/AdminRoutes";
import CoachRoutes from "./Routes/CoachRoutes";
import NotFound from "./Pages/User/NotFound";
import Login from "./Pages/Auth/Login";

function App() {
  const location = useLocation();
  
  const userRole = JSON.parse(localStorage.getItem("User"))?.role|| "user";

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 bg-teal-500 opacity-30 z-[-1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23007E85' fill-opacity='1' d='M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,197.3C672,213,768,235,864,229.3C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#E6F3F4",
        }}
      />
      <Toaster
        position="top-center"
        containerStyle={{
          top: "10px",
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "white",
            color: "black",
            padding: "10px 20px",
            borderRadius: "8px",
          },
        }}
      />

      <ScrollToTop />

      {location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        userRole === "user" && <Navbar />}

      <main className="relative z-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {userRole === "user" && <Route path="/*" element={<UserRoutes />} />}
          {userRole==="admin" && <Route path="/*" element={<AdminRoutes />} />}
          {userRole === "Coach" && <Route path="/*" element={<CoachRoutes />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {location.pathname !== "/login" &&
        location.pathname !== "/signup" &&
        userRole === "user" }

      {location.pathname !== "/login" }

      {location.pathname !== "/login" &&
        location.pathname !== "/signup" && <Footer />}
    </div>
  );
}

export default App;
